# 🌱 Residuos App - Patrones de Diseño y Arquitectura

Una aplicación completa de gestión de residuos construida con Next.js siguiendo principios de Clean Architecture y múltiples patrones de diseño.

## 🏗️ **Patrones de Diseño Implementados**

### **1. 🏛️ Clean Architecture / Hexagonal Architecture**

La arquitectura principal del proyecto sigue los principios de Clean Architecture, organizando el código en capas bien definidas:

```
src/
├── features/           # 🎯 Dominio y Casos de Uso
│   ├── auth/
│   │   ├── models/     # 📋 Entidades del dominio
│   │   └── use_case/   # ⚙️ Lógica de negocio
│   ├── request/
│   │   └── models/     # 📋 Modelos de solicitudes
│   └── landing/
│       └── components/ # 🎨 Componentes específicos
├── mock/              # 🔌 Adaptadores de datos (Datasources)
└── app/               # 🖥️ Capa de presentación (UI)
    ├── (dashboard)/   # 📊 Panel administrativo
    ├── (landing)/     # 🏠 Página principal
    └── (login)/       # 🔐 Autenticación
```

**Beneficios:**
- ✅ **Independencia de frameworks**: La lógica de negocio no depende de React/Next.js
- ✅ **Testabilidad**: Cada capa puede probarse independientemente
- ✅ **Mantenibilidad**: Cambios en UI no afectan la lógica de negocio
- ✅ **Escalabilidad**: Fácil agregar nuevas features sin romper existentes

### **2. 🔄 Repository Pattern**

Implementado implícitamente a través de la separación de datos y lógica:

```typescript
// 📁 /src/mock/users.json - Actúa como repository
[
  {
    "id": "1",
    "nombres": "Juan",
    "role": "admin"
    // ...
  }
]

// 📁 Transformación en componentes
const getUsersFromJson = (): User[] => {
  return usersData.map(userData => 
    new User(
      userData.id,
      userData.nombres,
      // ... mapeo de propiedades
    )
  );
};
```

**Características:**
- 🔄 **Abstracción de datos**: Los componentes no conocen la fuente de datos
- 🔀 **Intercambiabilidad**: Fácil cambio de JSON a API REST
- 🔒 **Encapsulación**: Lógica de acceso a datos centralizada

### **3. 🏪 Store Pattern (State Management)**

Implementado con Zustand para manejo de estado global:

```typescript
// 📁 /src/features/auth/use_case/auth-store.tsx
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: (email: string, password: string) => {
        // 🔐 Lógica de autenticación
        set({ user: foundUser, isAuthenticated: true });
      },
      
      logout: () => {
        // 🚪 Lógica de cierre de sesión
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
```

**Ventajas:**
- 🌐 **Estado global**: Acceso a autenticación desde cualquier componente
- 💾 **Persistencia**: Estado se mantiene entre sesiones
- 🎯 **Selectores**: Solo se re-renderiza cuando cambia estado usado

### **4. 🎭 Presentation Layer Pattern**

Los componentes React actúan como capa de presentación pura:

```typescript
// 📁 Ejemplo: Página de reportes
const ReportsPage = () => {
  // 📊 Solo lógica de presentación
  const [filteredData, setFilteredData] = useState<ReportData[]>([]);
  
  // 🔄 Transformación de datos del dominio a UI
  const getReportDataFromRequests = (): ReportData[] => {
    return requestsData.map((request) => ({
      id: request.id,
      fecha: new Date(request.fecha).toLocaleDateString('es-ES'),
      estado: translateEstado(request.estado),
      // ... más transformaciones
    }));
  };
  
  return (
    // 🎨 JSX de presentación
  );
};
```

### **5. 🔀 Strategy Pattern**

Diferentes estrategias para transformar y procesar datos:

```typescript
// 📁 Estrategias de transformación de estado
const getStatusColor = (estado: string) => {
  const strategies = {
    'Completada': 'text-green-600 bg-green-100',
    'Cancelada': 'text-red-600 bg-red-100',
    'Pendiente': 'text-yellow-600 bg-yellow-100',
    'En Progreso': 'text-blue-600 bg-blue-100',
    'Asignada': 'text-purple-600 bg-purple-100'
  };
  return strategies[estado] || 'text-gray-600 bg-gray-100';
};

// 📁 Estrategias de validación
const validateUserData = (userData: any) => {
  const validationStrategies = {
    email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    phone: (phone: string) => /^[0-9]{10}$/.test(phone),
    dni: (dni: string) => /^[0-9]{8,11}$/.test(dni)
  };
  // ... aplicar estrategias
};
```

### **6. 🏭 Factory Pattern**

Implementado en las clases de modelo para crear instancias:

```typescript
// 📁 /src/features/auth/models/User.ts
export class User {
  constructor(
    public id: string,
    public nombres: string,
    public apellidos: string,
    public tipoDni: 'CC' | 'NIT' | 'PA',
    public numeroDni: string,
    public direccion: string,
    public codigoIndicativo: string,
    public celular: string,
    public puntosAcumulados: number,
    public email: string,
    public password: string,
    public role: 'admin' | 'user' | 'company' | 'collector'
  ) {}
}

// 📁 /src/features/request/models/Request.ts
export class Request {
  constructor(
    public id: string,
    public userId: string,
    public fecha: string,
    public hora: string,
    public localidad: string,
    public direccion: string,
    public tipoResiduo: string,
    public estado: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'assigned',
    public pesoResiduo: number,
    public putosObtenidos: number,
    public collectorId: string
  ) {}
}
```

### **7. 🔍 Observer Pattern**

Implementado a través de React hooks y sistema de efectos:

```typescript
// 📁 Observador de cambios de estado
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    // 📡 Cargar datos
    const reportData = getReportDataFromRequests();
    setReportData(reportData);
    setIsLoading(false);
  };
  
  loadData();
}, []); // 👀 Observa el montaje del componente

// 📁 Observador de filtros
useEffect(() => {
  applyFilters();
}, [filters, reportData]); // 👀 Observa cambios en filtros o datos
```

### **8. 📦 Module Pattern**

Estructura modular con features bien encapsuladas:

```
features/
├── auth/                    # 🔐 Módulo de autenticación
│   ├── models/User.ts       # 📋 Modelo de dominio
│   └── use_case/            # ⚙️ Casos de uso
│       └── auth-store.tsx   # 🏪 Estado y lógica
├── request/                 # 📝 Módulo de solicitudes
│   └── models/Request.ts    # 📋 Modelo de dominio
└── landing/                 # 🏠 Módulo de landing
    └── components/          # 🎨 Componentes específicos
```

**Encapsulación:**
- 🔒 Cada módulo maneja su propio dominio
- 🔄 Interfaces bien definidas entre módulos
- 📦 Reutilización de componentes y lógica

### **9. 🎪 Facade Pattern**

Los custom hooks actúan como facades simplificando interfaces complejas:

```typescript
// 📁 Facade para autenticación
const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  // 🎭 Simplifica la interfaz del store
  return {
    user,
    isAuthenticated,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isCollector: user?.role === 'collector'
  };
};

// 📁 Uso simplificado en componentes
const Dashboard = () => {
  const { user, isAdmin } = useAuth(); // 🎪 Interfaz simplificada
  // ...
};
```

### **10. 🔧 Adapter Pattern**

Adaptadores para transformar datos entre diferentes formatos:

```typescript
// 📁 Adaptador JSON a Modelo
const adaptUserData = (jsonData: any): User => {
  return new User(
    jsonData.id,
    jsonData.nombres,
    jsonData.apellidos,
    jsonData.tipoDni as 'CC' | 'NIT' | 'PA',
    jsonData.numeroDni,
    jsonData.direccion,
    jsonData.codigoIndicativo,
    jsonData.celular,
    jsonData.puntosAcumulados,
    jsonData.email,
    jsonData.password,
    jsonData.role as 'admin' | 'user' | 'company' | 'collector'
  );
};

// 📁 Adaptador de fecha
const adaptDateFormat = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

## 🎯 **Patrón Arquitectónico Principal: Clean Architecture**

### **Capas de la Arquitectura:**

1. **🎨 Presentation Layer** (UI Components)
   - Componentes React
   - Páginas Next.js
   - Hooks de presentación

2. **⚙️ Use Cases Layer** (Business Logic)
   - Stores (Zustand)
   - Casos de uso de negocio
   - Validaciones y transformaciones

3. **📋 Domain Layer** (Entities)
   - Modelos: User, Request
   - Interfaces y tipos
   - Reglas de negocio

4. **🔌 Infrastructure Layer** (Data Access)
   - Archivos JSON (Mock)
   - Adaptadores de datos
   - Servicios externos

### **Flujo de Datos:**

```
UI Component → Use Case → Domain Model → Data Adapter → JSON/API
     ↓              ↓           ↓             ↓           ↓
[Presentation] [Business] [Entities] [Infrastructure] [External]
```

## 🚀 **Beneficios de la Arquitectura Implementada**

### **✅ Mantenibilidad**
- Código organizado en capas bien definidas
- Fácil localizar y modificar funcionalidades específicas
- Separación clara de responsabilidades

### **✅ Testabilidad**
- Lógica de negocio independiente de la UI
- Modelos y casos de uso fáciles de probar unitariamente
- Mock data intercambiable para testing

### **✅ Escalabilidad**
- Estructura preparada para crecimiento del proyecto
- Fácil agregar nuevas features sin afectar existentes
- Patrones consistentes en todo el proyecto

### **✅ Reusabilidad**
- Componentes y hooks reutilizables
- Modelos de dominio bien definidos
- Lógica de negocio centralizada

### **✅ Flexibilidad**
- Fácil intercambio de fuentes de datos (JSON → API)
- Adaptadores permiten cambios sin afectar el core
- Estrategias intercambiables para diferentes operaciones

## 🛠️ **Tecnologías y Herramientas**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand con persistencia
- **Patrones**: Clean Architecture, Repository, Strategy, Factory
- **Data**: JSON mock files (preparado para API)

## 🏃‍♂️ **Inicio Rápido**

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Construir para producción
pnpm build

# Ejecutar producción
pnpm start
```

## 📚 **Estructura del Proyecto**

```
residuos-app/
├── src/
│   ├── app/                 # 🖥️ Next.js App Router
│   │   ├── (dashboard)/     # 📊 Panel administrativo
│   │   ├── (landing)/       # 🏠 Página principal
│   │   └── (login)/         # 🔐 Autenticación
│   ├── features/            # 🎯 Lógica de negocio
│   │   ├── auth/            # 👤 Autenticación
│   │   ├── request/         # 📝 Gestión de solicitudes
│   │   └── landing/         # 🏠 Landing page
│   └── mock/                # 🗄️ Datos de prueba
│       ├── users.json       # 👥 Usuarios del sistema
│       └── requests.json    # 📋 Solicitudes de recolección
├── public/                  # 🖼️ Recursos estáticos
└── README.md               # 📖 Este archivo
```

---

**Desarrollado siguiendo principios de Clean Architecture y mejores prácticas de desarrollo de software** 🚀
