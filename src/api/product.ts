import instance from './instance';

const PATH = 'products';

export const getProductInfo = async (params: ProductID) => {
  return instance.get(`/${PATH}/info`, {
    headers: {
      'x-access-token': params.access_token,
    },
    params: {
      platform: 'web',
    },
  });
};

interface AccessToken {
  access_token: string;
}

interface ProductID extends AccessToken {
  product_id: string | number;
}
