import { Settings, User, Bell, Shield, Database, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@arkaone/ui';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Configuración</h1>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary-600" />
              Perfil de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <p className="text-sm text-gray-600">Admin ArkaOne</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-600">admin@arkaone.local</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <p className="text-sm text-gray-600">Administrador</p>
              </div>
              <Button variant="outline" size="sm">
                Editar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary-600" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Nuevos miembros</p>
                  <p className="text-sm text-gray-500">Recibir notificaciones de nuevos registros</p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Tareas vencidas</p>
                  <p className="text-sm text-gray-500">Alertas de tareas de seguimiento vencidas</p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Reuniones próximas</p>
                  <p className="text-sm text-gray-500">Recordatorios de reuniones programadas</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary-600" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" size="sm" className="w-full">
                Cambiar Contraseña
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Configurar 2FA
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Ver Sesiones Activas
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary-600" />
              Datos y Respaldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" size="sm" className="w-full">
                Exportar Datos
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Crear Respaldo
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Importar Datos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-primary-600" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Versión</p>
              <p className="text-sm text-gray-600">ArkaOne v1.0.0</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Última actualización</p>
              <p className="text-sm text-gray-600">Enero 2024</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Soporte</p>
              <p className="text-sm text-gray-600">support@arkaone.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
