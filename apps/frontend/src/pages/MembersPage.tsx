import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button, Input, Card, CardContent, Badge, Spinner } from '@arkaone/ui';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { MemberModal } from '../components/MemberModal';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'VISITOR' | 'MEMBER';
  createdAt: string;
}

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (error) {
      toast.error('Error al cargar miembros');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este miembro?')) {
      return;
    }

    try {
      await api.delete(`/members/${memberId}`);
      toast.success('Miembro eliminado exitosamente');
      fetchMembers();
    } catch (error) {
      toast.error('Error al eliminar miembro');
    }
  };

  const handleModalSuccess = () => {
    fetchMembers();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const filteredMembers = members.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'success',
      MEMBER: 'default',
      VISITOR: 'warning',
      INACTIVE: 'secondary',
    } as const;

    const labels = {
      ACTIVE: 'Activo',
      MEMBER: 'Miembro',
      VISITOR: 'Visitante',
      INACTIVE: 'Inactivo',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
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
        <h1 className="page-title">Miembros</h1>
        <Button onClick={handleCreateMember} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Miembro
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
                  placeholder="Buscar miembros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="table-header">Nombre</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Teléfono</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Fecha Registro</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-gray-500">
                        {member.email || '-'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-gray-500">
                        {member.phone || '-'}
                      </div>
                    </td>
                    <td className="table-cell">
                      {getStatusBadge(member.status)}
                    </td>
                    <td className="table-cell">
                      <div className="text-gray-500">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditMember(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron miembros</p>
            </div>
          )}
        </CardContent>
      </Card>

      <MemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        member={selectedMember}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
