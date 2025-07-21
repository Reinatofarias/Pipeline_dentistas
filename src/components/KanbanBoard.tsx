
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Upload, FileSpreadsheet } from "lucide-react";
import { DentistCard, Dentist } from "./DentistCard";
import { DentistForm } from "./DentistForm";
import { SpreadsheetImport } from "./SpreadsheetImport";

interface KanbanBoardProps {
  dentists: Dentist[];
  onAddDentist: (dentist: Partial<Dentist>) => void;
  onEditDentist: (dentist: Partial<Dentist>) => void;
  onDeleteDentist: (id: string) => void;
  onStatusChange: (id: string, status: Dentist['status']) => void;
  onImportDentists: (dentists: Partial<Dentist>[]) => void;
}

const statusColumns = [
  { key: 'Prospecting', label: 'Prospecção', color: 'bg-blue-50 border-blue-200' },
  { key: 'Contacted', label: 'Contatado', color: 'bg-yellow-50 border-yellow-200' },
  { key: 'Negotiation', label: 'Negociação', color: 'bg-orange-50 border-orange-200' },
  { key: 'Closed', label: 'Fechado', color: 'bg-green-50 border-green-200' },
  { key: 'Lost', label: 'Perdido', color: 'bg-red-50 border-red-200' }
];

export function KanbanBoard({ dentists, onAddDentist, onEditDentist, onDeleteDentist, onStatusChange, onImportDentists }: KanbanBoardProps) {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingDentist, setEditingDentist] = useState<Dentist | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDentists = dentists.filter(dentist =>
    (dentist.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dentist.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dentist.state || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dentist.specialty || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDentistsByStatus = (status: Dentist['status']) => {
    return filteredDentists.filter(dentist => dentist.status === status);
  };

  const handleSave = (dentistData: Partial<Dentist>) => {
    if (editingDentist) {
      onEditDentist(dentistData);
    } else {
      onAddDentist(dentistData);
    }
    setShowForm(false);
    setEditingDentist(null);
  };

  const handleEdit = (dentist: Dentist) => {
    setEditingDentist(dentist);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingDentist(null);
  };

  const handleImportClose = () => {
    setShowImport(false);
  };

  const handleImport = (importedDentists: Partial<Dentist>[]) => {
    onImportDentists(importedDentists);
    setShowImport(false);
  };

  const handleDragStart = (e: React.DragEvent, dentist: Dentist) => {
    e.dataTransfer.setData('dentist', JSON.stringify(dentist));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Dentist['status']) => {
    e.preventDefault();
    const dentistData = JSON.parse(e.dataTransfer.getData('dentist')) as Dentist;
    if (dentistData.status !== status) {
      onStatusChange(dentistData.id, status);
    }
  };

  const totalDentists = dentists.length;
  const totalClosed = dentists.filter(d => d.status === 'Closed').length;
  const conversionRate = totalDentists > 0 ? ((totalClosed / totalDentists) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header with Stats and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">OrigemProspec</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Total: <strong className="text-primary">{totalDentists}</strong> dentistas</span>
              <span>•</span>
              <span>Fechados: <strong className="text-success">{totalClosed}</strong></span>
              <span>•</span>
              <span>Conversão: <strong className="text-success">{conversionRate}%</strong></span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, cidade, estado ou especialidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 form-input"
            />
          </div>
          <Button
            onClick={() => setShowImport(true)}
            variant="outline"
            className="shrink-0"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar Planilha
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="btn-medical shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Dentista
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[700px]">
        {statusColumns.map(column => {
          const columnDentists = getDentistsByStatus(column.key as Dentist['status']);
          
          return (
            <div
              key={column.key}
              className={`kanban-column ${column.color} rounded-xl p-4`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.key as Dentist['status'])}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-base text-foreground">{column.label}</h3>
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {columnDentists.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[calc(700px-100px)]">
                {columnDentists.map(dentist => (
                  <div
                    key={dentist.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, dentist)}
                    className="cursor-move transform hover:scale-105 transition-transform duration-200"
                  >
                    <DentistCard
                      dentist={dentist}
                      onEdit={handleEdit}
                      onDelete={onDeleteDentist}
                      onStatusChange={onStatusChange}
                    />
                  </div>
                ))}
                
                {columnDentists.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum dentista nesta etapa</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      {showForm && (
        <DentistForm
          dentist={editingDentist}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}

      {/* Import Modal */}
      {showImport && (
        <SpreadsheetImport
          onImport={handleImport}
          onClose={handleImportClose}
        />
      )}
    </div>
  );
}
