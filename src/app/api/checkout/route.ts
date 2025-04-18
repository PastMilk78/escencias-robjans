import { NextRequest, NextResponse } from 'next/server';
import stripeService from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    console.log('--------------------------------------------');
    console.log('Iniciando procesamiento de checkout');
    console.log('Variables de entorno disponibles:');
    // Solo mostrar si están definidas, sin mostrar el valor
    console.log({
      MONGODB_URI: !!process.env.MONGODB_URI,
      STRIPE_PUBLIC_KEY: !!process.env.STRIPE_PUBLIC_KEY,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      NEXT_PUBLIC_STRIPE_PUBLIC_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    });
    console.log('--------------------------------------------');

    const body = await request.json();
    const { items, userInfo } = body;

    if (!items || items.length === 0) {
      console.error('Error: El carrito está vacío');
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    console.log(`Procesando checkout para ${items.length} productos`);
    console.log('Datos de los items:', JSON.stringify(items.map((item: any) => ({
      id: item.producto._id,
      nombre: item.producto.nombre,
      precio: item.producto.precio,
      cantidad: item.cantidad
    }))));

    // Verificar la configuración de Stripe
    const configOk = stripeService.checkStripeConfig();
    if (!configOk) {
      console.error('La configuración de Stripe está incompleta');
      // Mostrar qué variables de entorno están disponibles (sin mostrar los valores)
      const envVars = {
        NEXT_PUBLIC_STRIPE_PUBLIC_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
        STRIPE_PUBLIC_KEY: !!process.env.STRIPE_PUBLIC_KEY,
        STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      };
      console.log('Estado de variables de entorno:', envVars);
      
      return NextResponse.json(
        { error: 'Error de configuración del sistema de pagos. Por favor, contacte al administrador.' }, 
        { status: 500 }
      );
    }

    // Obtener la instancia de Stripe
    console.log('Obteniendo instancia de Stripe...');
    const stripe = await stripeService.getStripeInstance();
    
    if (!stripe) {
      console.error('No se pudo inicializar Stripe');
      return NextResponse.json(
        { error: 'No se pudo inicializar el sistema de pagos. Por favor, contacte al administrador.' }, 
        { status: 500 }
      );
    }
    
    console.log('Instancia de Stripe obtenida correctamente');

    // Obtener el origen de la solicitud de forma segura
    let originUrl = 'https://escencias-robjans.vercel.app';
    try {
      // Intentar obtener el origen de la solicitud actual
      const headerOrigin = request.headers.get('origin');
      const urlOrigin = request.nextUrl.origin;
      
      if (headerOrigin && headerOrigin !== 'null') {
        originUrl = headerOrigin;
      } else if (urlOrigin && urlOrigin !== 'null') {
        originUrl = urlOrigin;
      }
      
      console.log('Origen detectado:', originUrl);
    } catch (err) {
      console.warn('No se pudo determinar el origen, usando valor predeterminado:', originUrl);
    }

    // Preparar los ítems para Stripe
    const lineItems = [];
    
    // Procesar cada producto y asegurar que las imágenes sean URLs válidas
    for (const item of items) {
      // URL predeterminada para imagen
      const defaultImageUrl = 'https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg';
      
      // Imprimir información del producto para depuración
      console.log('Procesando producto:', {
        id: item.producto._id,
        nombre: item.producto.nombre,
        imagenOriginal: item.producto.imagen
      });
      
      // Crear el item para Stripe
      const lineItem = {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.producto.nombre,
            description: item.producto.descripcion || 'Perfume de alta calidad',
            // Usar siempre la imagen predeterminada para evitar problemas
            images: [defaultImageUrl],
            metadata: {
              product_id: item.producto._id,
            },
          },
          unit_amount: Math.round(item.producto.precio * 100), // Stripe usa centavos
        },
        quantity: item.cantidad,
      };
      
      lineItems.push(lineItem);
      console.log(`Producto ${item.producto.nombre} agregado con imagen: ${defaultImageUrl}`);
    }

    console.log('Creando sesión de checkout con los siguientes items:', JSON.stringify(lineItems, null, 2));
    
    // Construir las URLs absolutas
    const successUrl = `${originUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${originUrl}/checkout/cancel`;
    
    console.log('URLs de redirección:', {
      success: successUrl,
      cancel: cancelUrl
    });

    // Crear la sesión de checkout
    try {
      console.log('Iniciando creación de sesión en Stripe...');
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        shipping_address_collection: {
          allowed_countries: ['MX'],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 0,
                currency: 'mxn',
              },
              display_name: 'Entrega gratuita',
            },
          },
        ],
        metadata: {
          userEmail: userInfo?.email || '',
          userPhone: userInfo?.phone || '',
        },
      });

      console.log('Sesión de checkout creada exitosamente:', session.id);
      console.log('URL de redirección:', session.url);
      return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (stripeError: any) {
      console.error('Error específico de Stripe al crear la sesión:', stripeError);
      console.error('Mensaje de error:', stripeError.message);
      console.error('Código de error:', stripeError.code);
      console.error('Tipo de error:', stripeError.type);
      
      if (stripeError.raw) {
        console.error('Error raw:', stripeError.raw);
      }
      
      return NextResponse.json(
        { 
          error: `Error de Stripe: ${stripeError.message}`,
          code: stripeError.code || 'unknown' 
        }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error general al crear la sesión de checkout:', error);
    console.error('Stack trace:', error.stack);
    let errorMessage = 'Error al procesar el pago';
    
    if (error.type && error.type.startsWith('Stripe')) {
      // Manejar errores específicos de Stripe
      errorMessage = 'Error en el sistema de pagos: ' + (error.message || 'Detalles no disponibles');
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      message: error.message || 'Sin detalles adicionales'
    }, { status: 500 });
  }
} 