// services/notificationService.ts
import { authApi } from '@/lib/apiClient';

export const getUserNotifications = async () => {
  const response = await authApi.get(`/schedulings/queries/get-user-notifications`);
  return response.data;
};

export const subscribeToNotification = async (notificationType: string) => {
  await authApi.post(
    `/schedulings/actions/subscribe-user-to-notification`,
    {},
    {
      params: { notificationType }
    }
  );
};

export const unsubscribeFromNotification = async (notificationType: string) => {
  await authApi.post(
    `/schedulings/actions/unsubscribe-user-from-notification`,
    {},
    {
      params: { notificationType }
    }
  );
};
