/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = "http://localhost:8001/rest/v1/payments";

export const applyDiscount = async (
    accessToken: string,
    paymentId: string,
    couponCode: string
  ): Promise<void> => {
    try {
      await axios.post(`${API_URL}/actions/apply-discount/${paymentId}`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
            "couponCode": couponCode
        }
      });
    } catch (error: any) {
      if (error?.status === 401) {
        error.response.data.message = "Usuário não autorizado para realizar esta operação!";
      }
      throw error;
    }
  };