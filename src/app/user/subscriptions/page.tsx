"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  AlertCircle
} from "lucide-react";

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Inscrições</h1>
          <p className="text-gray-600">Gerencie todas as suas inscrições em eventos</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar por nome do evento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={18} />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {/* Subscription Item 1 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Retiro de Jovens 2025
                  </h3>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Confirmado
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>25-27 de Outubro, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>Águas de Lindóia, SP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span>1 participante</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    Inscrito em: <strong>15/10/2025</strong>
                  </span>
                  <span className="text-gray-500">
                    Valor: <strong>R$ 350,00</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Eye size={16} className="mr-1" />
                  Detalhes
                </Button>
                <Button size="sm">
                  <Download size={16} className="mr-1" />
                  Comprovante
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Item 2 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Congresso de Louvor
                  </h3>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Pendente Pagamento
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>15 de Novembro, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>Centro de Convenções, SP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span>1 participante</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    Inscrito em: <strong>10/10/2025</strong>
                  </span>
                  <span className="text-gray-500">
                    Valor: <strong>R$ 150,00</strong>
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-orange-600">
                  <AlertCircle size={16} />
                  <span>Pagamento vence em 3 dias</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Eye size={16} className="mr-1" />
                  Detalhes
                </Button>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Pagar Agora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Item 3 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Workshop de Música
                  </h3>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Confirmado
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>20 de Outubro, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>Auditório Central, SP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span>1 participante</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    Inscrito em: <strong>05/10/2025</strong>
                  </span>
                  <span className="text-gray-500">
                    Valor: <strong>R$ 80,00</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Eye size={16} className="mr-1" />
                  Detalhes
                </Button>
                <Button size="sm">
                  <Download size={16} className="mr-1" />
                  Comprovante
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State - se não houver inscrições */}
      {/* <Card className="text-center p-12">
        <div className="space-y-4">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Nenhuma inscrição encontrada</h3>
            <p className="text-gray-600">Você ainda não se inscreveu em nenhum evento.</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700">
            Explorar Eventos
          </Button>
        </div>
      </Card> */}
    </div>
  );
}