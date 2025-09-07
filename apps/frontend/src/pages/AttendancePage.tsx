import { useEffect, useState } from 'react';
import { UserCheck, Search, Filter } from 'lucide-react';
import { Button, Input, Card, CardContent, Badge, Spinner } from '@arkaone/ui';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface Attendance {
  id: string;
  present: boolean;
  notes?: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  meeting: {
    id: string;
    title: string;
    date: string;
    type: string;
  };
}

export function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await api.get('/attendance');
      setAttendances(response.data);
    } catch (error) {
      toast.error('Error al cargar asistencias');
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendances = attendances.filter(attendance =>
    `${attendance.member.firstName} ${attendance.member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendance.meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="page-title">Control de Asistencia</h1>
        <Button>
          <UserCheck className="h-4 w-4 mr-2" />
          Tomar Asistencia
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
                  placeholder="Buscar por miembro o reunión..."
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

      {/* Attendance Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="table-header">Miembro</th>
                  <th className="table-header">Reunión</th>
                  <th className="table-header">Fecha</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAttendances.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">
                          {attendance.member.firstName} {attendance.member.lastName}
                        </div>
                        {attendance.member.email && (
                          <div className="text-sm text-gray-500">
                            {attendance.member.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">
                        {attendance.meeting.title}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-gray-500">
                        {new Date(attendance.meeting.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="table-cell">
                      <Badge variant={attendance.present ? 'success' : 'destructive'}>
                        {attendance.present ? 'Presente' : 'Ausente'}
                      </Badge>
                    </td>
                    <td className="table-cell">
                      <div className="text-gray-500 max-w-xs truncate">
                        {attendance.notes || '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendances.length === 0 && (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay registros de asistencia
              </h3>
              <p className="text-gray-500">
                Los registros de asistencia aparecerán aquí
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
