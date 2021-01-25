import instance from './instance';

const PATH = 'carts';

export const getCartData = async (params: AccessToken) => {
  return instance.get(`${PATH}/mine`, {
    headers: {
      'x-access-token': params.access_token,
    },
    params: {
      include:
        'items,badges,messages,price_summary,eligible_coupon,shipping_address',
      platform: 'web',
    },
  });
};

export const addToCart = async (params: AddToCartPayload) => {
  return instance.post(
    `${PATH}/mine/items`,
    {
      products: [
        {
          product_id: params.product_id,
          qty: params.quantity,
        },
      ],
    },
    {
      headers: {
        'x-access-token': params.access_token,
      },
    }
  );
};

export const setAddress = async (params: {
  address_id: string | number;
  access_token: string;
}) => {
  return instance.put(
    `${PATH}/mine/shippings_addresses/${params.address_id}`,
    {},
    {
      headers: {
        'x-access-token': params.access_token,
      },
    }
  );
};

export const setPaymentMethod = async (params: {
  payment_method: string | 'cod';
  access_token: string;
}) => {
  return instance.put(
    `${PATH}/mine/payment_methods/${params.payment_method}`,
    {},
    {
      headers: {
        'x-access-token': params.access_token,
      },
    }
  );
};

export const setGiftNone = async (params: AccessToken) => {
  return instance.put(
    `${PATH}/mine/as_gift`,
    {
      is_sent_as_gift: false,
      gift_info: {
        from: '',
        to: '',
        message: '',
      },
    },
    {
      headers: {
        'x-access-token': params.access_token,
      },
    }
  );
};

export const completeCheckOut = async (params: {
  payment_method: string | 'cod';
  access_token: string;
}) => {
  return instance.post(
    `${PATH}/mine/checkout`,
    {
      payment: {
        method: params.payment_method,
        option_id: null,
      },
      tax_info: null,
      cybersource_information: {},
      customer_note: '',
    },
    {
      headers: {
        'x-access-token': params.access_token,
      },
    }
  );
};

interface AddToCartPayload extends AccessToken {
  product_id: string;
  quantity: number;
}

interface AccessToken {
  access_token: string;
}
