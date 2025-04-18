"use client";

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (status === "authenticated") {
      router.push('/perfil');
    }
  }, [status, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });
      
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/perfil');
      }
    } catch (error) {
      setError('Ocurrió un error durante el inicio de sesión');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider: string) => {
    try {
      setLoading(true);
      setError(null);
      await signIn(provider, { callbackUrl: '/perfil' });
    } catch (error) {
      setError(`Error al iniciar sesión con ${provider}`);
      console.error(error);
      setLoading(false);
    }
  };
  
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fed856]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#473f3f] to-[#312b2b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#6b5b4e] p-8 rounded-xl border-2 border-[#fed856] shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#fed856] font-raleway">
            Iniciar Sesión
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 bg-[#594a42] placeholder-[#a39a8e] text-[#f8f1d8] focus:outline-none focus:ring-[#fed856] focus:border-[#fed856] focus:z-10 sm:text-sm border border-[#fed856]"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 bg-[#594a42] placeholder-[#a39a8e] text-[#f8f1d8] focus:outline-none focus:ring-[#fed856] focus:border-[#fed856] focus:z-10 sm:text-sm border border-[#fed856]"
                placeholder="Contraseña"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-[#312b2b] bg-[#fed856] hover:bg-[#e5c24c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fed856] font-raleway ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#312b2b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#fed856]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#6b5b4e] text-[#f8f1d8]">O continúa con</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center px-4 py-2 border border-[#fed856] rounded-md shadow-sm text-sm font-medium text-[#f8f1d8] bg-[#594a42] hover:bg-[#6d5a50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fed856]"
            >
              <span className="mr-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
              </span>
              Google
            </button>
            
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full flex items-center justify-center px-4 py-2 border border-[#fed856] rounded-md shadow-sm text-sm font-medium text-[#f8f1d8] bg-[#594a42] hover:bg-[#6d5a50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fed856]"
            >
              <span className="mr-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </span>
              Facebook
            </button>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-[#f8f1d8]">
            ¿No tienes una cuenta? {' '}
            <Link href="/registro" className="font-medium text-[#fed856] hover:text-[#e5c24c]">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 