import { useEffect, useState } from 'react';
import { Plus, Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, Badge, Spinner } from '@arkaone/ui';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: string;
  location?: string;
  _count: {
    attendances: number;
  };
}

export function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await api.get('/meetings');
      setMeetings(response.data);
    } catch (error) {
      toast.error('Error al cargar reuniones');
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      SUNDAY_SERVICE: 'Servicio Dominical',
      PRAYER_MEETING: 'Reunión de Oración',
      BIBLE_STUDY: 'Estudio Bíblico',
      YOUTH_MEETING: 'Reunión Juvenil',
      SPECIAL_EVENT: 'Evento Especial',
      OTHER: 'Otro',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      SUNDAY_SERVICE: 'default',
      PRAYER_MEETING: 'secondary',
      BIBLE_STUDY: 'success',
      YOUTH_MEETING: 'warning',
      SPECIAL_EVENT: 'destructive',
      OTHER: 'outline',
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'outline'}>
        {getTypeLabel(type)}
      </Badge>
    );
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
        <h1 className="page-title">Reuniones</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Reunión
        </Button>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {meeting.title}
                  </h3>
                  {getTypeBadge(meeting.type)}
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

              {meeting.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {meeting.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(meeting.date), 'PPP p', { locale: es })}
                </div>

                {meeting.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {meeting.location}
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {meeting._count.attendances} asistentes
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="w-full">
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {meetings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay reuniones programadas
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza creando tu primera reunión
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reunión
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
