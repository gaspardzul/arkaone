import { useState, useEffect } from 'react';
import { ChevronDown, Building2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@arkaone/ui';
import { useChurchStore } from '../stores/churchStore';
import toast from 'react-hot-toast';

export function ChurchSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    selectedChurch,
    availableChurches,
    loading,
    error,
    selectChurch,
    fetchAvailableChurches,
  } = useChurchStore();

  useEffect(() => {
    fetchAvailableChurches();
  }, [fetchAvailableChurches]);

  const handleChurchSelect = async (churchId: string) => {
    try {
      await selectChurch(churchId);
      setIsOpen(false);
      toast.success('Iglesia seleccionada correctamente');
    } catch (error) {
      toast.error('Error al seleccionar iglesia');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <Building2 className="h-4 w-4" />
        <span className="text-sm">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-500">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Error: {error}</span>
      </div>
    );
  }

  if (availableChurches.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <Building2 className="h-4 w-4" />
        <span className="text-sm">Sin acceso a iglesias</span>
      </div>
    );
  }

  if (availableChurches.length === 1) {
    const church = availableChurches[0];
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4 text-primary-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {church.name}
          </span>
          {church.organization && (
            <span className="text-xs text-gray-500">
              {church.organization.name}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-left"
      >
        <Building2 className="h-4 w-4 text-primary-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {selectedChurch?.name || 'Seleccionar iglesia'}
          </span>
          {selectedChurch?.organization && (
            <span className="text-xs text-gray-500">
              {selectedChurch.organization.name}
            </span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1 w-80 bg-white rounded-md shadow-lg border border-gray-200">
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Seleccionar Iglesia
                </p>
              </div>
              {availableChurches.map((church) => (
                <button
                  key={church.id}
                  onClick={() => handleChurchSelect(church.id)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {church.name}
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {church.organization && (
                        <span>{church.organization.name}</span>
                      )}
                      {church.isPrimary && (
                        <span className="bg-blue-100 text-blue-800 px-1 rounded">
                          Principal
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-600 px-1 rounded">
                        {church.role}
                      </span>
                    </div>
                  </div>
                  {selectedChurch?.id === church.id && (
                    <Check className="h-4 w-4 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
