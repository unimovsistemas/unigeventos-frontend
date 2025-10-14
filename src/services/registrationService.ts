/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { Batch } from "./eventsService";
import { Registration, RegistrationExistsResponse } from "../types/registration";

export type SubscriptionStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELED"
  | "WAITLIST"
  | "REFUNDED";

  export type TransportationType =
  | "PERSONAL"
  | "EVENT_TRANSPORT"
  | "NOT_APPLICABLE";

export interface SubscriptionsByEventResponse {
    id: string;
    personId: string;
    personName: string;
    eventId: string;
    registrationDate: Date;
    status: SubscriptionStatus;
    amountPaid: number;
    totalDiscount: number;
    transportationType: TransportationType;
    ministries: string;
    additionalInfo: string;
    qrCodeBase64: string;
    checkedIn: boolean;
    batch: Batch;
}

const API_URL = "http://localhost:8001/rest/v1/registrations";

export const checkin = async (
  accessToken: string,
  registrationId: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/actions/checkin/${registrationId}`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao realizar checkin"
    );
  }
};

export const cancelRegistration = async (
  accessToken: string,
  registrationId: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/actions/cancel/${registrationId}`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao realizar o cancelamento da inscrição"
    );
  }
};

export const repay = async (
  accessToken: string,
  registrationId: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/actions/repay/${registrationId}`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao realizar o reembolso da inscrição"
    );
  }
};

export const putOnWaitingList = async (
  accessToken: string,
  registrationId: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/actions/put-waiting-list/${registrationId}`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao colocar a inscrição na lista de espera"
    );
  }
};

export const changeBatch = async (
  accessToken: string,
  registrationId: string,
  newBatchId: string,
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/actions/change-batch/${registrationId}`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        batchId: newBatchId
      }
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao alterar o lote da inscrição"
    );
  }
};

export const attachTerm = async (
  accessToken: string,
  registrationId: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/actions/attach-term/${registrationId}`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao alterar o lote da inscrição"
    );
  }
};

export const getSubscriptionsByEvent = async (
  accessToken: string,
  id: string,
  searchTerm = "",
  page: number = 0,
  size: number = 10
): Promise<SubscriptionsByEventResponse[]> => {
  try {
    const response = await axios.get(`${API_URL}/queries/subscriptions-by-event?page=${page}&size=${size}&searchTerms=${encodeURIComponent(searchTerm)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        "eventId": id
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar os dados do evento."
    );
  }
};

// Interfaces para registro de evento
export interface RegistrationData {
  eventId: string;
  transportationType: TransportationType;
  ministries: string;
  additionalInfo: string;
}

export interface RegistrationResponse {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  registrationDate: string;
  transportationType: TransportationType;
  ministries: string;
  additionalInfo: string;
  requiresPayment: boolean;
  paymentDeadline?: string;
  amount?: number;
}

export const registerForEvent = async (
  registrationData: RegistrationData
): Promise<RegistrationResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.post(
      `${API_URL}/actions/register`,
      registrationData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Erro ao realizar inscrição:', error);
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao realizar inscrição no evento!"
    );
  }
};

export const getTransportationTypeLabel = (type: TransportationType): string => {
  const labels = {
    PERSONAL: 'Transporte Próprio',
    EVENT_TRANSPORT: 'Transporte do Evento',
    NOT_APPLICABLE: 'Não se Aplica'
  };
  
  return labels[type];
};

// Buscar dados completos de uma inscrição específica
export const getRegistrationById = async (
  registrationId: string
): Promise<Registration> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get(
      `${API_URL}/entities/${registrationId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar dados da inscrição:', error);
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao buscar dados da inscrição!"
    );
  }
};

// Verificar se uma inscrição existe para um evento específico
export const checkRegistrationExists = async (
  eventId: string
): Promise<RegistrationExistsResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get(
      `${API_URL}/queries/check-exists`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          eventId: eventId
        }
      }
    );

    return response.data;
  } catch (error: any) {
    // Se não encontrar inscrição, retornar que não existe
    if (error?.response?.status === 404) {
      return { exists: false };
    }
    
    console.error('Erro ao verificar existência da inscrição:', error);
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao verificar inscrição!"
    );
  }
};
