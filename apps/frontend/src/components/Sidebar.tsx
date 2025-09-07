import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  UserCheck,
  Heart,
  ClipboardList,
  DollarSign,
  BarChart3,
  Settings,
  Church,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Miembros', href: '/members', icon: Users },
  { name: 'Reuniones', href: '/meetings', icon: Calendar },
  { name: 'Asistencia', href: '/attendance', icon: UserCheck },
  { name: 'Ministerios', href: '/ministries', icon: Heart },
  { name: 'Seguimientos', href: '/follow-up', icon: ClipboardList },
  { name: 'Ofrendas', href: '/offerings', icon: DollarSign },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Church className="h-8 w-8 text-primary-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">ArkaOne</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          ArkaOne v1.0.0
        </p>
      </div>
    </div>
  );
}
