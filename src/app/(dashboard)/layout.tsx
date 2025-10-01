'use client'
import { useAuthStore } from "@/features/auth/use_case/auth-store";
import Link from "next/link";

const LayoutDashboard = ({children} : {children: React.ReactNode}) => {
  const user = useAuthStore(store=>store.user)
  return ( <div>
    <header className="flex justify-between items-center p-4 bg-green-600 text-white font-bold">
      <div className="text-2xl">
        Recolecta
      </div>
      <div className="space-x-8 mr-8">
        <Link href="/dashboard">Inicio</Link>
        <Link href="/dashboard/schedule">Agendar</Link>
        {(user?.role === 'company' || user?.role==='admin') &&
          <Link href="/dashboard/routes">Rutas</Link>
        }
        <Link href="/dashboard/reports">Reportes</Link>
        {
          user?.role === 'admin' &&
        <Link href="/dashboard/profile">Perfiles</Link>
        }
      </div>
    </header>
    {children}
  </div> );
}

export default LayoutDashboard;