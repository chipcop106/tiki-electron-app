import instance from './instance';


//Login response code status 302 === found
export const loginOTP = async (params: LoginPayload) => {
  return instance.post(`/login`, {
    ...params
  }, {
    withCredentials: true
  });
};

export const getPhoneOTP = async (params: GetPhoneOTPPayload) => {
  return instance.post(`/v1/get_phone`, {
    service_id: "30",
    network_id: "3"
  });
};

interface AccessToken {
  access_token: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

