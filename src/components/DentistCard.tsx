import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Instagram, MapPin, Calendar, User } from "lucide-react";

export interface Dentist {
  id: string;
  name: string;
  phone: string;
  instagram?: string;
  clinic: string;
  city: string;
  state: string;
  specialty: string;
  status: 'Prospecting' | 'Contacted' | 'Negotiation' | 'Closed' | 'Lost';
  last_contact_date?: string;
  account_manager: string;
  notes?: string;
}

interface DentistCardProps {
  dentist: Dentist;
  onEdit: (dentist: Dentist) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Dentist['status']) => void;
}

const statusConfig = {
  'Prospecting': { class: 'status-prospecting', label: 'Prospecção' },
  'Contacted': { class: 'status-contacted', label: 'Contatado' },
  'Negotiation': { class: 'status-negotiation', label: 'Negociação' },
  'Closed': { class: 'status-closed', label: 'Fechado' },
  'Lost': { class: 'status-lost', label: 'Perdido' }
};

const specialtyTranslation = {
  'Orthodontics': 'Ortodontia',
  'Endodontics': 'Endodontia',
  'Implants': 'Implantes',
  'Prosthodontics': 'Prótese',
  'Periodontics': 'Periodontia',
  'Pediatric Dentistry': 'Odontopediatria',
  'Aesthetic Dentistry': 'Dentística'
};

export function DentistCard({ dentist, onEdit, onDelete, onStatusChange }: DentistCardProps) {
  const statusInfo = statusConfig[dentist.status];
  const specialtyDisplay = specialtyTranslation[dentist.specialty as keyof typeof specialtyTranslation] || dentist.specialty;

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá Dr(a). ${dentist.name}! Tudo bem?`);
    const whatsappUrl = `https://wa.me/55${dentist.phone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInstagram = () => {
    if (dentist.instagram) {
      window.open(dentist.instagram, '_blank');
    }
  };

  return (
    <Card className="crm-card hover-lift group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              Dr(a). {dentist.name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {dentist.city}, {dentist.state}
            </p>
          </div>
          <Badge className={`${statusInfo.class} text-xs font-medium`}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{specialtyDisplay}</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <strong className="text-card-foreground">{dentist.clinic}</strong>
          </div>

          {dentist.last_contact_date && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Último contato: {new Date(dentist.last_contact_date).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleWhatsApp}
            size="sm"
            className="btn-success flex-1 text-xs"
          >
            <Phone className="h-3 w-3 mr-1" />
            WhatsApp
          </Button>
          
          {dentist.instagram && (
            <Button
              onClick={handleInstagram}
              variant="outline"
              size="sm"
              className="btn-ghost-primary"
            >
              <Instagram className="h-3 w-3" />
            </Button>
          )}
        </div>

        {dentist.notes && (
          <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
            {dentist.notes}
          </div>
        )}

        <div className="flex gap-1 pt-2 border-t border-border/30">
          <Button
            onClick={() => onEdit(dentist)}
            variant="ghost"
            size="sm"
            className="flex-1 text-xs"
          >
            Editar
          </Button>
          <Button
            onClick={() => onDelete(dentist.id)}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
          >
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}