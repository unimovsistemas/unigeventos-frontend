"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Edit3,
  Shield
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Visualize suas informações pessoais</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Edit3 size={16} className="mr-2" />
          Editar Perfil
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">João Silva Santos</h2>
              <p className="text-gray-600">Membro desde outubro de 2023</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Perfil Verificado
                </Badge>
                <Badge variant="outline">
                  3 eventos participados
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} className="text-orange-600" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome Completo</label>
              <p className="text-gray-900 font-medium">João Silva Santos</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
              <p className="text-gray-900">15 de março de 1995</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">CPF</label>
              <p className="text-gray-900">***.***.***-**</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Gênero</label>
              <p className="text-gray-900">Masculino</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} className="text-orange-600" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">joao.silva@exemplo.com</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Telefone</label>
              <p className="text-gray-900">(11) 99999-9999</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">WhatsApp</label>
              <p className="text-gray-900">(11) 99999-9999</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin size={20} className="text-orange-600" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">CEP</label>
              <p className="text-gray-900">01234-567</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Logradouro</label>
              <p className="text-gray-900">Rua das Flores, 123</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Bairro</label>
              <p className="text-gray-900">Centro</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Cidade</label>
              <p className="text-gray-900">São Paulo</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Estado</label>
              <p className="text-gray-900">São Paulo</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Complemento</label>
              <p className="text-gray-900">Apto 45</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} className="text-orange-600" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Data de Cadastro</label>
              <p className="text-gray-900">15 de outubro de 2023</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Último Acesso</label>
              <p className="text-gray-900">Hoje às 14:30</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status da Conta</label>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Ativa
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Verificada
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tipo de Usuário</label>
              <p className="text-gray-900">Participante</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} className="text-orange-600" />
            Resumo de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-500">Eventos Inscritos</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-500">Eventos Participados</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-500">Pagamentos Realizados</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-500">Anos Como Membro</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}