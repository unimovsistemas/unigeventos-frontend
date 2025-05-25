/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

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

export const getSubscriptionsByEvent = async (
  accessToken: string,
  id: string
): Promise<SubscriptionsByEventResponse[]> => {
  try {
    const response = await axios.get(`${API_URL}/queries/subscriptions-by-event`, {
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
