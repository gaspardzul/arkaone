import { useEffect, useState } from 'react';
import { Users, Calendar, UserCheck, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Spinner } from '@arkaone/ui';
import { api } from '../lib/api';

interface Stats {
  members: {
    total: number;
    active: number;
    visitors: number;
    members: number;
  };
  meetings: {
    totalMeetings: number;
    thisMonth: number;
    thisWeek: number;
  };
  attendance: {
    attendanceRate: number;
    presentAttendances: number;
    totalAttendances: number;
  };
  offerings: {
    thisMonth: {
      amount: number;
      count: number;
    };
    thisYear: {
      amount: number;
      count: number;
    };
  };
  followUpTasks: {
    pending: number;
    overdue: number;
    total: number;
  };
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [membersRes, meetingsRes, attendanceRes, offeringsRes, tasksRes] = await Promise.all([
          api.get('/members/stats'),
          api.get('/meetings/stats'),
          api.get('/attendance/stats'),
          api.get('/offerings/stats'),
          api.get('/follow-up-tasks/stats'),
        ]);

        setStats({
          members: membersRes.data,
          meetings: meetingsRes.data,
          attendance: attendanceRes.data,
          offerings: offeringsRes.data,
          followUpTasks: tasksRes.data,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Miembros</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.members.total || 0}</p>
                <p className="text-xs text-gray-500">
                  {stats?.members.active || 0} activos, {stats?.members.visitors || 0} visitantes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reuniones</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.meetings.thisMonth || 0}</p>
                <p className="text-xs text-gray-500">Este mes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.attendance.attendanceRate?.toFixed(1) || 0}%
                </p>
                <p className="text-xs text-gray-500">Promedio general</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ofrendas</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats?.offerings.thisMonth.amount?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500">Este mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
              Resumen del Año
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Reuniones</span>
                <span className="font-semibold">{stats?.meetings.totalMeetings || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Asistencias Registradas</span>
                <span className="font-semibold">{stats?.attendance.totalAttendances || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ofrendas del Año</span>
                <span className="font-semibold">
                  ${stats?.offerings.thisYear.amount?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
              Tareas Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tareas</span>
                <span className="font-semibold">{stats?.followUpTasks.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pendientes</span>
                <span className="font-semibold text-yellow-600">
                  {stats?.followUpTasks.pending || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vencidas</span>
                <span className="font-semibold text-red-600">
                  {stats?.followUpTasks.overdue || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
