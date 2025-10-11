/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { EventDataResponse } from "./eventsService";

const API_URL = "http://localhost:8001";

export const getPublicEvents = async (
  searchTerm = "",
  page: number = 0,
  size: number = 9,
): Promise<EventDataResponse[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/events/queries/published-events?page=${page}&size=${size}&search=${encodeURIComponent(searchTerm)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar eventos públicos:', error);
    throw new Error(
      error?.response?.data?.message ||
        "Erro ao obter os eventos disponíveis!"
    );
  }
};

export const getPublicEventById = async (
  id: string
): Promise<EventDataResponse> => {
  try {
    const response = await axios.get(`${API_URL}/public/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar os dados do evento."
    );
  }
};