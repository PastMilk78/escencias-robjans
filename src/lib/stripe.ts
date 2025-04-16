// This file handles the Stripe API integration

// Definición de la clase Stripe
class StripeService {
  private initialized = false;
  private stripeInstance: any = null;

  // Método para inicializar Stripe solo cuando se necesite
  async getStripeInstance() {
    // Solo importamos y configuramos Stripe cuando se necesita
    if (!this.initialized) {
      try {
        // Importación dinámica de Stripe
        const { Stripe } = await import('stripe');
        
        // Verificar que la clave secreta está disponible
        const secretKey = process.env.STRIPE_SECRET_KEY;
        
        if (!secretKey) {
          console.error('ERROR: STRIPE_SECRET_KEY no está configurada en las variables de entorno.');
          console.error('Asegúrese de agregar las variables de entorno necesarias en la configuración de Vercel.');
          return null;
        }
        
        // Inicializar Stripe con la clave secreta
        this.stripeInstance = new Stripe(secretKey, {
          apiVersion: '2023-10-16', // Usar la versión más reciente de la API
          typescript: true,
        });
        
        this.initialized = true;
        console.log('Stripe inicializado correctamente');
      } catch (error: any) {
        console.error('Error al inicializar Stripe:', error.message);
        console.error('Detalles:', error);
        return null;
      }
    }
    
    return this.stripeInstance;
  }

  // Método para verificar que las variables de entorno de Stripe estén configuradas
  checkStripeConfig() {
    const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    const missingKeys = [];
    if (!publicKey) missingKeys.push('NEXT_PUBLIC_STRIPE_PUBLIC_KEY');
    if (!secretKey) missingKeys.push('STRIPE_SECRET_KEY');
    if (!webhookSecret) missingKeys.push('STRIPE_WEBHOOK_SECRET');
    
    if (missingKeys.length > 0) {
      console.error(`Faltan las siguientes variables de entorno: ${missingKeys.join(', ')}`);
      return false;
    }
    
    return true;
  }
}

// Exportar una instancia única de StripeService
const stripeService = new StripeService();
export default stripeService; 