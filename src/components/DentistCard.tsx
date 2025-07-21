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
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-card-foreground group-hover:text-primary transition-colors truncate">
              Dr(a). {dentist.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              {dentist.city}, {dentist.state}
            </p>
          </div>
          <Badge className={`${statusInfo.class} text-xs font-medium shrink-0`}>
            {statusInfo.label}
          </Badge>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs">
            <User className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="font-medium truncate">{specialtyDisplay}</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <span className="text-card-foreground font-medium truncate block">{dentist.clinic}</span>
          </div>

          {dentist.last_contact_date && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="truncate">{new Date(dentist.last_contact_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
            </div>
          )}
        </div>

        <div className="flex gap-1.5 pt-1">
          <Button
            onClick={handleWhatsApp}
            size="sm"
            className="btn-success flex-1 text-xs py-1 h-7"
          >
            <Phone className="h-3 w-3 mr-1" />
            WhatsApp
          </Button>
          
          {dentist.instagram && (
            <Button
              onClick={handleInstagram}
              variant="outline"
              size="sm"
              className="btn-ghost-primary h-7 px-2"
            >
              <Instagram className="h-3 w-3" />
            </Button>
          )}
        </div>

        {dentist.notes && (
          <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground line-clamp-2">
            {dentist.notes}
          </div>
        )}

        <div className="flex gap-1 pt-1 border-t border-border/30">
          <Button
            onClick={() => onEdit(dentist)}
            variant="ghost"
            size="sm"
            className="flex-1 text-xs py-1 h-6"
          >
            Editar
          </Button>
          <Button
            onClick={() => onDelete(dentist.id)}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs py-1 h-6"
          >
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}