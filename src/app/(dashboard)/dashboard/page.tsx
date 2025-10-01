'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/use_case/auth-store';
import { useRequestStore } from '@/features/request/use_Case/request-store';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
  stats?: string;
}

const DashboarPage = () => {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const {fillWithMockData} = useRequestStore();
  const {fillWithMockData: fillUsersWithMockData} = useAuthStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dashboardCards: DashboardCard[] = [
    {
      id: 'schedule',
      title: 'Programar Recolección',
      description: 'Programa una nueva recolección de residuos para tu ubicación',
      href: '/dashboard/schedule',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      stats: 'Programa tu próxima recolección',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l2 2m0 0l2-2m-2 2V9m12 0a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9z" />
        </svg>
      )
    },
    {
      id: 'history',
      title: 'Historial de Recolecciones',
      description: 'Revisa tu historial completo de recolecciones programadas',
      href: '/dashboard/requests',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      stats: '12 recolecciones este mes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 'statistics',
      title: 'Estadísticas',
      description: 'Visualiza tu impacto ambiental y estadísticas de reciclaje',
      href: '/dashboard/reports',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      stats: '85 kg reciclados este año',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Gestiona tus notificaciones y recordatorios',
      href: '/dashboard/notifications',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      stats: '',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zm6-10V3a2 2 0 00-2-2H8a2 2 0 00-2 2v4h1m0 0h8m-1 0l-4 8-4-8h8z" />
        </svg>
      )
    },
    {
      id: 'profile',
      title: 'Mi Perfil',
      description: 'Actualiza tu información personal y preferencias',
      href: '/dashboard/profile',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      stats: 'Perfil actualizado',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'support',
      title: 'Soporte',
      description: 'Obtén ayuda y contacta nuestro equipo de soporte',
      href: '/dashboard/support',
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      stats: 'Tiempo de respuesta: 2h',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.196c5.422 0 9.804 4.382 9.804 9.804 0 5.422-4.382 9.804-9.804 9.804-5.422 0-9.804-4.382-9.804-9.804C2.196 6.578 6.578 2.196 12 2.196z" />
        </svg>
      )
    }
  ];

  const quickActions = [
    {
      title: 'Cancelar recolección',
      description: 'Cancela tu recolección',
      href: '/dashboard/requests',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      )
    },
    {
      title: 'Ver mis solicitudees',
      description: 'Solicitudes de recolección',
      href: '/dashboard/requests',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2zm-8 0V7a3 3 0 016 0v2" />
        </svg>
      )
    },
    {
      title: 'Reporte',
      description: 'Generar reporte mensual',
      href: '/dashboard/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  ¡Bienvenido{user?.nombres ? `, ${user.nombres}` : ''}! 👋
                </h1>
                <p className="text-gray-600">
                  Gestiona tus recolecciones de residuos y contribuye a un futuro más sostenible
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Hoy es</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentTime.toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentTime.toLocaleTimeString('es-CO')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-200">
                    {action.icon}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <div className="ml-auto">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className={`block group ${card.bgColor} rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:scale-105`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${card.color} bg-white rounded-lg shadow-sm mb-4 group-hover:shadow-md transition-shadow duration-200`}>
                    {card.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {card.description}
                  </p>
                  
                  {card.stats && (
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${card.color} bg-white bg-opacity-50`}>
                      {card.stats}
                    </div>
                  )}
                </div>
                
                <div className={`${card.color} opacity-50 group-hover:opacity-100 transition-opacity duration-200`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Action to fill with mock data */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-3">
            <button
              onClick={() => {
                fillWithMockData?.();
                fillUsersWithMockData?.();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Llenar con datos de prueba
            </button>
            <span className="text-sm text-gray-500">Usa esta acción para llenar la aplicación con datos de prueba.</span>
          </div>
        </div>

        
      </div>
    </div>
  );
}
 
export default DashboarPage;