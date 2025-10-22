"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye
} from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Pagamentos</h1>
          <p className="text-gray-600">Histórico e status dos seus pagamentos</p>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.250,00</div>
            <p className="text-xs text-gray-500">8 pagamentos confirmados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 150,00</div>
            <p className="text-xs text-gray-500">1 pagamento pendente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 430,00</div>
            <p className="text-xs text-gray-500">2 pagamentos realizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Seus pagamentos mais recentes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment 1 - Pending */}
          <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Congresso de Louvor</h4>
                <p className="text-sm text-gray-500">Vencimento: 24/10/2025</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Pendente
                  </Badge>
                  <span className="text-sm text-yellow-700 font-medium">
                    Vence em 3 dias
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">R$ 150,00</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">
                  <Eye size={14} className="mr-1" />
                  Ver
                </Button>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Pagar
                </Button>
              </div>
            </div>
          </div>

          {/* Payment 2 - Confirmed */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Retiro de Jovens 2025</h4>
                <p className="text-sm text-gray-500">Pago em: 15/10/2025</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Confirmado
                  </Badge>
                  <span className="text-sm text-gray-500">PIX</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">R$ 350,00</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">
                  <Eye size={14} className="mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline">
                  <Download size={14} className="mr-1" />
                  Comprovante
                </Button>
              </div>
            </div>
          </div>

          {/* Payment 3 - Confirmed */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Workshop de Música</h4>
                <p className="text-sm text-gray-500">Pago em: 05/10/2025</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Confirmado
                  </Badge>
                  <span className="text-sm text-gray-500">Cartão de Crédito</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">R$ 80,00</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">
                  <Eye size={14} className="mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline">
                  <Download size={14} className="mr-1" />
                  Comprovante
                </Button>
              </div>
            </div>
          </div>

          {/* Load More */}
          <div className="text-center pt-4">
            <Button variant="outline">
              Carregar Mais Pagamentos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}