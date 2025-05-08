// services/notificationService.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:8001/rest/v1/schedulings";

export const getUserNotifications = async (accessToken: string) => {
  const response = await axios.get(`${API_BASE_URL}/queries/get-user-notifications`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const subscribeToNotification = async (accessToken: string, notificationType: string) => {
  await axios.post(
    `${API_BASE_URL}/actions/subscribe-user-to-notification`,
    {},
    {
      params: { notificationType },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const unsubscribeFromNotification = async (accessToken: string, notificationType: string) => {
  await axios.post(
    `${API_BASE_URL}/actions/unsubscribe-user-from-notification`,
    {},
    {
      params: { notificationType },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
