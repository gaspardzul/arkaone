import { useEffect, useState } from 'react';
import { Plus, ClipboardList, Search, Filter, Calendar, User, AlertCircle } from 'lucide-react';
import { Button, Input, Card, CardContent, Badge, Spinner } from '@arkaone/ui';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FollowUpTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
  };
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
}

export function FollowUpPage() {
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/follow-up-tasks');
      setTasks(response.data);
    } catch (error) {
      toast.error('Error al cargar tareas de seguimiento');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${task.member.firstName} ${task.member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'warning',
      IN_PROGRESS: 'default',
      COMPLETED: 'success',
      CANCELLED: 'secondary',
    } as const;

    const labels = {
      PENDING: 'Pendiente',
      IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completada',
      CANCELLED: 'Cancelada',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      LOW: 'secondary',
      MEDIUM: 'default',
      HIGH: 'warning',
      URGENT: 'destructive',
    } as const;

    const labels = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      URGENT: 'Urgente',
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
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
        <h1 className="page-title">Tareas de Seguimiento</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                    {task.dueDate && isOverdue(task.dueDate) && (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Vencida
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2" />
                  <span className="font-medium">Miembro: </span>
                  {task.member.firstName} {task.member.lastName}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  <span className="font-medium">Asignado a: </span>
                  {task.assignedTo.firstName} {task.assignedTo.lastName}
                </div>

                {task.dueDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium">Vence: </span>
                    {format(new Date(task.dueDate), 'PPP', { locale: es })}
                  </div>
                )}
              </div>

              {task.member.phone && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Teléfono: </span>
                    {task.member.phone}
                  </p>
                  {task.member.email && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email: </span>
                      {task.member.email}
                    </p>
                  )}
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalles
                </Button>
                <Button variant="outline" size="sm">
                  Completar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay tareas de seguimiento
            </h3>
            <p className="text-gray-500 mb-4">
              Las tareas de seguimiento aparecerán aquí
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
