/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from '@/lib/apiClient';

export const applyDiscount = async (
    paymentId: string,
    couponCode: string
  ): Promise<void> => {
    try {
      await authApi.post(
        `/payments/actions/apply-discount/${paymentId}`, 
        null,
        {
          params: {
              "couponCode": couponCode
          }
        }
      );
    } catch (error: any) {
      if (error?.status === 401) {
        error.response.data.message = "Usuário não autorizado para realizar esta operação!";
      }
      throw error;
    }
  };