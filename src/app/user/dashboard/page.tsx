"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CreditCard, 
  User, 
  Bell, 
  TicketIcon,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Bem-vindo ao seu painel!
            </h1>
            <p className="text-orange-100">
              Gerencie suas inscrições, pagamentos e perfil de forma simples e rápida.
            </p>
          </div>
          <div className="hidden md:block">
            <User size={64} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Inscrições Ativas
            </CardTitle>
            <TicketIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500">
              +1 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Próximos Eventos
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">2</div>
            <p className="text-xs text-gray-500">
              Nos próximos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pagamentos Pendentes
            </CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1</div>
            <p className="text-xs text-gray-500">
              R$ 150,00 em aberto
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Eventos Concluídos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-xs text-gray-500">
              Total de participações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TicketIcon size={20} className="text-orange-600" />
              <span>Minhas Inscrições Recentes</span>
            </CardTitle>
            <CardDescription>
              Suas últimas inscrições em eventos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Retiro de Jovens 2025</h4>
                <p className="text-sm text-gray-500">Inscrito em 15/10/2025</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Confirmado
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Congresso de Louvor</h4>
                <p className="text-sm text-gray-500">Inscrito em 10/10/2025</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pendente Pagamento
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Workshop de Música</h4>
                <p className="text-sm text-gray-500">Inscrito em 05/10/2025</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Confirmado
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Ver Todas as Inscrições
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-orange-600" />
              <span>Ações Rápidas</span>
            </CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white justify-start"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Buscar Novos Eventos
            </Button>

            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Ver Pagamentos Pendentes
            </Button>

            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
            >
              <User className="mr-2 h-4 w-4" />
              Atualizar Meu Perfil
            </Button>

            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
            >
              <Bell className="mr-2 h-4 w-4" />
              Configurar Notificações
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock size={20} className="text-orange-600" />
            <span>Próximos Eventos</span>
          </CardTitle>
          <CardDescription>
            Eventos que você está inscrito nos próximos dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                  25
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Retiro de Jovens 2025</h4>
                <p className="text-sm text-gray-600">25-27 de Outubro • Águas de Lindóia</p>
                <p className="text-xs text-orange-600 font-medium">Faltam 4 dias</p>
              </div>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Ver Detalhes
              </Button>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-white font-bold">
                  15
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Congresso de Louvor</h4>
                <p className="text-sm text-gray-600">15 de Novembro • Centro de Convenções</p>
                <p className="text-xs text-gray-500">Faltam 25 dias</p>
              </div>
              <Button size="sm" variant="outline">
                Ver Detalhes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}