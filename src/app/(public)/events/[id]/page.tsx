"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EventDataResponse } from '@/services/eventsService';
import { getEventById } from '@/services/publicEventsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  User,
  CreditCard,
  Gift,
  Bus,
  Star,
  ChurchIcon,
  BusIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const eventTypeLabels = {
  CONFERENCE: 'Conferência',
  RETREAT: 'Retiro',
  SEMINARY: 'Seminário',
  WORKSHOP: 'Workshop',
  MEETING: 'Reunião',
  OTHER: 'Outro'
};

const eventTypeColors = {
  CONFERENCE: 'bg-blue-100 text-blue-800 border-blue-200',
  RETREAT: 'bg-green-100 text-green-800 border-green-200',
  SEMINARY: 'bg-purple-100 text-purple-800 border-purple-200',
  WORKSHOP: 'bg-orange-100 text-orange-800 border-orange-200',
  MEETING: 'bg-gray-100 text-gray-800 border-gray-200',
  OTHER: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { redirectToRegister, isCheckingRegistration } = useAuth();
  
  const [event, setEvent] = useState<EventDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar evento específico pelo ID
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        
      } catch (err) {
        console.error('Erro ao carregar detalhes do evento:', err);
        setError('Não foi possível carregar os detalhes do evento.');
        
        // Mock data para demonstração quando a API falhar
        const mockEvent: EventDataResponse = {
          id: eventId,
          name: 'Conferência de Jovens 2025',
          description: 'Uma conferência especial voltada para jovens e adolescentes, com pregações inspiradoras, louvores e momentos de comunhão. Este evento visa fortalecer a fé dos participantes e promover o crescimento espiritual através de uma programação rica e diversificada.\n\nA conferência contará com palestrantes renomados, bandas de louvor especiais e atividades interativas que prometem marcar a vida de cada participante. Será um fim de semana inesquecível de renovação espiritual e crescimento pessoal.',
          location: 'Centro de Convenções UniMovimento - Auditório Principal\nRua das Flores, 123 - Centro\nSão Paulo, SP - CEP: 01234-567',
          type: 'CONFERENCE',
          startDatetime: new Date('2025-02-15T09:00:00'),
          endDatetime: new Date('2025-02-16T18:00:00'),
          registrationStartDate: new Date('2025-01-01T00:00:00'),
          registrationDeadline: new Date('2025-02-10T23:59:59'),
          finalDatePayment: new Date('2025-02-12T23:59:59'),
          capacity: 500,
          isPublished: true,
          hasTransport: true,
          termIsRequired: false,
          isFree: false,
          organizerId: '1',
          organizer: {
            id: '1',
            name: 'Ministério de Jovens UniMovimento',
            contact: {
              email: 'contato@unimovimento.org',
              phone: '+55 (11) 98765-4321'
            }
          },
          numberOfSubscribers: 127,
          batches: [
            {
              id: '1',
              name: 'Lote Promocional',
              capacity: 200,
              price: 89.90,
              startDate: new Date('2025-01-01T00:00:00'),
              endDate: new Date('2025-01-31T23:59:59')
            },
            {
              id: '2',
              name: 'Lote Regular',
              capacity: 300,
              price: 119.90,
              startDate: new Date('2025-02-01T00:00:00'),
              endDate: new Date('2025-02-10T23:59:59')
            }
          ]
        };
        
        setEvent(mockEvent);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const handleRegister = () => {
    // Usar o hook de autenticação para redirecionamento inteligente
    redirectToRegister(eventId, true);
  };

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getCurrentBatch = () => {
    if (!event || event.isFree || !event.batches) return null;
    
    const now = new Date();
    return event.batches.find(batch => {
      const startDate = new Date(batch.startDate);
      const endDate = new Date(batch.endDate);
      
      // Verificar se as datas são válidas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return false;
      }
      
      return startDate <= now && endDate >= now;
    });
  };

  const getAvailableSlots = () => {
    if (!event) return 0;
    return event.capacity - event.numberOfSubscribers;
  };

  const isRegistrationOpen = () => {
    if (!event) return false;
    
    const now = new Date();
    const startDate = new Date(event.registrationStartDate);
    const endDate = new Date(event.registrationDeadline);
    
    // Verificar se as datas são válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return false;
    }
    
    return startDate <= now && endDate >= now;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 sm:py-16 lg:py-20">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 animate-spin text-orange-600 mb-4" />
        <span className="text-gray-600 font-medium text-sm sm:text-base">Carregando detalhes do evento...</span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-4">Erro ao Carregar Evento</h2>
        <p className="text-red-600 mb-6">{error || 'Evento não encontrado'}</p>
        <Button 
          onClick={() => router.push('/events')}
          className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base"
        >
          Voltar aos Eventos
        </Button>
      </div>
    );
  }

  const currentBatch = getCurrentBatch();
  const availableSlots = getAvailableSlots();
  const registrationOpen = isRegistrationOpen();

  return (
    <motion.div 
      className="w-full space-y-6 sm:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Back Button */}
      <motion.div 
        className="flex items-center space-x-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => router.push('/events')}
            variant="outline"
            className="flex items-center space-x-2 border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 px-3 sm:px-4 py-2 text-sm sm:text-base transition-all duration-300 group"
          >
            <motion.div
              animate={{ x: [-2, 0, -2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowLeft className="h-4 w-4 group-hover:text-orange-600 transition-colors duration-200" />
            </motion.div>
            <span className="hidden sm:inline">Voltar aos Eventos</span>
            <span className="sm:hidden">Voltar</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Event Details - Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Header */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={`${eventTypeColors[event.type as keyof typeof eventTypeColors]} px-3 py-1 text-sm font-medium border`}>
                      {eventTypeLabels[event.type as keyof typeof eventTypeLabels]}
                    </Badge>
                    {event.isFree && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-sm font-medium border">
                        <Gift className="h-3 w-3 mr-1" />
                        Gratuito
                      </Badge>
                    )}
                    {event.hasTransport && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 text-sm font-medium border">
                        <BusIcon className="h-3 w-3 mr-1" />
                        Transporte
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{event.name}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <ChurchIcon className="h-4 w-4 mr-2" />
                    <span>Organizado por {event.organizerName}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre o Evento</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Data de Início</h4>
                    <p className="text-gray-700 text-sm sm:text-base">{formatDateTime(event.startDatetime)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Data de Término</h4>
                    <p className="text-gray-700 text-sm sm:text-base">{formatDateTime(event.endDatetime)}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Local</h4>
                  <p className="text-gray-700 whitespace-pre-line">{event.location}</p>
                </div>
              </div>

              {/* Capacity and Registration Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Participantes</h4>
                    <p className="text-gray-700 text-sm sm:text-base">
                      {event.numberOfSubscribers} / {event.capacity} inscritos
                    </p>
                    <p className="text-xs sm:text-sm text-purple-600 mt-1">
                      {availableSlots} vagas disponíveis
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Prazo para Inscrição</h4>
                    <p className="text-gray-700 text-sm sm:text-base">{formatDate(event.registrationDeadline)}</p>
                    {!event.isFree && (
                      <p className="text-xs sm:text-sm text-orange-600 mt-1">
                        Pagamento até: {formatDate(event.finalDatePayment)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Card - Right Column */}
        <div className="lg:col-span-1">
          <Card className="border-gray-200 shadow-sm sticky top-6">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-bold text-gray-900">Inscrição</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Information */}
              {event.isFree ? (
                <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg border border-green-200">
                  <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-2xl font-bold text-green-700 mb-1 sm:mb-2">Gratuito</div>
                  <p className="text-green-600 text-xs sm:text-sm">Sem custo de inscrição</p>
                </div>
              ) : currentBatch ? (
                <div className="text-center p-4 sm:p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-2xl font-bold text-orange-700 mb-1 sm:mb-2">
                    {formatPrice(currentBatch.price)}
                  </div>
                  <p className="text-orange-600 text-xs sm:text-sm font-medium">{currentBatch.name}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Válido até {formatDate(currentBatch.endDate)}
                  </p>
                </div>
              ) : (
                <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 mx-auto mb-2 sm:mb-3" />
                  <div className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
                    Inscrições Encerradas
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    O prazo para inscrição expirou
                  </p>
                </div>
              )}

              {/* Registration Status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status das Inscrições:</span>
                  {registrationOpen ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Abertas
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Encerradas
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Vagas Restantes:</span>
                  <span className={`font-semibold ${availableSlots <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {availableSlots}
                  </span>
                </div>
              </div>

              {/* Requirements */}
              {event.termIsRequired && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">Termo de Responsabilidade</p>
                      <p className="text-yellow-700 mt-1">
                        Será necessário aceitar os termos durante a inscrição
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleRegister}
                disabled={!registrationOpen || availableSlots <= 0 || isCheckingRegistration}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-base sm:text-lg font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCheckingRegistration ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verificando inscrição...
                  </>
                ) : !registrationOpen ? (
                  'Inscrições Encerradas'
                ) : availableSlots <= 0 ? (
                  'Esgotado'
                ) : (
                  'Fazer Inscrição'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}