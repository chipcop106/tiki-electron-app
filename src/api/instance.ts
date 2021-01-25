import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://tiki.vn/api/v2',
  timeout: 5000,
  timeoutErrorMessage: 'Request thất bại do phản hồi quá lâu !!',
});

export default instance;
