"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function TerminosServicio() {
  // Scroll al inicio cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#594a42] text-[#f8f1d8] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#fed856] mb-8 text-center font-raleway">
          Términos y Condiciones
        </h1>
        
        <div className="bg-[#312b2b] p-8 rounded-lg border-2 border-[#fed856] shadow-xl mb-8">
          <p className="mb-4 font-raleway">
            Última actualización: {new Date().toLocaleDateString()}
          </p>

          <p className="mb-6 font-raleway">
            Bienvenido a Escencias Robjans. Estos Términos y Condiciones rigen su acceso y uso de nuestro sitio web, así como los productos y servicios que ofrecemos. Al acceder o utilizar nuestro sitio, usted acepta estar sujeto a estos términos. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al sitio ni utilizar nuestros servicios.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            1. Uso del Sitio
          </h2>
          <p className="mb-4 font-raleway">
            Al utilizar nuestro sitio, usted garantiza que tiene al menos 18 años de edad o que está visitando el sitio bajo la supervisión de un padre o tutor legal.
          </p>
          <p className="mb-4 font-raleway">
            Se prohíbe el uso de nuestro sitio para fines ilegales o no autorizados. Usted no debe:
          </p>
          <ul className="list-disc pl-6 mb-4 font-raleway">
            <li className="mb-2">Violar cualquier ley local, estatal, nacional o internacional aplicable</li>
            <li className="mb-2">Infringir nuestros derechos de propiedad intelectual o los de terceros</li>
            <li className="mb-2">Interferir con el funcionamiento adecuado del sitio</li>
            <li className="mb-2">Intentar obtener acceso no autorizado a cualquier parte de nuestro sitio</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            2. Productos y Servicios
          </h2>
          <p className="mb-4 font-raleway">
            Todos los productos que ofrecemos están sujetos a disponibilidad. Nos reservamos el derecho de descontinuar cualquier producto en cualquier momento.
          </p>
          <p className="mb-4 font-raleway">
            Hacemos todo lo posible para mostrar con precisión los colores y características de nuestros productos. Sin embargo, no podemos garantizar que la visualización de los colores en su dispositivo sea exacta.
          </p>
          <p className="mb-4 font-raleway">
            Nos reservamos el derecho de limitar la cantidad de productos vendidos o disponibles para cualquier persona, hogar o pedido.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            3. Precios y Pagos
          </h2>
          <p className="mb-4 font-raleway">
            Todos los precios están en Pesos Mexicanos (MXN) e incluyen IVA. Los precios están sujetos a cambios sin previo aviso.
          </p>
          <p className="mb-4 font-raleway">
            Aceptamos los siguientes métodos de pago:
          </p>
          <ul className="list-disc pl-6 mb-4 font-raleway">
            <li className="mb-2">Tarjetas de crédito (Visa, MasterCard, American Express)</li>
            <li className="mb-2">Tarjetas de débito</li>
            <li className="mb-2">Transferencia bancaria</li>
          </ul>
          <p className="mb-4 font-raleway">
            El pago se procesa de forma segura a través de Stripe, nuestro proveedor de servicios de pago. No almacenamos información de tarjetas de crédito en nuestros servidores.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            4. Envíos y Entregas
          </h2>
          <p className="mb-4 font-raleway">
            Realizamos envíos a todo México. Los tiempos de entrega son estimados y pueden variar dependiendo de la ubicación y otros factores.
          </p>
          <p className="mb-4 font-raleway">
            Los costos de envío se calcularán en el momento de la compra y se mostrarán antes de finalizar el pedido.
          </p>
          <p className="mb-4 font-raleway">
            No somos responsables de los retrasos en la entrega causados por el servicio de mensajería, condiciones climáticas, eventos de fuerza mayor u otras circunstancias fuera de nuestro control.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            5. Política de Devoluciones y Reembolsos
          </h2>
          <p className="mb-4 font-raleway">
            Aceptamos devoluciones dentro de los 10 días posteriores a la recepción del producto, siempre que:
          </p>
          <ul className="list-disc pl-6 mb-4 font-raleway">
            <li className="mb-2">El producto esté sin abrir y en su embalaje original</li>
            <li className="mb-2">El producto no esté dañado o manipulado</li>
            <li className="mb-2">Se presente el comprobante de compra</li>
          </ul>
          <p className="mb-4 font-raleway">
            Los reembolsos se procesarán utilizando el método de pago original dentro de los 15 días posteriores a la recepción y verificación del producto devuelto.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            6. Cuentas de Usuario
          </h2>
          <p className="mb-4 font-raleway">
            Al crear una cuenta en nuestro sitio, usted es responsable de mantener la confidencialidad de su cuenta y contraseña, así como de restringir el acceso a su computadora. Usted acepta la responsabilidad por todas las actividades que ocurran bajo su cuenta o contraseña.
          </p>
          <p className="mb-4 font-raleway">
            Nos reservamos el derecho de rechazar el servicio, cerrar cuentas, eliminar o editar contenido, o cancelar pedidos a nuestra sola discreción.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            7. Propiedad Intelectual
          </h2>
          <p className="mb-4 font-raleway">
            Todos los contenidos de este sitio, incluyendo texto, gráficos, logos, imágenes, así como la compilación de los mismos, son propiedad de Escencias Robjans o sus proveedores y están protegidos por leyes de propiedad intelectual.
          </p>
          <p className="mb-4 font-raleway">
            No se permite la reproducción, distribución, modificación, exhibición o cualquier otro uso del contenido sin nuestro permiso por escrito.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            8. Limitación de Responsabilidad
          </h2>
          <p className="mb-4 font-raleway">
            Escencias Robjans no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la incapacidad de usar nuestros productos o servicios, o de cualquier información o productos obtenidos a través de nuestro sitio.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            9. Cambios a los Términos y Condiciones
          </h2>
          <p className="mb-4 font-raleway">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio. Es su responsabilidad revisar periódicamente estos términos.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            10. Ley Aplicable
          </h2>
          <p className="mb-4 font-raleway">
            Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de México, y cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales de Guanajuato, México.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            11. Contacto
          </h2>
          <p className="mb-4 font-raleway">
            Para cualquier pregunta sobre estos Términos y Condiciones, por favor contáctenos:
          </p>
          <p className="mb-4 font-raleway">
            <strong>Escencias Robjans</strong><br />
            Querétaro SN20, Centro, 37800<br />
            Dolores Hidalgo, Guanajuato, México<br />
            Email: escenciasrobjans@gmail.com<br />
            Teléfono: 418 305 6738
          </p>
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-block bg-[#fed856] text-[#312b2b] px-6 py-3 rounded-full font-bold hover:bg-white transition-colors font-raleway"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
} 