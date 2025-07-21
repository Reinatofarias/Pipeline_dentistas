import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Dentist } from "./DentistCard";

interface DentistFormProps {
  dentist?: Dentist;
  onSave: (dentist: Partial<Dentist>) => void;
  onClose: () => void;
}

const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const specialties = [
  "Orthodontics",
  "Endodontics", 
  "Implants",
  "Prosthodontics",
  "Periodontics",
  "Pediatric Dentistry",
  "Aesthetic Dentistry"
];

const statusOptions = [
  "Prospecting",
  "Contacted",
  "Negotiation", 
  "Closed",
  "Lost"
];

const specialtyLabels = {
  'Orthodontics': 'Ortodontia',
  'Endodontics': 'Endodontia', 
  'Implants': 'Implantes',
  'Prosthodontics': 'Prótese',
  'Periodontics': 'Periodontia',
  'Pediatric Dentistry': 'Odontopediatria',
  'Aesthetic Dentistry': 'Dentística'
};

const statusLabels = {
  'Prospecting': 'Prospecção',
  'Contacted': 'Contatado',
  'Negotiation': 'Negociação', 
  'Closed': 'Fechado',
  'Lost': 'Perdido'
};

export function DentistForm({ dentist, onSave, onClose }: DentistFormProps) {
  const [formData, setFormData] = useState({
    name: dentist?.name || '',
    phone: dentist?.phone || '',
    instagram: dentist?.instagram || '',
    clinic: dentist?.clinic || '',
    city: dentist?.city || '',
    state: dentist?.state || '',
    specialty: dentist?.specialty || '',
    status: dentist?.status || 'Prospecting' as Dentist['status'],
    last_contact_date: dentist?.last_contact_date || '',
    account_manager: dentist?.account_manager || 'Usuário Demo',
    notes: dentist?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      last_contact_date: formData.status !== 'Prospecting' && !formData.last_contact_date 
        ? new Date().toISOString().split('T')[0]
        : formData.last_contact_date
    };
    
    if (dentist) {
      onSave({ id: dentist.id, ...dataToSave });
    } else {
      onSave({ id: Date.now().toString(), ...dataToSave });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto crm-card-floating">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-primary text-white rounded-t-xl">
          <CardTitle className="text-xl">
            {dentist ? 'Editar Dentista' : 'Novo Dentista'}
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                type="url"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="https://instagram.com/usuario"
                className="form-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinic">Clínica/Consultório *</Label>
              <Input
                id="clinic"
                value={formData.clinic}
                onChange={(e) => handleInputChange('clinic', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {brazilianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade *</Label>
                <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialtyLabels[specialty as keyof typeof specialtyLabels]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as Dentist['status'])}>
                  <SelectTrigger className="form-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {statusLabels[status as keyof typeof statusLabels]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_contact_date">Data do Último Contato</Label>
              <Input
                id="last_contact_date"
                type="date"
                value={formData.last_contact_date}
                onChange={(e) => handleInputChange('last_contact_date', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Adicione observações sobre o contato..."
                className="form-input min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="btn-medical flex-1">
                {dentist ? 'Atualizar' : 'Salvar'} Dentista
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}