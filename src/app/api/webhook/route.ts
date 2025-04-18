import { NextRequest, NextResponse } from 'next/server';
import stripeService from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    console.log('Recibiendo webhook de Stripe...');
    
    // Obtener el cuerpo de la solicitud como texto
    const text = await request.text();
    const sig = request.headers.get('stripe-signature');
    
    if (!sig) {
      console.error('No se encontró la firma del webhook (stripe-signature)');
      return NextResponse.json({ error: 'Falta signature' }, { status: 400 });
    }
    
    // Obtener la instancia de Stripe
    const stripe = await stripeService.getStripeInstance();
    
    if (!stripe) {
      console.error('No se pudo inicializar Stripe para el webhook');
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
    
    // Obtener la clave secreta del webhook
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('La clave secreta del webhook no está configurada');
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }
    
    let event;
    
    try {
      // Validar la firma del webhook
      event = stripe.webhooks.constructEvent(text, sig, webhookSecret);
      console.log('Evento de webhook verificado:', event.type);
    } catch (err: any) {
      console.error('Error al validar firma del webhook:', err.message);
      return NextResponse.json({ error: `Error de firma del webhook: ${err.message}` }, { status: 400 });
    }
    
    // Manejar los diferentes eventos de Stripe
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Sesión de checkout completada:', session.id);
        
        // Aquí puedes actualizar tu base de datos con la información de la compra
        // Por ejemplo, actualizar el estado de un pedido, decrementar el stock, etc.
        
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Pago exitoso:', paymentIntent.id);
        
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Pago fallido:', failedPayment.id);
        
        break;
        
      default:
        // Evento no manejado
        console.log(`Evento no manejado: ${event.type}`);
    }
    
    // Responder con éxito
    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    console.error('Error general al procesar webhook:', error);
    return NextResponse.json(
      { error: 'Error al procesar webhook', message: error.message }, 
      { status: 500 }
    );
  }
} 