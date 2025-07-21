import { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { WelcomeModal } from "@/components/WelcomeModal";
import { Dentist } from "@/components/DentistCard";
import { useToast } from "@/hooks/use-toast";

// Sample data for initial demo
const sampleDentists: Dentist[] = [
  {
    id: '1',
    name: 'Ana Silva Santos',
    phone: '(11) 99999-1234',
    instagram: 'https://instagram.com/dranasilva',
    clinic: 'Clínica Sorrir',
    city: 'São Paulo',
    state: 'SP',
    specialty: 'Orthodontics',
    status: 'Prospecting',
    account_manager: 'Usuário Demo',
    notes: 'Especialista em ortodontia estética, consultório moderno na Vila Madalena.'
  },
  {
    id: '2', 
    name: 'Carlos Eduardo Lima',
    phone: '(21) 98888-5678',
    instagram: 'https://instagram.com/drcarlosendo',
    clinic: 'Lima Endodontia',
    city: 'Rio de Janeiro',
    state: 'RJ',
    specialty: 'Endodontics',
    status: 'Contacted',
    last_contact_date: '2024-12-20',
    account_manager: 'Usuário Demo',
    notes: 'Endodontista experiente, interesse em novas tecnologias.'
  },
  {
    id: '3',
    name: 'Marina Costa Oliveira',
    phone: '(85) 97777-9012',
    clinic: 'Implantes Premium',
    city: 'Fortaleza', 
    state: 'CE',
    specialty: 'Implants',
    status: 'Negotiation',
    last_contact_date: '2024-12-18',
    account_manager: 'Usuário Demo',
    notes: 'Clínica especializada em implantes, alta demanda de pacientes.'
  },
  {
    id: '4',
    name: 'Roberto Mendes Jr',
    phone: '(31) 96666-3456',
    instagram: 'https://instagram.com/drrobertomendes',
    clinic: 'Centro Odontológico BH',
    city: 'Belo Horizonte',
    state: 'MG',
    specialty: 'Aesthetic Dentistry',
    status: 'Closed',
    last_contact_date: '2024-12-15',
    account_manager: 'Usuário Demo',
    notes: '✅ Cliente fechado! Interesse em sistema completo de gestão.'
  }
];

export function CRMDashboard() {
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load sample data on component mount
    setDentists(sampleDentists);
  }, []);

  const handleAddDentist = (dentistData: Partial<Dentist>) => {
    const newDentist: Dentist = {
      ...dentistData,
      id: Date.now().toString(),
    } as Dentist;

    setDentists(prev => [...prev, newDentist]);
    
    toast({
      title: "Dentista adicionado!",
      description: `Dr(a). ${dentistData.name} foi adicionado ao pipeline.`,
      variant: "default",
    });
  };

  const handleEditDentist = (dentistData: Partial<Dentist>) => {
    setDentists(prev =>
      prev.map(dentist =>
        dentist.id === dentistData.id
          ? { ...dentist, ...dentistData } as Dentist
          : dentist
      )
    );

    toast({
      title: "Dentista atualizado!",
      description: `Informações de Dr(a). ${dentistData.name} foram atualizadas.`,
      variant: "default",
    });
  };

  const handleDeleteDentist = (id: string) => {
    const dentist = dentists.find(d => d.id === id);
    
    setDentists(prev => prev.filter(d => d.id !== id));
    
    toast({
      title: "Dentista removido",
      description: `Dr(a). ${dentist?.name} foi removido do pipeline.`,
      variant: "destructive",
    });
  };

  const handleStatusChange = (id: string, newStatus: Dentist['status']) => {
    const dentist = dentists.find(d => d.id === id);
    
    setDentists(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              status: newStatus,
              last_contact_date: newStatus !== 'Prospecting' 
                ? new Date().toISOString().split('T')[0]
                : d.last_contact_date
            }
          : d
      )
    );

    const statusLabels = {
      'Prospecting': 'Prospecção',
      'Contacted': 'Contatado', 
      'Negotiation': 'Negociação',
      'Closed': 'Fechado',
      'Lost': 'Perdido'
    };

    toast({
      title: "Status atualizado!",
      description: `Dr(a). ${dentist?.name} foi movido para ${statusLabels[newStatus]}.`,
      variant: newStatus === 'Closed' ? 'default' : 'default',
    });
  };

  return (
    <>
      <WelcomeModal />
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <KanbanBoard
            dentists={dentists}
            onAddDentist={handleAddDentist}
            onEditDentist={handleEditDentist}
            onDeleteDentist={handleDeleteDentist}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </>
  );
}