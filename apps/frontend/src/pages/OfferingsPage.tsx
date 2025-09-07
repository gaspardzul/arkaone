import { useEffect, useState } from 'react';
import { Plus, DollarSign, Search, Filter, Calendar, TrendingUp } from 'lucide-react';
import { Button, Input, Card, CardContent, Badge, Spinner } from '@arkaone/ui';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Offering {
  id: string;
  amount: number;
  type: 'TITHE' | 'OFFERING' | 'SPECIAL_OFFERING' | 'DONATION';
  description?: string;
  date: string;
}

export function OfferingsPage() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const response = await api.get('/offerings');
      setOfferings(response.data);
    } catch (error) {
      toast.error('Error al cargar ofrendas');
    } finally {
      setLoading(false);
    }
  };

  const filteredOfferings = offerings.filter(offering =>
    offering.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offering.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeLabel = (type: string) => {
    const labels = {
      TITHE: 'Diezmo',
      OFFERING: 'Ofrenda',
      SPECIAL_OFFERING: 'Ofrenda Especial',
      DONATION: 'Donación',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      TITHE: 'default',
      OFFERING: 'success',
      SPECIAL_OFFERING: 'warning',
      DONATION: 'secondary',
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'default'}>
        {getTypeLabel(type)}
      </Badge>
    );
  };

  const totalAmount = filteredOfferings.reduce((sum, offering) => sum + offering.amount, 0);

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
        <h1 className="page-title">Ofrendas</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Ofrenda
        </Button>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Mostrado</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {filteredOfferings.length} registros
                </p>
              </div>
            </div>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ver Reportes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar ofrendas..."
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

      {/* Offerings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="table-header">Fecha</th>
                  <th className="table-header">Tipo</th>
                  <th className="table-header">Descripción</th>
                  <th className="table-header">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOfferings.map((offering) => (
                  <tr key={offering.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {format(new Date(offering.date), 'PPP', { locale: es })}
                      </div>
                    </td>
                    <td className="table-cell">
                      {getTypeBadge(offering.type)}
                    </td>
                    <td className="table-cell">
                      <div className="text-gray-900">
                        {offering.description || '-'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="font-semibold text-green-600">
                        ${offering.amount.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOfferings.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay registros de ofrendas
              </h3>
              <p className="text-gray-500 mb-4">
                Los registros de ofrendas aparecerán aquí
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Ofrenda
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
