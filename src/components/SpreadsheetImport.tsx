
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Upload, FileSpreadsheet, Download, CheckCircle } from "lucide-react";
import { Dentist } from "./DentistCard";
import { useToast } from "@/hooks/use-toast";

interface SpreadsheetImportProps {
  onImport: (dentists: Partial<Dentist>[]) => void;
  onClose: () => void;
}

export function SpreadsheetImport({ onImport, onClose }: SpreadsheetImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      if (lines.length < 2) {
        throw new Error('Arquivo deve conter pelo menos um cabeçalho e uma linha de dados');
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const row: any = {};
          
          headers.forEach((header, index) => {
            const value = values[index] || '';
            
            // Mapear colunas comuns
            switch (header) {
              case 'nome':
              case 'name':
                row.name = value;
                break;
              case 'telefone':
              case 'phone':
              case 'whatsapp':
                row.phone = value;
                break;
              case 'instagram':
                row.instagram = value;
                break;
              case 'clinica':
              case 'clinic':
              case 'consultorio':
                row.clinic = value;
                break;
              case 'cidade':
              case 'city':
                row.city = value;
                break;
              case 'estado':
              case 'state':
              case 'uf':
                row.state = value.toUpperCase();
                break;
              case 'especialidade':
              case 'specialty':
                row.specialty = mapSpecialty(value);
                break;
              case 'observacoes':
              case 'notes':
              case 'obs':
                row.notes = value;
                break;
              default:
                row[header] = value;
            }
          });

          // Definir valores padrão
          row.status = 'Prospecting';
          row.account_manager = 'Usuário Demo';
          
          data.push(row);
        }
      }

      setParsedData(data);
      
      toast({
        title: "Arquivo processado!",
        description: `${data.length} registros encontrados para importação.`,
      });
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: "Erro ao processar arquivo",
        description: "Verifique se o arquivo está no formato correto (CSV).",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const mapSpecialty = (value: string): string => {
    const specialtyMap: Record<string, string> = {
      'ortodontia': 'Orthodontics',
      'endodontia': 'Endodontics',
      'implantes': 'Implants',
      'protese': 'Prosthodontics',
      'periodontia': 'Periodontics',
      'odontopediatria': 'Pediatric Dentistry',
      'dentistica': 'Aesthetic Dentistry',
    };

    const normalized = value.toLowerCase().trim();
    return specialtyMap[normalized] || 'Orthodontics';
  };

  const handleImport = () => {
    if (parsedData.length === 0) {
      toast({
        title: "Nenhum dado para importar",
        description: "Selecione um arquivo válido primeiro.",
        variant: "destructive",
      });
      return;
    }

    onImport(parsedData);
    
    toast({
      title: "Importação concluída!",
      description: `${parsedData.length} dentistas foram importados com sucesso.`,
    });
  };

  const downloadTemplate = () => {
    const template = `nome,telefone,instagram,clinica,cidade,estado,especialidade,observacoes
Dr. João Silva,(11) 99999-1234,https://instagram.com/drjoao,Clínica Sorrir,São Paulo,SP,ortodontia,Especialista em ortodontia
Dra. Maria Santos,(21) 98888-5678,,Centro Odontológico,Rio de Janeiro,RJ,implantes,Clínica com foco em implantes`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_dentistas.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto crm-card-floating">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-primary text-white rounded-t-xl">
          <CardTitle className="text-xl flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Planilha
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
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Formato do Arquivo</h3>
                <p className="text-sm text-muted-foreground">
                  Faça upload de um arquivo CSV com os dados dos dentistas
                </p>
              </div>
              <Button
                onClick={downloadTemplate}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Modelo
              </Button>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-6">
              <div className="text-center space-y-4">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground" />
                
                <div>
                  <Label htmlFor="file" className="cursor-pointer">
                    <div className="text-sm font-medium">Clique para selecionar arquivo</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Formatos aceitos: CSV (.csv)
                    </div>
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {file && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {parsedData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">Preview dos Dados</h4>
                <Badge variant="secondary">
                  {parsedData.length} registros
                </Badge>
              </div>
              
              <div className="max-h-40 overflow-y-auto border rounded-lg">
                <div className="grid grid-cols-4 gap-2 p-3 bg-muted/50 text-xs font-medium">
                  <div>Nome</div>
                  <div>Telefone</div>
                  <div>Cidade</div>
                  <div>Especialidade</div>
                </div>
                {parsedData.slice(0, 5).map((row, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 p-3 text-xs border-t">
                    <div className="truncate">{row.name || '-'}</div>
                    <div className="truncate">{row.phone || '-'}</div>
                    <div className="truncate">{row.city || '-'}</div>
                    <div className="truncate">{row.specialty || '-'}</div>
                  </div>
                ))}
                {parsedData.length > 5 && (
                  <div className="text-center text-xs text-muted-foreground py-2">
                    ... e mais {parsedData.length - 5} registros
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleImport}
              className="btn-medical flex-1"
              disabled={parsedData.length === 0 || isProcessing}
            >
              {isProcessing ? 'Processando...' : `Importar ${parsedData.length} Dentistas`}
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

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Colunas aceitas:</strong> nome, telefone, instagram, clinica, cidade, estado, especialidade, observacoes</p>
            <p><strong>Estados:</strong> Use siglas (SP, RJ, MG, etc.)</p>
            <p><strong>Especialidades:</strong> ortodontia, endodontia, implantes, protese, periodontia, odontopediatria, dentistica</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
