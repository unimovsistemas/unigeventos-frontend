/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from '@/lib/apiClient';

export interface PaymentResponse {
  id: string;
  registration: {
    personName: string;
    eventName: string;
  };
  paymentType: string;
  status: string;
  provider: string;
  amount: number;
  paymentDate: string;
  installments: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const getPaymentsPage = async (
  page: number = 0,
  size: number = 10
): Promise<PageResponse<PaymentResponse>> => {
  try {
    const response = await authApi.get<PageResponse<PaymentResponse>>(
      `/payments/entities/page?page=${page}&size=${size}`
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao obter os status de pagamentos dos inscritos!"
    );
  }
};

// Tipos e interfaces para processamento de pagamento
export type PaymentStatus =
  | 'PENDING'
  | 'INPROCESS'
  | 'APPROVED'
  | 'REJECTED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'EXPIRED'
  | 'CHARGEBACK';

export interface SubscriptionPaymentInfo {
  status: PaymentStatus;
  discountCouponId?: string;
  amount?: number;
  installments?: number;
}

export const getSubscriptionPaymentStatus = async (
  registrationId: string
): Promise<SubscriptionPaymentInfo> => {
  try {
    const response = await authApi.get<SubscriptionPaymentInfo>(
      `/payments/queries/subscription-payment/${registrationId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar status do pagamento:', error);
    throw new Error(
      error?.response?.data?.message ||
        'Erro ao buscar status do pagamento!'
    );
  }
};
export type PaymentType = "CREDIT_CARD" | "INVOICE" | "PIX";
export type PaymentProvider = "AD_EVENTOS";

export interface CreditCardInfo {
  cardholderName: string;
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
}

export interface PaymentData {
  registrationId: string;
  paymentId?: string;
  paymentType: PaymentType;
  provider: PaymentProvider;
  installments?: number;
  discountCouponCode?: string;
  creditCardInfo?: CreditCardInfo;
}

export interface ProcessPaymentResponse {
  id: string;
  registrationId: string;
  amount: number;
  status: string;
  paymentType: PaymentType;
  provider: PaymentProvider;
  installments?: number;
  discountApplied?: number;
  processedAt: string;
  pixCode?: string;
  invoiceUrl?: string;
}

export const processPayment = async (
  paymentData: PaymentData
): Promise<ProcessPaymentResponse> => {
  try {
    const response = await authApi.post<ProcessPaymentResponse>(
      `/payments/actions/process-payment`,
      paymentData
    );

    return response.data;
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao processar pagamento!"
    );
  }
};

export const getPaymentTypeLabel = (type: PaymentType): string => {
  const labels = {
    CREDIT_CARD: 'Cartão de Crédito',
    INVOICE: 'Boleto Bancário',
    PIX: 'PIX'
  };
  
  return labels[type];
};

export const getPaymentProviderLabel = (provider: PaymentProvider): string => {
  const labels = {
    AD_EVENTOS: 'AD Eventos'
  };
  
  return labels[provider];
};
