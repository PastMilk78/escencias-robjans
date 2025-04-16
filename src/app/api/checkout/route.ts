import { NextRequest, NextResponse } from 'next/server';
import stripeService from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, userInfo } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // Verificar la configuración de Stripe
    const configOk = stripeService.checkStripeConfig();
    if (!configOk) {
      console.error('La configuración de Stripe está incompleta');
      return NextResponse.json(
        { error: 'Error de configuración del sistema de pagos. Por favor, contacte al administrador.' }, 
        { status: 500 }
      );
    }

    // Obtener la instancia de Stripe
    const stripe = await stripeService.getStripeInstance();
    
    if (!stripe) {
      console.error('No se pudo inicializar Stripe');
      return NextResponse.json(
        { error: 'No se pudo inicializar el sistema de pagos. Por favor, contacte al administrador.' }, 
        { status: 500 }
      );
    }

    // Preparar los ítems para Stripe
    const lineItems = items.map((item: any) => {
      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.producto.nombre,
            description: item.producto.descripcion || 'Perfume de alta calidad',
            images: [item.producto.imagen || 'https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg'],
            metadata: {
              product_id: item.producto._id,
            },
          },
          unit_amount: Math.round(item.producto.precio * 100), // Stripe usa centavos
        },
        quantity: item.cantidad,
      };
    });

    console.log('Creando sesión de checkout con los siguientes items:', JSON.stringify(lineItems, null, 2));

    // Crear la sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
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
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error al crear la sesión de checkout:', error);
    let errorMessage = 'Error al procesar el pago';
    
    if (error.type && error.type.startsWith('Stripe')) {
      // Manejar errores específicos de Stripe
      errorMessage = 'Error en el sistema de pagos: ' + (error.message || 'Detalles no disponibles');
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 