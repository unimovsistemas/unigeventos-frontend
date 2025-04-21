/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import Error from "next/error";

export interface Batch {
  name: string;
  capacity: number;
  price: number;
  startDate: Date;
  endDate: Date;
}

export type EventType =
  | ""
  | "RETREAT"
  | "LEADERS_RETREAT"
  | "MEETING"
  | "CONFERENCE"
  | "WORKSHOP"
  | "SEMINARY"
  | "VIGIL"
  | "CULT"
  | "CORAL"
  | "CONCERT"
  | "THEATER"
  | "COURSE"
  | "EVANGELISM";

export interface EventData {
  id: string;
  name: string;
  description?: string;
  location: string;
  type: EventType;
  startDatetime: Date;
  endDatetime: Date;
  registrationStartDate: Date;
  registrationDeadline: Date;
  finalDatePayment: Date;
  capacity: number;
  isPublished: boolean;
  hasTransport: boolean;
  termIsRequired: boolean;
  isFree: boolean;
  organizerId: string;
  organizer: {
    id: string;
  };
  batches: Batch[];
}

export interface EventDataResponse extends EventData {
  organizer: {
    id: string;
    name: string;
  }
  numberOfSubscribers: number;
}

const API_URL = "http://localhost:8001/rest/v1/events";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const getAllPage = async (
  accessToken: string,
  page: number = 0,
  size: number = 3
): Promise<PageResponse<EventDataResponse>> => {
  try {
    const response = await axios.get(
      `${API_URL}/entities/page?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao obter os eventos cadastrados!"
    );
  }
};

export const getEventById = async (
  accessToken: string,
  id: string
): Promise<EventDataResponse> => {
  try {
    const response = await axios.get(`${API_URL}/entities/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar os dados do evento."
    );
  }
};

export const createEvent = async (
  accessToken: string,
  data: Partial<EventData>
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/entities`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao criar novo evento."
    );
  }
};

export const updateEvent = async (
  accessToken: string,
  id: string,
  data: Partial<EventData>
): Promise<void> => {
  try {
    await axios.put(`${API_URL}/entities/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar evento."
    );
  }
};