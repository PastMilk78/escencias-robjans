"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function PoliticaPrivacidad() {
  // Scroll al inicio cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#594a42] text-[#f8f1d8] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#fed856] mb-8 text-center font-raleway">
          Política de Privacidad
        </h1>
        
        <div className="bg-[#312b2b] p-8 rounded-lg border-2 border-[#fed856] shadow-xl mb-8">
          <p className="mb-4 font-raleway">
            Última actualización: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            1. Introducción
          </h2>
          <p className="mb-4 font-raleway">
            Escencias Robjans ("nosotros", "nuestro" o "la empresa") se compromete a proteger la privacidad de los usuarios de nuestro sitio web. Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos su información cuando visita nuestro sitio web o realiza compras en nuestra tienda en línea.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            2. Información que Recopilamos
          </h2>
          <p className="mb-2 font-raleway">
            Podemos recopilar los siguientes tipos de información:
          </p>
          <ul className="list-disc pl-6 mb-4 font-raleway">
            <li className="mb-2">
              <span className="font-semibold text-[#fed856]">Información personal:</span> Nombre, dirección de correo electrónico, número de teléfono, dirección de envío y facturación, cuando usted se registra o realiza una compra.
            </li>
            <li className="mb-2">
              <span className="font-semibold text-[#fed856]">Información de pago:</span> Detalles de tarjetas de crédito o información de pago para procesar transacciones (a través de proveedores de pago seguros como Stripe).
            </li>
            <li className="mb-2">
              <span className="font-semibold text-[#fed856]">Información de inicio de sesión:</span> Cuando utiliza servicios de inicio de sesión social como Facebook o Google.
            </li>
            <li className="mb-2">
              <span className="font-semibold text-[#fed856]">Información del dispositivo:</span> Datos sobre el dispositivo que utiliza para acceder a nuestro sitio, como dirección IP, tipo de navegador, y sistema operativo.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            3. Cómo Utilizamos su Información
          </h2>
          <p className="mb-2 font-raleway">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 mb-4 font-raleway">
            <li className="mb-2">Procesar y completar sus pedidos</li>
            <li className="mb-2">Gestionar su cuenta y proporcionarle atención al cliente</li>
            <li className="mb-2">Enviarle actualizaciones, ofertas y comunicaciones promocionales</li>
            <li className="mb-2">Mejorar nuestro sitio web, productos y servicios</li>
            <li className="mb-2">Cumplir con obligaciones legales</li>
            <li className="mb-2">Prevenir fraudes y proteger la seguridad de nuestros usuarios</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            4. Divulgación de su Información
          </h2>
          <p className="mb-4 font-raleway">
            Podemos compartir su información personal con:
          </p>
          <ul className="list-disc pl-6 mb-4 font-raleway">
            <li className="mb-2">Proveedores de servicios que nos ayudan a operar nuestro negocio (procesamiento de pagos, envío, etc.)</li>
            <li className="mb-2">Autoridades legales cuando sea requerido por ley</li>
            <li className="mb-2">Terceros en caso de fusión, venta o transferencia de activos</li>
          </ul>
          <p className="mb-4 font-raleway">
            No vendemos ni alquilamos su información personal a terceros para fines de marketing.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            5. Inicio de Sesión con Redes Sociales
          </h2>
          <p className="mb-4 font-raleway">
            Ofrecemos la opción de iniciar sesión utilizando cuentas de redes sociales como Facebook y Google. Al utilizar estas opciones, podemos recibir cierta información de perfil de estas plataformas. Esta información se utiliza únicamente para crear y gestionar su cuenta en nuestro sitio.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            6. Sus Derechos
          </h2>
          <p className="mb-4 font-raleway">
            Dependiendo de su ubicación, puede tener ciertos derechos respecto a sus datos personales, incluyendo:
          </p>
          <ul className="list-disc pl-6 mb-4 font-raleway">
            <li className="mb-2">Acceder a sus datos personales</li>
            <li className="mb-2">Corregir datos inexactos</li>
            <li className="mb-2">Eliminar sus datos</li>
            <li className="mb-2">Restringir u oponerse al procesamiento de sus datos</li>
            <li className="mb-2">Solicitar la portabilidad de sus datos</li>
          </ul>
          <p className="mb-4 font-raleway">
            Para ejercer estos derechos, por favor contáctenos a través de escenciasrobjans@gmail.com.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            7. Eliminación de Datos de Usuario
          </h2>
          <p className="mb-4 font-raleway">
            Usted tiene derecho a solicitar la eliminación de sus datos personales. Para solicitar la eliminación de todos sus datos personales de nuestros sistemas, por favor envíe un correo electrónico a escenciasrobjans@gmail.com con el asunto "Solicitud de Eliminación de Datos" e incluya la siguiente información:
          </p>
          <ul className="list-disc pl-6 mb-4 font-raleway">
            <li className="mb-2">Su nombre completo</li>
            <li className="mb-2">Dirección de correo electrónico asociada a su cuenta</li>
            <li className="mb-2">Cualquier otra información que nos ayude a identificar su cuenta</li>
          </ul>
          <p className="mb-4 font-raleway">
            Procesaremos su solicitud dentro de los 30 días posteriores a la recepción. Una vez que hayamos verificado su identidad, eliminaremos permanentemente sus datos personales de nuestros sistemas, excepto aquella información que estamos obligados a conservar por razones legales o de seguridad.
          </p>
          <p className="mb-4 font-raleway">
            Si ha utilizado servicios de inicio de sesión de terceros (como Facebook o Google) para crear su cuenta, también eliminaremos la información obtenida de estos servicios, pero tenga en cuenta que debe gestionar sus datos directamente con estos proveedores para una eliminación completa.
          </p>
          <p className="mb-4 font-raleway">
            Para obtener instrucciones más detalladas sobre cómo solicitar la eliminación de sus datos, visite nuestra <Link href="/eliminacion-de-datos" className="text-[#fed856] underline hover:text-white">página de eliminación de datos</Link>.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            8. Seguridad de los Datos
          </h2>
          <p className="mb-4 font-raleway">
            Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, pérdida o alteración. Sin embargo, ninguna transmisión por Internet o almacenamiento electrónico es completamente seguro, por lo que no podemos garantizar la seguridad absoluta.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            9. Cookies y Tecnologías Similares
          </h2>
          <p className="mb-4 font-raleway">
            Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio, recordar sus preferencias y comprender cómo los usuarios navegan por nuestro sitio. Puede ajustar la configuración de su navegador para rechazar cookies, pero esto puede afectar a la funcionalidad de nuestro sitio.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            10. Cambios a esta Política
          </h2>
          <p className="mb-4 font-raleway">
            Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos de cualquier cambio significativo publicando la nueva política en nuestro sitio web con una fecha de actualización visible.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            11. Contacto
          </h2>
          <p className="mb-4 font-raleway">
            Si tiene preguntas o inquietudes sobre esta Política de Privacidad, por favor contáctenos:
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