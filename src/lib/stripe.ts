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
        console.log('Inicializando Stripe...');
        
        // Importación dinámica de Stripe
        const { Stripe } = await import('stripe');
        
        // Verificar que la clave secreta está disponible
        const secretKey = process.env.STRIPE_SECRET_KEY;
        
        if (!secretKey) {
          console.error('ERROR: STRIPE_SECRET_KEY no está configurada en las variables de entorno.');
          console.error('Asegúrese de agregar las variables de entorno necesarias en la configuración de Vercel.');
          return null;
        }
        
        console.log('Clave secreta de Stripe disponible, inicializando cliente...');
        
        // Inicializar Stripe con la clave secreta
        this.stripeInstance = new Stripe(secretKey, {
          apiVersion: '2023-10-16', // Usar la versión más reciente de la API
          typescript: true,
        });
        
        this.initialized = true;
        console.log('Stripe inicializado correctamente');
        
        try {
          // Hacer una petición de prueba para verificar que la clave funciona
          const testResult = await this.stripeInstance.customers.list({ limit: 1 });
          console.log(`Conexión con Stripe verificada. Respuesta: ${testResult.object}, data: ${testResult.data.length} items`);
        } catch (verifyError: any) {
          console.error('Error al verificar la conexión con Stripe:', verifyError.message);
          console.warn('Continuando de todos modos, podría haber problemas con las operaciones de Stripe');
        }
      } catch (error: any) {
        console.error('Error al inicializar Stripe:', error.message);
        console.error('Detalles:', error);
        this.initialized = false;
        this.stripeInstance = null;
        return null;
      }
    } else {
      console.log('Usando instancia existente de Stripe');
    }
    
    return this.stripeInstance;
  }

  // Método para verificar que las variables de entorno de Stripe estén configuradas
  checkStripeConfig() {
    console.log('Verificando configuración de Stripe...');
    
    // Verificar ambas variables de clave pública para mayor compatibilidad
    const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    const missingKeys = [];
    if (!publicKey) missingKeys.push('NEXT_PUBLIC_STRIPE_PUBLIC_KEY o STRIPE_PUBLIC_KEY');
    if (!secretKey) missingKeys.push('STRIPE_SECRET_KEY');
    if (!webhookSecret) missingKeys.push('STRIPE_WEBHOOK_SECRET');
    
    if (missingKeys.length > 0) {
      console.error(`Faltan las siguientes variables de entorno: ${missingKeys.join(', ')}`);
      return false;
    }
    
    console.log('Configuración de Stripe verificada correctamente');
    return true;
  }
  
  // Método para limpiar la instancia de Stripe (útil para pruebas o reinicialización)
  resetInstance() {
    this.initialized = false;
    this.stripeInstance = null;
    console.log('Instancia de Stripe reiniciada');
  }
}

// Exportar una instancia única de StripeService
const stripeService = new StripeService();
export default stripeService; 