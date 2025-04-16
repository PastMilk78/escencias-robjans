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
          console.warn('ADVERTENCIA: STRIPE_SECRET_KEY no está configurada en las variables de entorno.');
          return null;
        }
        
        // Inicializar Stripe con la clave secreta
        this.stripeInstance = new Stripe(secretKey, {
          apiVersion: '2023-10-16', // Usar la versión más reciente de la API
        });
        
        this.initialized = true;
      } catch (error) {
        console.error('Error al inicializar Stripe:', error);
        return null;
      }
    }
    
    return this.stripeInstance;
  }
}

// Exportar una instancia única de StripeService
const stripeService = new StripeService();
export default stripeService; 