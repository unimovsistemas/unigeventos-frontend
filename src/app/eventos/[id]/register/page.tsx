"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { EventDataResponse } from '@/services/eventsService';
import { getEventById } from '@/services/publicEventsService';
import { 
  RegistrationData, 
  TransportationType, 
  registerForEvent, 
  getTransportationTypeLabel 
} from '@/services/registrationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  User,
  CheckCircle,
  Car,
  Bus,
  X,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const transportationOptions: { value: TransportationType; label: string; icon: any }[] = [
  { value: 'PERSONAL', label: 'Transporte Próprio', icon: Car },
  { value: 'EVENT_TRANSPORT', label: 'Transporte do Evento', icon: Bus },
  { value: 'NOT_APPLICABLE', label: 'Não se Aplica', icon: X }
];

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<EventDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationData>({
    eventId: eventId,
    transportationType: 'PERSONAL',
    ministries: '',
    additionalInfo: ''
  });

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

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await registerForEvent(formData);
      
      // Redirecionar para página de pagamento se necessário
      // Verificar tanto a resposta da API quanto se o evento é gratuito
      const requiresPayment = response.requiresPayment || (!event.isFree && getCurrentBatch());
      
      if (requiresPayment) {
        router.push(`/eventos/${eventId}/pagamento?registrationId=${response.id}`);
      } else {
        // Se for gratuito, redirecionar para página de confirmação
        router.push(`/eventos/${eventId}/confirmacao?registrationId=${response.id}&paid=true`);
      }
      
    } catch (err: any) {
      console.error('Erro ao realizar inscrição:', err);
      setError(err.message || 'Erro ao realizar inscrição.');
    } finally {
      setSubmitting(false);
    }
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
          onClick={() => router.push('/eventos')}
          className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base"
        >
          Voltar aos Eventos
        </Button>
      </div>
    );
  }

  const currentBatch = getCurrentBatch();

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8"
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
        <Button
          onClick={() => router.push(`/eventos/${eventId}`)}
          variant="outline"
          className="flex items-center space-x-2 border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Evento</span>
        </Button>
      </motion.div>

      {/* Event Summary */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl sm:text-2xl text-gray-900 mb-2">
                Inscrição no Evento
              </CardTitle>
              <h2 className="text-lg sm:text-xl font-bold text-orange-600 mb-4">
                {event.name}
              </h2>
            </div>
            <div className="text-right">
              {event.isFree ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-lg px-4 py-2">
                  Gratuito
                </Badge>
              ) : currentBatch ? (
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPrice(currentBatch.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentBatch.name}
                  </div>
                </div>
              ) : (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  Inscrições Encerradas
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-gray-700">
                {formatDateTime(event.startDatetime)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-orange-600" />
              <span className="text-gray-700">
                {event.location?.split('\n')[0] || 'Local a definir'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-orange-600" />
              <span className="text-gray-700">
                {event.organizer?.name || 'Organizador não informado'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-600" />
              <span className="text-gray-700">
                {event.capacity - event.numberOfSubscribers} vagas restantes
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Form */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-orange-600" />
            <span>Dados da Inscrição</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transportation Type */}
            <div className="space-y-3">
              <Label htmlFor="transportationType" className="text-sm font-medium text-gray-700">
                Como você irá ao evento? *
              </Label>
              <Select
                options={transportationOptions.map(option => ({
                  label: option.label,
                  value: option.value
                }))}
                value={formData.transportationType}
                onChange={(value: string) => 
                  handleInputChange('transportationType', value as TransportationType)
                }
                placeholder="Selecione o tipo de transporte"
                className="w-full"
              />
            </div>

            {/* Ministries */}
            <div className="space-y-3">
              <Label htmlFor="ministries" className="text-sm font-medium text-gray-700">
                Ministérios que participa (opcional)
              </Label>
              <Input
                id="ministries"
                type="text"
                placeholder="Ex: Louvor, Jovens, Intercessão..."
                value={formData.ministries}
                onChange={(e) => handleInputChange('ministries', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Informe os ministérios ou áreas em que você atua na igreja
              </p>
            </div>

            {/* Additional Information */}
            <div className="space-y-3">
              <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
                Informações Adicionais (opcional)
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Alguma informação adicional, necessidades especiais, restrições alimentares, etc."
                value={formData.additionalInfo}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('additionalInfo', e.target.value)}
                className="w-full min-h-[100px]"
              />
              <p className="text-xs text-gray-500">
                Compartilhe qualquer informação que possa ser importante para os organizadores
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800">Erro na Inscrição</p>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/eventos/${eventId}`)}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 text-base font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {event.isFree ? 'Confirmar Inscrição' : 'Ir para Pagamento'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 mb-2">Informações Importantes:</p>
              <ul className="text-yellow-700 space-y-1">
                <li>• Sua inscrição será confirmada após o preenchimento deste formulário</li>
                {!event.isFree && (
                  <li>• O pagamento deverá ser realizado na próxima etapa</li>
                )}
                <li>• Você receberá um e-mail de confirmação com todos os detalhes</li>
                <li>• Em caso de dúvidas, entre em contato com os organizadores</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}