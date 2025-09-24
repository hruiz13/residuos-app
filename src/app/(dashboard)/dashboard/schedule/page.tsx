'use client';

import { useState } from 'react';
import { useRequestStore } from '@/features/request/use_Case/request-store';
import { useAuthStore } from '@/features/auth/use_case/auth-store';

interface ScheduleFormData {
  localidad: string;
  direccion: string;
  tipoResiduo: 'organicos' | 'inorganicos' | 'peligrosos' | '';
  fecha: string;
  hora: '10:00 AM' | '10:30 AM' | '11:00 AM' | '';
}

interface FormErrors {
  localidad?: string;
  direccion?: string;
  tipoResiduo?: string;
  fecha?: string;
  hora?: string;
}

const Schedule = () => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    localidad: '',
    direccion: '',
    tipoResiduo: '',
    fecha: '',
    hora: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const user = useAuthStore(state=>state.user)
  const {createRequest} = useRequestStore()

  const localidades = [
    'Medellín',
    'Bello',
    'Itagüí',
    'Envigado',
    'Sabaneta',
    'La Estrella',
    'Caldas',
    'Copacabana',
    'Girardota',
    'Barbosa'
  ];

  const tiposResiduo = [
    { value: 'organicos', label: 'Orgánicos', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'inorganicos', label: 'Inorgánicos', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { value: 'peligrosos', label: 'Peligrosos', color: 'bg-red-100 text-red-800 border-red-300' }
  ];

  const horasDisponibles = ['10:00 AM', '10:30 AM', '11:00 AM'];

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

  const handleTipoResiduoSelect = (tipo: 'organicos' | 'inorganicos' | 'peligrosos') => {
    setFormData(prev => ({
      ...prev,
      tipoResiduo: tipo
    }));
    if (errors.tipoResiduo) {
      setErrors(prev => ({
        ...prev,
        tipoResiduo: ''
      }));
    }
  };

  const handleHoraSelect = (hora: '10:00 AM' | '10:30 AM' | '11:00 AM') => {
    setFormData(prev => ({
      ...prev,
      hora: hora
    }));
    if (errors.hora) {
      setErrors(prev => ({
        ...prev,
        hora: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.localidad) newErrors.localidad = 'Selecciona una localidad';
    if (!formData.direccion) newErrors.direccion = 'Ingresa una dirección';
    if (!formData.tipoResiduo) newErrors.tipoResiduo = 'Selecciona el tipo de residuo';
    if (!formData.fecha) newErrors.fecha = 'Selecciona la fecha';
    if (!formData.hora) newErrors.hora = 'Selecciona la hora';

    // Validate date is not in the past
    if (formData.fecha) {
      const selectedDate = new Date(formData.fecha);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.fecha = 'La fecha no puede ser anterior a hoy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    createRequest({
      direccion: formData.direccion,
      userId: user?.id ?? '',
      estado: 'pending',
      fecha: formData.fecha,
      hora: formData.hora,
      localidad: formData.localidad,
      pesoResiduo: 0,
      putosObtenidos: 0,
      tipoResiduo: formData.tipoResiduo,
      id: crypto.randomUUID()
    })
    
    
    setIsLoading(false);
    setShowConfirmation(true);
  };

  const handleClose = () => {    
    // Reset form
    setFormData({
      localidad: '',
      direccion: '',
      tipoResiduo: '',
      fecha: '',
      hora: ''
    });
    setShowConfirmation(false);
  };

  const getTipoResiduoLabel = (value: string) => {
    const tipo = tiposResiduo.find(t => t.value === value);
    return tipo ? tipo.label : value;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Recolección programada!</h2>
          </div>

          {/* Confirmation Details */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Localidad:</span>
                  <span className="text-gray-900">{formData.localidad}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Dirección:</span>
                  <span className="text-gray-900">{formData.direccion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Residuo:</span>
                  <span className="text-gray-900">{getTipoResiduoLabel(formData.tipoResiduo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Fecha:</span>
                  <span className="text-gray-900">{formatDate(formData.fecha)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Hora:</span>
                  <span className="text-gray-900">{formData.hora}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l2 2m0 0l2-2m-2 2V9m12 0a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Programar Recolección</h1>
          <p className="text-gray-600">Completa la información para programar la recolección de residuos</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
          {/* Selecciona localidad */}
          <div>
            <label htmlFor="localidad" className="block text-lg font-semibold text-gray-900 mb-4">
              Selecciona una localidad
            </label>
            <select
              id="localidad"
              name="localidad"
              value={formData.localidad}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                errors.localidad ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Medellín</option>
              {localidades.map(localidad => (
                <option key={localidad} value={localidad}>
                  {localidad}
                </option>
              ))}
            </select>
            {errors.localidad && <p className="mt-2 text-sm text-red-600">{errors.localidad}</p>}
          </div>

          {/* Ingresa la dirección */}
          <div>
            <label htmlFor="direccion" className="block text-lg font-semibold text-gray-900 mb-4">
              Ingresa la dirección
            </label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              placeholder="Calle 123 #45-67, Apt 101"
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                errors.direccion ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={handleInputChange}
              value={formData.direccion}
            />
            {errors.direccion && <p  className="mt-2 text-sm text-red-600">{errors.direccion}</p>}
          </div>

          {/* Selecciona el tipo de residuo */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Selecciona el tipo de residuo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tiposResiduo.map((tipo) => (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => handleTipoResiduoSelect(tipo.value as 'organicos' | 'inorganicos' | 'peligrosos')}
                  className={`p-4 border-2 rounded-lg font-medium transition-all duration-200 ${
                    formData.tipoResiduo === tipo.value
                      ? `${tipo.color} border-current`
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {tipo.label}
                </button>
              ))}
            </div>
            {errors.tipoResiduo && <p className="mt-2 text-sm text-red-600">{errors.tipoResiduo}</p>}
          </div>

          {/* Selecciona la fecha */}
          <div>
            <label htmlFor="fecha" className="block text-lg font-semibold text-gray-900 mb-4">
              Selecciona la fecha
            </label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                errors.fecha ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fecha && <p className="mt-2 text-sm text-red-600">{errors.fecha}</p>}
          </div>

          {/* Selecciona la hora */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Selecciona la hora
            </label>
            <div className="flex flex-wrap gap-3">
              {horasDisponibles.map((hora) => (
                <button
                  key={hora}
                  type="button"
                  onClick={() => handleHoraSelect(hora as '10:00 AM' | '10:30 AM' | '11:00 AM')}
                  className={`px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${
                    formData.hora === hora
                      ? 'bg-green-100 text-green-800 border-green-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {hora}
                </button>
              ))}
            </div>
            {errors.hora && <p className="mt-2 text-sm text-red-600">{errors.hora}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Programando...
                </div>
              ) : (
                'Programar Recolección'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
export default Schedule;