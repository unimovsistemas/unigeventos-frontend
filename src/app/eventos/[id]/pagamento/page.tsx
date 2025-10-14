"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { EventDataResponse } from '@/services/eventsService';
import { getEventById } from '@/services/publicEventsService';
import { 
  PaymentData, 
  PaymentType, 
  PaymentProvider,
  CreditCardInfo,
  processPayment,
  getPaymentTypeLabel 
} from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { 
  Calendar, 
  CreditCard, 
  Clock, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  DollarSign,
  User,
  MapPin,
  Receipt,
  Calendar as CalendarIcon,
  FileText,
  Smartphone,
  Percent,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  const registrationId = searchParams.get('registrationId');
  
  const [event, setEvent] = useState<EventDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>('PIX');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState<PaymentData>({
    registrationId: registrationId || '',
    paymentType: 'PIX',
    provider: 'AD_EVENTOS',
    installments: 1,
    discountCouponCode: '',
    creditCardInfo: {
      cardholderName: '',
      cardNumber: '',
      expirationMonth: '',
      expirationYear: '',
      cvv: ''
    }
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

  const handlePayNow = () => {
    setShowPaymentForm(true);
  };

  const handlePayLater = () => {
    router.push('/eventos');
  };

  const handlePaymentTypeChange = (type: PaymentType) => {
    setPaymentType(type);
    setFormData(prev => ({
      ...prev,
      paymentType: type,
      installments: type === 'CREDIT_CARD' ? 1 : undefined
    }));
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('creditCard.')) {
      const cardField = field.replace('creditCard.', '');
      setFormData(prev => ({
        ...prev,
        creditCardInfo: {
          ...prev.creditCardInfo!,
          [cardField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setProcessing(true);
      setError(null);
      
      const paymentData: PaymentData = {
        ...formData,
        registrationId: registrationId!
      };

      // Se não for cartão de crédito, remover informações do cartão
      if (paymentType !== 'CREDIT_CARD') {
        delete paymentData.creditCardInfo;
        delete paymentData.installments;
      }

      const response = await processPayment(paymentData);

      // Redirecionar para confirmação com sucesso
      router.push(`/eventos/${eventId}/confirmacao?registrationId=${registrationId}&paid=true`);
      
    } catch (err: any) {
      console.error('Erro ao processar pagamento:', err);
      setError(err.message || 'Erro ao processar pagamento.');
    } finally {
      setProcessing(false);
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 sm:py-16 lg:py-20">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 animate-spin text-orange-600 mb-4" />
        <span className="text-gray-600 font-medium text-sm sm:text-base">Carregando informações de pagamento...</span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-4">Erro ao Carregar Informações</h2>
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

  if (event.isFree) {
    // Se o evento for gratuito, redirecionar direto para confirmação
    router.push(`/eventos/${eventId}/confirmacao?registrationId=${registrationId}&paid=true`);
    return null;
  }

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

      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Inscrição Realizada com Sucesso!
              </h3>
              <p className="text-green-700">
                Sua inscrição foi registrada. Agora você pode escolher como deseja proceder com o pagamento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Summary */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-gray-900 mb-2">
            Resumo da Inscrição
          </CardTitle>
          <h2 className="text-lg sm:text-xl font-bold text-orange-600">
            {event.name}
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
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
              <Receipt className="h-4 w-4 text-orange-600" />
              <span className="text-gray-700">
                Inscrição: #{registrationId?.slice(-8)}
              </span>
            </div>
          </div>

          {/* Price Information */}
          {currentBatch && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-700 mb-2">
                  {formatPrice(currentBatch.price)}
                </div>
                <div className="text-orange-600 font-medium mb-1">
                  {currentBatch.name}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Pagamento até: {formatDate(event.finalDatePayment)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Options or Form */}
      {!showPaymentForm ? (
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
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Vantagens:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Vaga garantida instantaneamente</li>
                  <li>• Sem preocupações com prazos</li>
                  <li>• Receba QR Code de acesso</li>
                  <li>• Confirmação imediata por e-mail</li>
                </ul>
              </div>
              <Button
                onClick={handlePayNow}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pagar {currentBatch ? formatPrice(currentBatch.price) : 'Agora'}
              </Button>
            </CardContent>
          </Card>

          {/* Pay Later */}
          <Card className="border-yellow-200 hover:border-yellow-300 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-700 flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Pagar Depois</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm">
                Volte para a lista de eventos e pague quando quiser.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Importante:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Sua vaga foi reservada</li>
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
                <Home className="h-4 w-4 mr-2" />
                Voltar aos Eventos
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Payment Form */
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <span>Finalizar Pagamento</span>
              </CardTitle>
              <Button
                onClick={() => setShowPaymentForm(false)}
                variant="outline"
                size="sm"
              >
                Voltar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              {/* Payment Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Forma de Pagamento *
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePaymentTypeChange('PIX')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      paymentType === 'PIX' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <span className="text-sm font-medium">PIX</span>
                    <p className="text-xs text-gray-500 mt-1">Instantâneo</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handlePaymentTypeChange('CREDIT_CARD')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      paymentType === 'CREDIT_CARD' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <span className="text-sm font-medium">Cartão</span>
                    <p className="text-xs text-gray-500 mt-1">Até 12x</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handlePaymentTypeChange('INVOICE')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      paymentType === 'INVOICE' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FileText className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <span className="text-sm font-medium">Boleto</span>
                    <p className="text-xs text-gray-500 mt-1">3 dias úteis</p>
                  </button>
                </div>
              </div>

              {/* Discount Coupon */}
              <div className="space-y-3">
                <Label htmlFor="discountCoupon" className="text-sm font-medium text-gray-700">
                  Cupom de Desconto (opcional)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="discountCoupon"
                    type="text"
                    placeholder="Digite seu cupom de desconto"
                    value={formData.discountCouponCode}
                    onChange={(e) => handleInputChange('discountCouponCode', e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" className="px-4">
                    <Percent className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Credit Card Form */}
              {paymentType === 'CREDIT_CARD' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Dados do Cartão de Crédito</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="cardholderName" className="text-sm font-medium text-gray-700">
                        Nome do Portador *
                      </Label>
                      <Input
                        id="cardholderName"
                        type="text"
                        placeholder="Nome como impresso no cartão"
                        value={formData.creditCardInfo?.cardholderName}
                        onChange={(e) => handleInputChange('creditCard.cardholderName', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                        Número do Cartão *
                      </Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={formData.creditCardInfo?.cardNumber}
                        onChange={(e) => handleInputChange('creditCard.cardNumber', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expirationMonth" className="text-sm font-medium text-gray-700">
                        Mês *
                      </Label>
                      <Select
                        options={Array.from({length: 12}, (_, i) => ({
                          value: String(i + 1).padStart(2, '0'),
                          label: String(i + 1).padStart(2, '0')
                        }))}
                        value={formData.creditCardInfo?.expirationMonth || ''}
                        onChange={(value) => handleInputChange('creditCard.expirationMonth', value)}
                        placeholder="MM"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expirationYear" className="text-sm font-medium text-gray-700">
                        Ano *
                      </Label>
                      <Select
                        options={Array.from({length: 10}, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return {
                            value: String(year),
                            label: String(year)
                          };
                        })}
                        value={formData.creditCardInfo?.expirationYear || ''}
                        onChange={(value) => handleInputChange('creditCard.expirationYear', value)}
                        placeholder="AAAA"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                        CVV *
                      </Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="000"
                        maxLength={4}
                        value={formData.creditCardInfo?.cvv}
                        onChange={(e) => handleInputChange('creditCard.cvv', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="installments" className="text-sm font-medium text-gray-700">
                        Parcelas *
                      </Label>
                      <Select
                        options={Array.from({length: 12}, (_, i) => ({
                          value: String(i + 1),
                          label: `${i + 1}x ${currentBatch ? formatPrice(currentBatch.price / (i + 1)) : ''}`
                        }))}
                        value={String(formData.installments || 1)}
                        onChange={(value) => handleInputChange('installments', Number(value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800">Erro no Pagamento</p>
                      <p className="text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando Pagamento...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Finalizar Pagamento {currentBatch ? formatPrice(currentBatch.price) : ''}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Important Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-2">Informações Importantes:</p>
              <ul className="text-blue-700 space-y-1">
                <li>• Você receberá um e-mail de confirmação após a escolha</li>
                <li>• O QR Code de acesso será enviado após o pagamento</li>
                <li>• Em caso de dúvidas, entre em contato com os organizadores</li>
                <li>• Guarde o número da sua inscrição: #{registrationId?.slice(-8)}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}