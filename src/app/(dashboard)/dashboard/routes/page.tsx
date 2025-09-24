'use client';

import { useState, useEffect } from 'react';
import { Request } from '@/features/request/models/Request';
import { User } from '@/features/auth/models/User';
import { useRequestStore } from '@/features/request/use_Case/request-store';
import { useAuthStore } from '@/features/auth/use_case/auth-store';

interface AssignmentFormData {
  selectedRequestId: string;
  selectedCollectorId: string;
  assignedDate: string;
  notes: string;
}

const RoutesPage = () => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [collectors, setCollectors] = useState<User[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedCollector, setSelectedCollector] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {getPendingRequests, setCollectorId} = useRequestStore();
  const {getCollectors} = useAuthStore();

  const [formData, setFormData] = useState<AssignmentFormData>({
    selectedRequestId: '',
    selectedCollectorId: '',
    assignedDate: '',
    notes: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API loading
      await new Promise(resolve => setTimeout(resolve, 300));
      const pendings = await getPendingRequests();
      const collectors = await getCollectors();

      setPendingRequests(pendings);
      setCollectors(collectors);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleRequestChange = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId);
    setSelectedRequest(request || null);
    setFormData(prev => ({
      ...prev,
      selectedRequestId: requestId
    }));
  };

  const handleCollectorChange = (collectorId: string) => {
    const collector = collectors.find(c => c.id === collectorId);
    setSelectedCollector(collector || null);
    setFormData(prev => ({
      ...prev,
      selectedCollectorId: collectorId
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedRequestId || !formData.selectedCollectorId || !formData.assignedDate) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    await setCollectorId(formData.selectedRequestId, formData.selectedCollectorId);

    // Reset form
    setFormData({
      selectedRequestId: '',
      selectedCollectorId: '',
      assignedDate: '',
      notes: ''
    });
    setSelectedRequest(null);
    setSelectedCollector(null);
    setIsSubmitting(false);
    
    alert('¡Recolector asignado exitosamente!');
  };

  const getTypeColor = (tipoResiduo: string) => {
    const colors = {
      organicos: 'bg-green-100 text-green-800',
      inorganicos: 'bg-blue-100 text-blue-800',
      peligrosos: 'bg-red-100 text-red-800'
    };
    return colors[tipoResiduo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Asignar Rutas de Recolección</h1>
            <p className="text-gray-600">Asigna recolectores a solicitudes pendientes</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Solicitudes Pendientes</p>
                  <p className="text-lg font-semibold text-gray-900">{pendingRequests.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Recolectores Disponibles</p>
                  <p className="text-lg font-semibold text-gray-900">{collectors.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Hoy</p>
                  <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('es-CO')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Nueva Asignación</h2>

          {/* Request Selection */}
          <div>
            <label htmlFor="selectedRequestId" className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Solicitud Pendiente *
            </label>
            <select
              id="selectedRequestId"
              name="selectedRequestId"
              value={formData.selectedRequestId}
              onChange={(e) => handleRequestChange(e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione una solicitud</option>
              {pendingRequests.map((request) => (
                <option key={request.id} value={request.id}>
                  REQ-{request.id.split('-')[0]} - {request.localidad} - {request.tipoResiduo} - {formatDate(request.fecha)}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Request Info */}
          {selectedRequest && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Información de la Solicitud</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">ID:</span>
                  <span className="ml-2 text-gray-900">REQ-{selectedRequest.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Usuario:</span>
                  <span className="ml-2 text-gray-900">{selectedRequest.userId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ubicación:</span>
                  <span className="ml-2 text-gray-900">{selectedRequest.localidad}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Dirección:</span>
                  <span className="ml-2 text-gray-900">{selectedRequest.direccion}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Tipo:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedRequest.tipoResiduo)}`}>
                    {selectedRequest.tipoResiduo}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Peso:</span>
                  <span className="ml-2 text-gray-900">{selectedRequest.pesoResiduo} kg</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Fecha programada:</span>
                  <span className="ml-2 text-gray-900">{formatDate(selectedRequest.fecha)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Hora:</span>
                  <span className="ml-2 text-gray-900">{selectedRequest.hora}</span>
                </div>
              </div>
            </div>
          )}

          {/* Collector Selection */}
          <div>
            <label htmlFor="selectedCollectorId" className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Recolector *
            </label>
            <select
              id="selectedCollectorId"
              name="selectedCollectorId"
              value={formData.selectedCollectorId}
              onChange={(e) => handleCollectorChange(e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione un recolector</option>
              {collectors.map((collector) => (
                <option key={collector.id} value={collector.id}>
                  {collector.nombres} {collector.apellidos} - {collector.celular} - {collector.codigoIndicativo}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Collector Info */}
          {selectedCollector && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Información del Recolector</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Nombre:</span>
                  <span className="ml-2 text-gray-900">{selectedCollector.nombres} {selectedCollector.apellidos}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-900">{selectedCollector.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Celular:</span>
                  <span className="ml-2 text-gray-900">{selectedCollector.celular}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Código:</span>
                  <span className="ml-2 text-gray-900">{selectedCollector.codigoIndicativo}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">DNI:</span>
                  <span className="ml-2 text-gray-900">{selectedCollector.tipoDni} {selectedCollector.numeroDni}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Dirección:</span>
                  <span className="ml-2 text-gray-900">{selectedCollector.direccion}</span>
                </div>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <label htmlFor="assignedDate" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Asignación *
            </label>
            <input
              id="assignedDate"
              name="assignedDate"
              type="date"
              value={formData.assignedDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          {/* <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales (Opcional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Ingrese cualquier información adicional sobre la asignación..."
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div> */}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.selectedRequestId || !formData.selectedCollectorId || !formData.assignedDate}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Asignando...
                </div>
              ) : (
                'Asignar Recolector'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
 
export default RoutesPage;