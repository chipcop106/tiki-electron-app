import instance from './instance';

const PATH = 'customers';

export const createCustomer = async (params: CreateCustomerPayload) => {
  return instance.post(`/${PATH}`, {
    ...params
  });
};

interface AccessToken {
  access_token: string;
}

interface CreateCustomerPayload {
  full_name: string;
  phone_number: number;
  otp_code: number;
  email: string;
  password: string;
  gender: string | 'male';
  birthday: string; // yy-d-mm
  newsletter: boolean | false;
}

/* Response example
 *{"access_token":"eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyMDA4NDI5OSIsImlhdCI6MTYxMTgwODEzMywiZXhwIjoxNjExODA5OTMzLCJpc3MiOiJodHRwczovL3Rpa2kudm4iLCJjdXN0b21lcl9pZCI6IjIwMDg0Mjk5In0.IHilmDCPIYRs7sWB630ebaBNeEYCmXO0tzxBmpFxmQ9V7Tu76-DLOZE5FFE7O-AtaxEDryCmcb_RtmWq5SlW4-wooRm3b41Y10l0Dqp8HSS1ITZT7Z8Y2NEPsAp-zuN_dZQA82QOOWGABxMU0ENp3YZEMMhbQbW0PllZ_kM9Dz6uL97IdJSvh6Hpwnfr5q1CpHI2g06GrByXTJL9xScPyHZ39keESYa_-VSPI6pfoLiayui7AFzJLCUTTbuzkoh-1MpIJUZSkMQTHCDzAFQKkTGJLWBFdhhJPbFNbX71GkCwPrO64DaTCAXJOOjZ8Ctt5GZaZKGxJg7YaADZwnq3ltJpHnp_TyFQtssPvE7ifMziL19EBpNPpjnUvhYUKgE_NiX019bFad_8W9yXMBLCjWj3nTEOOcxbBB54nLgoLO_DfOuMxE9QQZVKiG1nBdFavgPg_bZuIOxzHhoAneT6IlKpL3U_Wt467dSZkKx3QUNopLlZx3A5F5TAMotikBqz3_Ef6_L7lPbBA8bPk6Lv_gkpQM1Fy2Utpy-qKfVpDeM0MsXJASSiGyr9YFvaxkW9E_cSAVjZBEuoINzNkzJaylPnyLJRfZ6kRA_vbPDODbS0sKwHCwGF_VXvOiG5BCL7PISMbjXZUO8zl6pHNbEcFrfGPqKHC7OPp-aYSYwX1Yw","refresh_token":"TKIA-BO9HCkKbuCECcR-ug5jyoN_9orYojxeNZoNTdFMRZDuY8uBW84GS1Ycsp3LhdDhNs7O3fO7uP9352qE","token_type":"bearer","expires_in":1800,"expires_at":1611809933889,"customer_id":20084299}
 *
 * */
