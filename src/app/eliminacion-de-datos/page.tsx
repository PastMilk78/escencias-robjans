"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function EliminacionDeDatos() {
  // Scroll al inicio cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#594a42] text-[#f8f1d8] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#fed856] mb-8 text-center font-raleway">
          Eliminación de Datos de Usuario
        </h1>
        
        <div className="bg-[#312b2b] p-8 rounded-lg border-2 border-[#fed856] shadow-xl mb-8">
          <p className="mb-4 font-raleway">
            Última actualización: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            Solicitud de Eliminación de Datos
          </h2>
          <p className="mb-4 font-raleway">
            En Escencias Robjans respetamos su derecho a controlar sus datos personales. Esta página proporciona instrucciones detalladas sobre cómo puede solicitar la eliminación de sus datos de nuestros sistemas.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            Cómo Solicitar la Eliminación de sus Datos
          </h2>
          <p className="mb-4 font-raleway">
            Para solicitar la eliminación de todos sus datos personales de nuestros sistemas, por favor siga estos pasos:
          </p>
          <ol className="list-decimal pl-6 mb-4 font-raleway">
            <li className="mb-2">
              Envíe un correo electrónico a <strong>escenciasrobjans@gmail.com</strong> con el asunto "Solicitud de Eliminación de Datos"
            </li>
            <li className="mb-2">
              En el cuerpo del correo, incluya la siguiente información:
              <ul className="list-disc pl-6 mt-2">
                <li>Su nombre completo</li>
                <li>Dirección de correo electrónico asociada a su cuenta</li>
                <li>Número de teléfono (si lo proporcionó al registrarse)</li>
                <li>Cualquier otra información que nos ayude a identificar su cuenta</li>
              </ul>
            </li>
            <li className="mb-2">
              Especifique si desea eliminar todos sus datos o solo ciertos tipos de información
            </li>
          </ol>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            Proceso de Eliminación
          </h2>
          <p className="mb-4 font-raleway">
            Una vez que recibamos su solicitud, seguiremos este proceso:
          </p>
          <ol className="list-decimal pl-6 mb-4 font-raleway">
            <li className="mb-2">
              Verificaremos su identidad para asegurarnos de que es el propietario legítimo de los datos
            </li>
            <li className="mb-2">
              Confirmaremos la recepción de su solicitud dentro de las 72 horas
            </li>
            <li className="mb-2">
              Procesaremos su solicitud en un plazo máximo de 30 días
            </li>
            <li className="mb-2">
              Le enviaremos una confirmación una vez que se haya completado la eliminación
            </li>
          </ol>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            Qué Datos Eliminamos
          </h2>
          <p className="mb-4 font-raleway">
            Cuando procesamos una solicitud de eliminación, eliminamos:
          </p>
          <ul className="list-disc pl-6 mb-4 font-raleway">
            <li className="mb-2">Su perfil de usuario y toda la información asociada</li>
            <li className="mb-2">Historial de compras</li>
            <li className="mb-2">Datos de contacto y dirección</li>
            <li className="mb-2">Información obtenida a través de servicios de inicio de sesión de terceros (como Facebook o Google)</li>
            <li className="mb-2">Preferencias y configuraciones personalizadas</li>
          </ul>
          <p className="mb-4 font-raleway">
            <strong>Nota importante:</strong> Es posible que debamos retener cierta información por razones legales, fiscales o de seguridad. En tales casos, le informaremos qué datos debemos conservar y por cuánto tiempo.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            Datos de Terceros
          </h2>
          <p className="mb-4 font-raleway">
            Si ha utilizado servicios de inicio de sesión de terceros (como Facebook o Google) para crear su cuenta, eliminaremos la información obtenida de estos servicios de nuestros sistemas. Sin embargo, tenga en cuenta que debe gestionar sus datos directamente con estos proveedores para una eliminación completa.
          </p>

          <h2 className="text-2xl font-bold text-[#fed856] mt-8 mb-4 font-raleway">
            Contacto para Dudas
          </h2>
          <p className="mb-4 font-raleway">
            Si tiene preguntas adicionales sobre el proceso de eliminación de datos, por favor contáctenos:
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