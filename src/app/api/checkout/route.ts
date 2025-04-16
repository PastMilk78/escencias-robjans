import { NextRequest, NextResponse } from 'next/server';
import stripeService from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, userInfo } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // Obtener la instancia de Stripe
    const stripe = await stripeService.getStripeInstance();
    
    if (!stripe) {
      return NextResponse.json(
        { error: 'No se pudo inicializar Stripe. Contacta al administrador.' }, 
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
            description: item.producto.descripcion,
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

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 