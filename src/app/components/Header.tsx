"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartIcon from "./CartIcon";
import { useSession } from "next-auth/react";

export default function Header() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Manejar la carga inicial
    setIsLoaded(true);

    // Manejar el evento de scroll
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Agregar listener para el scroll
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled ? 'bg-[#8e3b00]/80 shadow-lg fixed-header' : 'bg-transparent'
      } ${isLoaded ? 'content-loaded' : 'content-loading'}`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        <div></div>
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <input
              type="text"
              placeholder="Buscar"
              className="bg-white text-black px-5 py-2 rounded-full font-raleway w-28 transition-all duration-300 focus:w-40 focus:ring-2 focus:ring-[#fed856] focus:outline-none"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 group-hover:text-[#fed856] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <a 
            href="#contacto" 
            className="bg-white text-black px-6 py-2 rounded-full font-raleway font-medium transition-all duration-300 hover:bg-[#fed856] hover:text-[#312b2b] hover:shadow-lg"
          >
            SOBRE NOSOTROS
          </a>
          {session ? (
            <Link 
              href="/perfil" 
              className="bg-[#fed856] text-[#312b2b] px-6 py-2 rounded-full font-raleway font-medium transition-all duration-300 hover:bg-white hover:text-[#312b2b] hover:shadow-lg"
            >
              MI PERFIL
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="bg-[#fed856] text-[#312b2b] px-6 py-2 rounded-full font-raleway font-medium transition-all duration-300 hover:bg-white hover:text-[#312b2b] hover:shadow-lg"
            >
              INICIAR SESIÓN
            </Link>
          )}
          <CartIcon />
        </div>
      </div>
    </header>
  );
} 