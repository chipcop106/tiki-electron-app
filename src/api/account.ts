import axios from 'axios';
import instance from './instance';

const DEVICE_ID = 'a85fa6bb-0451-79f8-b244-bf4b8e736654';

export const login = async (params: LoginPayload) => {
  return axios.post('https://tiki.vn/api/v3/tokens', {
    grant_type: 'password',
    device_id: DEVICE_ID,
    ...params,
  });
};

export const getUserInformation = async (params: AccessToken) => {
  return instance.get('/me', {
    headers: {
      'x-access-token': params.access_token,
    },
  });
};

export const getUserAddress = async (params: AccessToken) => {
  return instance.get('/me/address', {
    headers: {
      'x-access-token': params.access_token,
    },
  });
};

export const getOrderLists = async (params: {
  page: number;
  limit: number;
  access_token: string;
}) => {
  return instance.get('/me/orders', {
    headers: {
      'x-access-token': params.access_token,
    },
    params: {
      page: params.page,
      limit: params.limit,
    },
  });
};

export const cancelOrder = async (params: CancelOrderPayload) => {
  return instance.post(
    `me/orders/${params.orderId}/cancel`,
    {
      reason_code: '696',
      reason_detail: 'Đặt nhầm số lượng',
    },
    {
      headers: {
        'x-access-token': params.access_token,
      },
    }
  );
};

interface AccessToken {
  access_token: string;
}

interface CancelOrderPayload extends AccessToken {
  orderId: string;
}

interface LoginPayload {
  id?: string;
  email: string;
  password: string;
  otp_code?: string;
}
