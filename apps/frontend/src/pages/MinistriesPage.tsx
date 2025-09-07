import { useEffect, useState } from 'react';
import { Plus, Heart, Users, Edit, Trash2, UserPlus } from 'lucide-react';
import { Button, Card, CardContent, Badge, Spinner } from '@arkaone/ui';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface Ministry {
  id: string;
  name: string;
  description?: string;
  leader?: string;
  isActive: boolean;
  _count: {
    members: number;
  };
  members: Array<{
    member: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
    };
    role?: string;
    isActive: boolean;
  }>;
}

export function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const response = await api.get('/ministries');
      setMinistries(response.data);
    } catch (error) {
      toast.error('Error al cargar ministerios');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Ministerios</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ministerio
        </Button>
      </div>

      {/* Ministries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ministries.map((ministry) => (
          <Card key={ministry.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Heart className="h-5 w-5 text-primary-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">
                      {ministry.name}
                    </h3>
                  </div>
                  <Badge variant={ministry.isActive ? 'success' : 'secondary'}>
                    {ministry.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {ministry.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {ministry.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                {ministry.leader && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Líder: </span>
                    <span className="text-gray-600">{ministry.leader}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {ministry._count.members} miembros
                </div>
              </div>

              {/* Recent Members */}
              {ministry.members.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Miembros recientes:
                  </h4>
                  <div className="space-y-1">
                    {ministry.members.slice(0, 3).map((memberMinistry) => (
                      <div key={memberMinistry.member.id} className="text-sm text-gray-600">
                        {memberMinistry.member.firstName} {memberMinistry.member.lastName}
                        {memberMinistry.role && (
                          <span className="text-gray-400"> - {memberMinistry.role}</span>
                        )}
                      </div>
                    ))}
                    {ministry.members.length > 3 && (
                      <div className="text-sm text-gray-400">
                        +{ministry.members.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalles
                </Button>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ministries.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay ministerios registrados
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza creando tu primer ministerio
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Ministerio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
