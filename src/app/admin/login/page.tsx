"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verifica localmente la contraseña (en producción sería mejor con API)
      if (password === 'escencias2024') {
        // Establecer una cookie para la sesión
        document.cookie = "admin_auth=true; path=/; max-age=86400"; // 24 horas
        router.push('/admin');
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f1d8]">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="https://i.postimg.cc/K1KCM5K0/logo-escencias.jpg" 
            alt="Escencias Robjans Logo" 
            className="h-32 rounded-xl mb-4"
          />
          <h1 className="text-2xl font-bold text-[#312b2b] font-raleway">Panel Administrativo</h1>
          <p className="text-gray-600 font-raleway">Ingrese la contraseña para acceder</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2 font-raleway">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fed856] text-[#312b2b] py-2 px-4 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
} 