'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/use_case/auth-store';
import { useRouter } from 'next/navigation';

interface FormData {
  nombres: string;
  apellidos: string;
  email: string;
  tipoIdentificacion: 'cc' | 'nit' | 'pa' | '';
  numeroIdentificacion: string;
  celular: string;
  password: string;
  confirmarContraseña: string;
}

interface FormErrors {
  nombres?: string;
  apellidos?: string;
  email?: string;
  tipoIdentificacion?: string;
  numeroIdentificacion?: string;
  celular?: string;
  password?: string;
  confirmarContraseña?: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombres: '',
    apellidos: '',
    email: '',
    tipoIdentificacion: '',
    numeroIdentificacion: '',
    celular: '',
    password: '',
    confirmarContraseña: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { register, isLoading, registerError } = useAuthStore();

  const tipoIdentificacionOptions = [
    { value: 'cc', label: 'Cédula de Ciudadanía (CC)' },
    { value: 'nit', label: 'Número de Identificación Tributaria (NIT)' },
    { value: 'pa', label: 'Pasaporte (PA)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombres.trim()) newErrors.nombres = 'Los nombres son requeridos';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son requeridos';
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.tipoIdentificacion) newErrors.tipoIdentificacion = 'Seleccione el tipo de identificación';
    if (!formData.numeroIdentificacion.trim()) newErrors.numeroIdentificacion = 'El número de identificación es requerido';
    
    if (!formData.celular.trim()) {
      newErrors.celular = 'El número de celular es requerido';
    } else if (!/^\d{10}$/.test(formData.celular.replace(/\s/g, ''))) {
      newErrors.celular = 'El número de celular debe tener 10 dígitos';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      alert('Debe aceptar los términos y condiciones');
      return;
    }

    if (!validateForm()) return;

    const success = await register(formData);
    if (success) {
      router.push('/login');
    } else {
      console.log('Registration failed');
    }
    
    // Here you would typically handle the actual registration logic
  };

  return (
    <main className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-2/5 relative">
        <Image
          src="/images/recycling2.jpg"
          alt="Sustainable future with recycling"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/80 to-blue-600/60" />
        
        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start p-12 text-white">
          <h1 className="text-4xl font-bold mb-6">
            Únete a Residuos App
          </h1>
          <p className="text-lg opacity-90 max-w-md leading-relaxed mb-8">
            Sé parte del cambio hacia un futuro más sostenible. Regístrate y comienza tu journey hacia una gestión inteligente de residuos.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Gestión inteligente de residuos
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Seguimiento en tiempo real
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Impacto ambiental positivo
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Comunidad comprometida
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
            <p className="text-gray-600 mt-2">Completa tus datos para registrarte</p>
          </div>

          {registerError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {registerError}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombres y Apellidos - Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres *
                </label>
                <input
                  id="nombres"
                  name="nombres"
                  type="text"
                  required
                  value={formData.nombres}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.nombres ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tus nombres"
                />
                {errors.nombres && <p className="mt-1 text-sm text-red-600">{errors.nombres}</p>}
              </div>

              <div>
                <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  id="apellidos"
                  name="apellidos"
                  type="text"
                  required
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.apellidos ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tus apellidos"
                />
                {errors.apellidos && <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="correo"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ejemplo@correo.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Tipo de Identificación y Número - Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tipoIdentificacion" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Identificación *
                </label>
                <select
                  id="tipoIdentificacion"
                  name="tipoIdentificacion"
                  required
                  value={formData.tipoIdentificacion}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.tipoIdentificacion ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  {tipoIdentificacionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.tipoIdentificacion && <p className="mt-1 text-sm text-red-600">{errors.tipoIdentificacion}</p>}
              </div>

              <div>
                <label htmlFor="numeroIdentificacion" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Identificación *
                </label>
                <input
                  id="numeroIdentificacion"
                  name="numeroIdentificacion"
                  type="text"
                  required
                  value={formData.numeroIdentificacion}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.numeroIdentificacion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Número de identificación"
                />
                {errors.numeroIdentificacion && <p className="mt-1 text-sm text-red-600">{errors.numeroIdentificacion}</p>}
              </div>
            </div>

            {/* Celular */}
            <div>
              <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-2">
                Número de Celular *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="celular"
                  name="celular"
                  type="tel"
                  required
                  value={formData.celular}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.celular ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="3001234567"
                />
              </div>
              {errors.celular && <p className="mt-1 text-sm text-red-600">{errors.celular}</p>}
            </div>

            {/* Contraseñas - Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="contraseña"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="confirmarContraseña"
                    name="confirmarContraseña"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmarContraseña}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmarContraseña ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirma tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirmPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
                {errors.confirmarContraseña && <p className="mt-1 text-sm text-red-600">{errors.confirmarContraseña}</p>}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  Acepto los{' '}
                  <Link href="#" className="font-medium text-green-600 hover:text-green-500">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link href="#" className="font-medium text-green-600 hover:text-green-500">
                    política de privacidad
                  </Link>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
