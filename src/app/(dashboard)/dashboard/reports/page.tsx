'use client';

import { useState, useEffect } from 'react';
import { useRequestStore } from '@/features/request/use_Case/request-store';
import { useAuthStore } from '@/features/auth/use_case/auth-store';

interface ReportData {
  id: string;
  fecha: string;
  tipoResiduo: string;
  peso: number;
  estado: string;
  puntos: number;
  empresa: string;
  usuario: string;
}

interface FilterData {
  usuario: string;
  fechaInicio: string;
  fechaFin: string;
}

const ReportsPage = () => {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [filteredData, setFilteredData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { requests } = useRequestStore()
  const { users } = useAuthStore()


  const [filters, setFilters] = useState<FilterData>({
    usuario: '',
    fechaInicio: '',
    fechaFin: ''
  });

  // Transform requests data for reports
  const getReportDataFromRequests = (): ReportData[] => {
    return requests.map((request) => {
      const user = users.find(u => u.id === request.userId);
      const userName = user ? `${user.nombres} ${user.apellidos}` : 'Usuario no encontrado';

      // Transform estado to Spanish
      let estadoSpanish = '';
      switch (request.estado) {
        case 'completed':
          estadoSpanish = 'Completada';
          break;
        case 'cancelled':
          estadoSpanish = 'Cancelada';
          break;
        case 'pending':
          estadoSpanish = 'Pendiente';
          break;
        case 'in_progress':
          estadoSpanish = 'En Progreso';
          break;
        case 'assigned':
          estadoSpanish = 'Asignada';
          break;
        default:
          estadoSpanish = request.estado;
      }

      // Transform tipoResiduo to display format
      let tipoDisplay = '';
      switch (request.tipoResiduo) {
        case 'organicos':
          tipoDisplay = 'Orgánico';
          break;
        case 'inorganicos':
          tipoDisplay = 'Inorgánico';
          break;
        case 'peligrosos':
          tipoDisplay = 'Peligroso';
          break;
        default:
          tipoDisplay = request.tipoResiduo;
      }

      const collector = users.find(u => u.id === request.collectorId);


      return {
        id: request.id,
        fecha: new Date(request.fecha).toLocaleDateString('es-ES'),
        tipoResiduo: tipoDisplay,
        peso: request.pesoResiduo,
        estado: estadoSpanish,
        puntos: request.putosObtenidos,
        empresa: collector ? collector.nombres : 'Sin asignar',
        usuario: userName
      };
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const reportData = getReportDataFromRequests();

      setReportData(reportData);
      setFilteredData(reportData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let filtered = [...reportData];

      // Filter by user
      if (filters.usuario) {
        filtered = filtered.filter(item =>
          item.usuario.toLowerCase().includes(filters.usuario.toLowerCase())
        );
      }

      // Filter by date range
      if (filters.fechaInicio) {
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.fecha.split('/').reverse().join('-'));
          const startDate = new Date(filters.fechaInicio);
          return itemDate >= startDate;
        });
      }

      if (filters.fechaFin) {
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.fecha.split('/').reverse().join('-'));
          const endDate = new Date(filters.fechaFin);
          return itemDate <= endDate;
        });
      }

      setFilteredData(filtered);
      setIsGenerating(false);
    }, 1500);
  };

  const resetFilters = () => {
    setFilters({
      usuario: '',
      fechaInicio: '',
      fechaFin: ''
    });
    setFilteredData(reportData);
  };

  const getTotalKg = () => {
    return filteredData
      .filter(item => item.estado === 'Completada')
      .reduce((total, item) => total + item.peso, 0);
  };

  const getTotalPoints = () => {
    return filteredData
      .filter(item => item.estado === 'Completada')
      .reduce((total, item) => total + item.puntos, 0);
  };

  const getTypeColor = (tipo: string) => {
    if (tipo.toLowerCase().includes('orgánico')) return 'text-green-600 bg-green-100';
    if (tipo.toLowerCase().includes('inorgánico')) return 'text-blue-600 bg-blue-100';
    if (tipo.toLowerCase().includes('peligroso')) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (estado: string) => {
    if (estado === 'Completada') return 'text-green-600 bg-green-100';
    if (estado === 'Cancelada') return 'text-red-600 bg-red-100';
    if (estado === 'Pendiente') return 'text-yellow-600 bg-yellow-100';
    if (estado === 'En Progreso') return 'text-blue-600 bg-blue-100';
    if (estado === 'Asignada') return 'text-purple-600 bg-purple-100';
    return 'text-gray-600 bg-gray-100';
  };

  const exportToPDF = () => {
    // Simulate PDF export
    alert('Funcionalidad de exportar a PDF será implementada próximamente');
  };

  const exportToExcel = () => {
    // Simulate Excel export
    alert('Funcionalidad de exportar a Excel será implementada próximamente');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Reporte de Recolecciones</h1>
            <p className="text-gray-600">Consulta y exporta los datos de recolecciones completadas</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                value={filters.usuario}
                onChange={handleFilterChange}
                placeholder="Buscar por nombre"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                id="fechaInicio"
                name="fechaInicio"
                type="date"
                value={filters.fechaInicio}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                id="fechaFin"
                name="fechaFin"
                type="date"
                value={filters.fechaFin}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando...
                  </div>
                ) : (
                  'Generar reporte'
                )}
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Residuo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (Kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fecha}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.tipoResiduo)}`}>
                          {item.tipoResiduo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.peso > 0 ? item.peso.toFixed(1) : 'NA'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.estado)}`}>
                          {item.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.puntos}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.empresa}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.usuario}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-lg font-medium mb-2">No se encontraron datos</p>
                        <p className="text-sm">Intenta ajustar los filtros para obtener resultados</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary and Export Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Reporte</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Kg recolectados:</p>
                  <p className="text-2xl font-bold text-green-600">{getTotalKg().toFixed(1)} Kg</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
                  </svg>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de puntos obtenidos:</p>
                  <p className="text-2xl font-bold text-blue-600">{getTotalPoints()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Recolecciones completadas:</p>
                  <p className="font-semibold text-gray-900">
                    {filteredData.filter(item => item.estado === 'Completada').length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total de registros:</p>
                  <p className="font-semibold text-gray-900">{filteredData.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones de Exportación</h3>
            <div className="space-y-4">
              <button
                onClick={exportToPDF}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar a PDF
              </button>

              <button
                onClick={exportToExcel}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar a Excel
              </button>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Información del reporte:</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Generado el {new Date().toLocaleDateString('es-CO')}</p>
                  <p>• Incluye {filteredData.length} registros</p>
                  <p>• Filtros aplicados: {
                    [filters.usuario && 'Usuario', filters.fechaInicio && 'Fecha inicio', filters.fechaFin && 'Fecha fin']
                      .filter(Boolean).join(', ') || 'Ninguno'
                  }</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;