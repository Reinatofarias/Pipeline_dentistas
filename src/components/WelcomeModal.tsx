import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Users, Target, TrendingUp, Zap } from "lucide-react";
import heroImage from "@/assets/crm-hero-image.jpg";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto crm-card-floating">
        <div className="relative">
          <img 
            src={heroImage} 
            alt="CRM Dashboard Preview" 
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-glow/90 rounded-t-xl flex items-center justify-center">
            <div className="text-center text-white space-y-2">
              <h1 className="text-3xl font-bold">CRM Odontológico</h1>
              <p className="text-xl text-white/90">Sistema de Prospecção para Dentistas</p>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                v1.0 - Demo Interativa
              </Badge>
            </div>
          </div>
          
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-card-foreground">
              Bem-vindo ao seu CRM Kanban! 🦷
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma solução completa para prospecção ativa de dentistas, 
              com pipeline visual, integração WhatsApp e gestão de leads profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Funcionalidades Principais
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                  <span><strong>Pipeline Kanban:</strong> 5 estágios (Prospecção → Fechado)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-success rounded-full mt-2"></div>
                  <span><strong>WhatsApp Integrado:</strong> Contato direto com um clique</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-warning rounded-full mt-2"></div>
                  <span><strong>Busca Avançada:</strong> Por nome, cidade, especialidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-destructive rounded-full mt-2"></div>
                  <span><strong>Arraste & Solte:</strong> Mova leads entre estágios facilmente</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Dados de Demonstração
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">4</div>
                  <div className="text-xs text-muted-foreground">Dentistas</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-success">1</div>
                  <div className="text-xs text-muted-foreground">Fechado</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-warning">25%</div>
                  <div className="text-xs text-muted-foreground">Conversão</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-xs text-muted-foreground">Estágios</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Como usar:</h3>
            </div>
            <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
              <li>Clique em <strong>"Novo Dentista"</strong> para adicionar leads</li>
              <li>Arraste os cards entre as colunas para atualizar o status</li>
              <li>Use o botão <strong>"WhatsApp"</strong> para contato direto</li>
              <li>Busque por nome, cidade ou especialidade na barra de pesquisa</li>
              <li>Acompanhe métricas em tempo real no cabeçalho</li>
            </ol>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <Button 
              onClick={() => setIsOpen(false)} 
              className="btn-medical px-8"
            >
              <Users className="h-4 w-4 mr-2" />
              Começar Prospecção
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}