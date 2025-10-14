"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { EventDataResponse } from '@/services/eventsService';
import { getEventById } from '@/services/publicEventsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
  Receipt,
  Mail,
  QrCode,
  CreditCard,
  Clock,
  Home,
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  const registrationId = searchParams.get('registrationId');
  const paid = searchParams.get('paid') === 'true';
  
  const [event, setEvent] = useState<EventDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        
      } catch (err) {
        console.error('Erro ao carregar detalhes do evento:', err);
        setError('Não foi possível carregar os detalhes do evento.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const formatDateTime = (date: Date | string | null | undefined) => {
    if (!date) return 'Data não informada';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Data não informada';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  };

  const getCurrentBatch = () => {
    if (!event || event.isFree || !event.batches) return null;
    
    const now = new Date();
    return event.batches.find(batch => {
      const startDate = new Date(batch.startDate);
      const endDate = new Date(batch.endDate);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return false;
      }
      
      return startDate <= now && endDate >= now;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handlePayNow = async () => {
    // Redirecionar para página de pagamento
    router.push(`/eventos/${eventId}/pagamento?registrationId=${registrationId}`);
  };

  const handlePayLater = () => {
    // Apenas atualizar o status para mostrar como "reservado"
    alert('Lembre-se de efetuar o pagamento até a data limite!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Inscrição confirmada: ${event?.name}`,
          text: `Acabei de me inscrever no evento ${event?.name}!`,
          url: window.location.origin + `/eventos/${eventId}`
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.origin + `/eventos/${eventId}`);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 sm:py-16 lg:py-20">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 animate-spin text-orange-600 mb-4" />
        <span className="text-gray-600 font-medium text-sm sm:text-base">Carregando confirmação...</span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-4">Erro ao Carregar Confirmação</h2>
        <p className="text-red-600 mb-6">{error || 'Evento não encontrado'}</p>
        <Button 
          onClick={() => router.push('/eventos')}
          className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base"
        >
          Voltar aos Eventos
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Success Header */}
      <motion.div 
        className="text-center py-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          {paid ? 'Pagamento Confirmado!' : 'Inscrição Confirmada!'}
        </h1>
        <p className="text-lg text-gray-600">
          {paid 
            ? 'Sua vaga está garantida no evento'
            : 'Sua vaga foi reservada com sucesso'
          }
        </p>
      </motion.div>

      {/* Status Card */}
      <Card className={`border-2 ${paid ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            {paid ? (
              <CreditCard className="h-6 w-6 text-green-600 mt-0.5" />
            ) : (
              <Clock className="h-6 w-6 text-yellow-600 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${paid ? 'text-green-800' : 'text-yellow-800'}`}>
                {paid ? 'Vaga Confirmada e Paga' : 'Vaga Reservada - Aguardando Pagamento'}
              </h3>
              <p className={`${paid ? 'text-green-700' : 'text-yellow-700'} mb-4`}>
                {paid 
                  ? 'Seu pagamento foi processado com sucesso. Você receberá o QR Code de acesso por e-mail.'
                  : `Lembre-se de efetuar o pagamento até ${formatDate(event.finalDatePayment)} para garantir sua vaga.`
                }
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`font-medium ${paid ? 'text-green-800' : 'text-yellow-800'}`}>
                    Status: 
                  </span>
                  <Badge className={`ml-2 ${
                    paid 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }`}>
                    {paid ? 'Confirmado' : 'Pendente'}
                  </Badge>
                </div>
                <div>
                  <span className={`font-medium ${paid ? 'text-green-800' : 'text-yellow-800'}`}>
                    Inscrição: 
                  </span>
                  <span className={`ml-2 font-mono ${paid ? 'text-green-700' : 'text-yellow-700'}`}>
                    #{registrationId?.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-orange-600" />
            <span>Detalhes do Evento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-orange-600 mb-2">
                {event.name}
              </h3>
              <p className="text-gray-700 text-sm">
                {event.description?.substring(0, 200)}...
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <div>
                  <span className="font-medium text-gray-900">Data e Hora:</span>
                  <p className="text-gray-700">{formatDateTime(event.startDatetime)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-orange-600" />
                <div>
                  <span className="font-medium text-gray-900">Local:</span>
                  <p className="text-gray-700">{event.location?.split('\n')[0] || 'Local a definir'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-orange-600" />
                <div>
                  <span className="font-medium text-gray-900">Organizador:</span>
                  <p className="text-gray-700">{event.organizer?.name || 'Organizador não informado'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-orange-600" />
                <div>
                  <span className="font-medium text-gray-900">Capacidade:</span>
                  <p className="text-gray-700">{event.capacity} participantes</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Próximos Passos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-blue-800">Verificar E-mail</p>
                <p className="text-blue-700">Um e-mail de confirmação foi enviado com todos os detalhes.</p>
              </div>
            </div>
            
            {!paid && (
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-blue-800">Efetuar Pagamento</p>
                  <p className="text-blue-700">
                    Complete o pagamento até {formatDate(event.finalDatePayment)} para garantir sua vaga.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {paid ? '2' : '3'}
              </div>
              <div>
                <p className="font-medium text-blue-800">QR Code de Acesso</p>
                <p className="text-blue-700">
                  {paid 
                    ? 'Seu QR Code será enviado por e-mail em breve.'
                    : 'Após o pagamento, você receberá o QR Code para acesso ao evento.'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {paid ? '3' : '4'}
              </div>
              <div>
                <p className="font-medium text-blue-800">Comparecer ao Evento</p>
                <p className="text-blue-700">
                  Apresente seu QR Code na entrada do evento para realizar o check-in.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Buttons for Unpaid Events */}
      {!paid && !event.isFree && getCurrentBatch() && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pay Now */}
          <Card className="border-green-200 hover:border-green-300 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg text-green-700 flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Pagar Agora</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm">
                Finalize seu pagamento agora e garanta sua vaga imediatamente no evento.
              </p>
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-2xl font-bold text-green-700 mb-1">
                  {formatPrice(getCurrentBatch()!.price)}
                </div>
                <div className="text-sm text-green-600">
                  {getCurrentBatch()!.name}
                </div>
              </div>
              <Button
                onClick={handlePayNow}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pagar Agora
              </Button>
            </CardContent>
          </Card>

          {/* Pay Later */}
          <Card className="border-yellow-200 hover:border-yellow-300 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-700 flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pagar Depois</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm">
                Mantenha sua vaga reservada e pague até a data limite.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Lembre-se:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Pague até {formatDate(event.finalDatePayment)}</li>
                  <li>• Risco de perder a vaga se não pagar</li>
                  <li>• Receberá lembretes por e-mail</li>
                </ul>
              </div>
              <Button
                onClick={handlePayLater}
                variant="outline"
                className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-50 py-3"
              >
                <Clock className="h-4 w-4 mr-2" />
                Entendi, vou pagar depois
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.push('/eventos')}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3"
        >
          <Home className="h-4 w-4 mr-2" />
          Ver Mais Eventos
        </Button>
        
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 py-3"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar Evento
        </Button>

        {paid && (
          <Button
            onClick={() => alert('QR Code será enviado por e-mail!')}
            variant="outline"
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50 py-3"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Receber QR Code
          </Button>
        )}
      </div>

      {/* Support */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-2">Precisa de Ajuda?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Entre em contato com os organizadores do evento para qualquer dúvida ou suporte.
            </p>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Contatar Organizadores
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}