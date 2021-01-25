import axios from 'axios';
import instance from './instance';

export const login = async (params: LoginPayload) => {
  return axios.post('https://tiki.vn/api/v3/tokens', {
    grant_type: 'password',
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

interface AccessToken {
  access_token: string;
}

interface LoginPayload {
  id?: string;
  email: string;
  password: string;
}
