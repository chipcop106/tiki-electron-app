import {
  takeEvery,
  put,
  takeLatest,
  select,
  call,
  take,
  delay,
} from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import { createStandaloneToast } from '@chakra-ui/react';
import { actions as accountActions } from '../features/account/accountSlice';
import {
  login,
  getUserAddress,
  cancelOrder as cancelOrderById,
  getOrderLists,
} from '../../api/account';
import { getProductInfo } from '../../api/product';

import {
  getCartData,
  addToCart,
  setAddress,
  setPaymentMethod,
  setGiftNone,
  completeCheckOut,
  deleteCart,
} from '../../api/cart';

const toast = createStandaloneToast();

export const processBuy = async (params: {
  access_token: string;
  gift: boolean;
  payment_method: string;
}) => {
  const { access_token, gift, payment_method } = params;

  return new Promise(async (resolve, reject) => {
    try {
      const userAddress = await getUserAddress({ access_token });
      await setAddress({
        access_token,
        address_id: userAddress.data.data.find(
          (item: any) => item.is_default === true
        ).id,
      });
      await setPaymentMethod({
        access_token,
        payment_method,
      });

      if (gift) {
        await setGiftNone({
          access_token,
        });
      }
      const resCheckout = await completeCheckOut({
        access_token,
        payment_method,
      });
      resolve(resCheckout);
    } catch (e) {}
  });
};

export function* loginAccount({ payload }) {
  try {
    const resLogin = yield call(login, {
      email: payload.username,
      password: payload.password,
    });
    if (resLogin.data) {
      yield put({
        type: accountActions.loginAccountSuccess,
        payload: {
          ...resLogin.data,
          ...payload,
          isLogin: true,
          cart: {
            cartItems: [],
            subTotal: 0,
          },
          isProcessing: false,
          buyError: {
            isError: false,
            message: '',
          },
        },
      });
    }
  } catch (error) {
    console.log({ error });
  }
}

export function* addAccount({ payload }) {
  try {
    const params = {
      email: payload.username,
      password: payload.password,
      otp_code: payload.otp_code,
    };

    const resLogin = yield call(login, params);
    if (
      resLogin.data.status === 'pending' &&
      resLogin.data.code === 'otp_required'
    ) {
      yield put({
        type: accountActions.addAccountFailed,
        payload: {
          error: `Vui lòng nhập mã OTP đã gửi vào SĐT: ${resLogin.data.phone_number}`,
        },
      });
      return false;
    }
    if (resLogin.data.access_token) {
      yield put({
        type: accountActions.addAccountSuccess,
        payload: {
          id: uuidv4(),
          ...resLogin.data,
          ...payload,
          histories: [],
          cart: {
            cartItems: [],
            subTotal: 0,
          },
          isLogin: true,
          isProcessing: false,
          buyError: {
            isError: false,
            message: '',
          },
        },
      });
    } else {
      yield put({
        type: accountActions.addAccountFailed,
        payload: {
          error:
            resLogin?.data?.error?.message ??
            'Tài khoản hoặc mật khẩu không đúng',
        },
      });
    }
  } catch (error) {
    yield put({
      type: accountActions.addAccountFailed,
      payload: {
        error:
          error?.response?.data?.error?.message ??
          'Tài khoản hoặc mật khẩu không đúng',
      },
    });
  }
}

export function* updateAccount({ payload }) {
  try {
    const resLogin = yield call(login, {
      email: payload.username,
      password: payload.password,
    });
    if (resLogin.data) {
      yield put({
        type: accountActions.updateAccountSuccess,
        payload,
      });
    } else {
      yield put({
        type: accountActions.updateAccountFailed,
        payload: {
          error: resLogin.error.message ?? 'Tài khoản hoặc mật khẩu không đúng',
        },
      });
    }
  } catch (error) {
    yield put({
      type: accountActions.updateAccountFailed,
      payload: {
        error:
          error?.response?.data?.error?.message ??
          'Tài khoản hoặc mật khẩu không đúng',
      },
    });
  }
}

export function* processingBuy({ payload }) {
  console.log('Dispatch processing');
  const { access_token, payment_method, gift } = payload;
  const cartData = yield call(getCartData, { access_token });
  const { items } = cartData.data;
  try {
    const userAddress = yield call(getUserAddress, { access_token });
    yield call(setAddress, {
      access_token,
      address_id: userAddress.data.data.find(
        (item: any) => item.is_default === true
      ).id,
    });
    yield call(setPaymentMethod, {
      access_token,
      payment_method,
    });

    if (gift) {
      yield call(setGiftNone, {
        access_token,
      });
    }
    const resCheckout = yield call(completeCheckOut, {
      access_token,
      payment_method,
    });

    yield put({
      type: accountActions.processBuySuccess,
      payload: {
        accountId: payload.id,
        id: uuidv4(),
        orderId:
          resCheckout?.data?.redirect_data?.order_code ?? 'Không có mã order',
        nameProduct: items[0].product_name ?? 'Không tìm thấy tên',
        productId: items[0].product_id ?? 'Không tìm thấy productId',
        link: items[0].product_url ?? 'Không tìm thấy link',
        quantity: items[0].qty ?? 'Không tìm thấy số lượng',
        status: true,
        error: null,
      },
    });
  } catch (error) {
    yield put({
      type: accountActions.processBuyFailed,
      payload: {
        accountId: payload.id,
        id: uuidv4(),
        nameProduct: '',
        productId: items[0].product_id,
        link: '',
        quantity: items[0].qty,
        status: false,
        error:
          error?.response?.data?.error?.message ?? 'Mua không thành công !!',
      },
    });
  } finally {
    yield put({
      type: accountActions.cancelProcessBuy,
      payload: {
        accountId: payload.id,
      },
    });
  }
}

export function* processBuyProduct({ payload }) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const {
    access_token,
    quantity,
    productId: product_id,
    payment_method,
    gift,
  } = payload;

  try {
    yield call(addToCart, {
      product_id,
      access_token,
      quantity: quantity.toString(),
    });
    const cartData = yield call(getCartData, { access_token });
    const { items } = cartData.data;

    const resBuy = yield call(processBuy, {
      access_token,
      payment_method,
      gift,
    });
    yield put({
      type: accountActions.processBuySuccess,
      payload: {
        accountId: payload.id,
        id: uuidv4(),
        orderId: resBuy?.data?.redirect_data?.order_code ?? 'Không có mã order',
        nameProduct: items[0].product_name ?? 'Không tìm thấy tên',
        productId: items[0].product_id ?? 'Không tìm thấy productId',
        link: items[0].product_url ?? 'Không tìm thấy link',
        quantity: items[0].qty ?? 'Không tìm thấy số lượng',
        status: true,
        error: null,
      },
    });
  } catch (error) {
    console.log({ error });
    yield put({
      type: accountActions.processBuyFailed,
      payload: {
        accountId: payload.id,
        id: uuidv4(),
        nameProduct: '',
        productId: payload.productId,
        link: '',
        quantity: payload.quantity,
        status: false,
        error:
          error?.response?.data?.error?.message ?? 'Mua không thành công !!',
      },
    });
  }
}

export function* processBuyCart({ payload }) {
  const { access_token, method: payment_method, gift, id } = payload;
  const cartData = yield call(getCartData, { access_token });
  try {
    const resBuy = yield call(processBuy, {
      access_token,
      payment_method,
      gift,
    });
    yield put({
      type: accountActions.checkPriceBuySuccess,
      payload: {
        ...payload,
      },
    });

    if (cartData.data) {
      const { items, subtotal } = cartData.data;
      const newItems = [...items].map((item) => ({
        id: item.id,
        subtotal: item.subtotal,
        price: item.price,
        product_id: item.product_id,
        product_name: item.product_name,
        product_url: item.product_url,
        qty: item.qty,
      }));
      if (newItems) {
        yield put({
          type: accountActions.getCartSuccess,
          payload: {
            id,
            cartItems: JSON.stringify(newItems),
            subTotal: subtotal,
          },
        });
      } else {
        yield put({
          type: accountActions.getCartError,
          payload: 'Lỗi khi lấy dữ liệu cart',
        });
      }
    }
  } catch (error) {
    yield put({
      type: accountActions.checkPriceBuyFailed,
      payload:
        error.response.error.message ?? 'Lỗi mua hàng không thành công !!',
    });
  }
}

export function* cancelOrder({ payload }) {
  try {
    const res = yield call(cancelOrderById, {
      access_token: payload.access_token,
      orderId: payload.orderId,
    });
    if (res.data) {
      const orders = yield call(getOrderLists, {
        access_token: payload.access_token,
        page: 1,
        limit: 5,
      });
      if (orders.data) {
        yield put({
          type: accountActions.getOrdersSuccess,
          payload: {
            accountId: payload.id,
            access_token: payload.access_token,
            histories: orders.data.data,
          },
        });
      }
      toast({
        description: `Hủy đơn hàng ${payload.orderId} thành công !!`,
        status: 'success',
      });
    }
  } catch (error) {
    console.log({ error });
    toast({
      description: `${payload.orderId}: ${
        error?.response?.error?.message ??
        `Hủy đơn hàng ${payload.orderId} thất bại !`
      }`,
      status: 'error',
    });
  }
}

export function* getCart({ payload }) {
  const { access_token, id } = payload;
  try {
    const cartData = yield call(getCartData, { access_token });
    console.log({ cartData });
    if (cartData.data) {
      const { items, subtotal } = cartData.data;
      const newItems = [...items].map((item) => ({
        id: item.id,
        subtotal: item.subtotal,
        price: item.price,
        product_id: item.product_id,
        product_name: item.product_name,
        product_url: item.product_url,
        qty: item.qty,
      }));
      if (newItems) {
        yield put({
          type: accountActions.getCartSuccess,
          payload: {
            id,
            cartItems: JSON.stringify(newItems),
            subTotal: subtotal,
          },
        });
      } else {
        yield put({
          type: accountActions.getCartError,
          payload: 'Lỗi khi lấy dữ liệu cart',
        });
      }
    }
  } catch (error) {
    console.log({ error });
    yield put({
      type: accountActions.getCartError,
      payload: error?.response?.error?.message ?? 'Lỗi khi lấy dữ liệu cart',
    });
  }
}

export function* deleteCartItem({ payload }) {
  const { access_token, id, itemId } = payload;
  try {
    yield delay(1000);
    const res = yield call(deleteCart, { access_token, itemId });
    if (res.status === 204) {
      yield put({
        type: accountActions.deleteCartItemSuccess,
        payload,
      });
      toast({
        description: 'Delete successfully !',
        status: 'success',
        duration: 2500,
        isClosable: true,
      });
    }
  } catch (error) {
    yield put({
      type: accountActions.deleteCartItemFailed,
      payload: error?.response?.error?.message ?? 'Lỗi khi lấy dữ liệu cart',
    });
    toast({
      description: 'Delete error !',
      status: 'error',
      duration: 2500,
      isClosable: true,
    });
  }
}

export function* addCartProduct({ payload }) {
  try {
    const { product_id, quantity, access_token, id } = payload;
    yield call(addToCart, {
      product_id,
      access_token,
      quantity: quantity.toString(),
    });

    const cartData = yield call(getCartData, { access_token });

    const newItem = cartData.data.items.find(
      (item) => item.product_id.toString() === product_id
    );
    yield put({
      type: accountActions.addCartProductSuccess,
      payload: {
        ...payload,
        item: JSON.stringify({
          id: newItem.id,
          subtotal: newItem.subtotal,
          price: newItem.price,
          product_id: newItem.product_id,
          product_name: newItem.product_name,
          product_url: newItem.product_url,
          qty: newItem.qty,
        }),
      },
    });
  } catch (error) {
    console.log({ error });
    yield put({
      type: accountActions.addCartProductFailed,
      payload: error?.response?.error?.message ?? error.message,
    });
  }
}

export function* getOrders({ payload }) {
  const { id, access_token, username } = payload;
  try {
    const res = yield call(getOrderLists, { access_token, page: 1, limit: 5 });
    if (res.data) {
      yield put({
        type: accountActions.getOrdersSuccess,
        payload: {
          accountId: id,
          access_token,
          histories: res.data.data,
        },
      });
      toast({
        description: `Lấy lịch sử ${username} thành công`,
        status: 'success',
      });
    }
  } catch (e) {
    console.log({ e });
    toast({
      description: e?.response?.error?.message
        ? `Lấy lịch sử ${username} ${e.response.error.message}`
        : `Lấy lịch sử ${username} không thành công !`,
      status: 'error',
    });
  }
}

export default [
  function* loginAccountWatcher() {
    yield takeEvery(accountActions.loginAccount.type, loginAccount);
  },
  function* addAccountWatcher() {
    yield takeLatest(accountActions.addAccount.type, addAccount);
  },
  function* updateAccountWatcher() {
    yield takeLatest(accountActions.updateAccount.type, updateAccount);
  },
  function* cancelOrderWatcher() {
    yield takeLatest(accountActions.cancelOrder.type, cancelOrder);
  },
  function* getOrdersWatcher() {
    yield takeEvery(accountActions.getOrders.type, getOrders);
  },
  function* processBuyProductMultipleWatcher() {
    yield takeEvery(accountActions.processBuyProduct.type, processBuyProduct);
  },
  function* getCartWatcher() {
    yield takeEvery(accountActions.getCart.type, getCart);
  },
  function* deleteCartWatcher() {
    yield takeEvery(accountActions.deleteCartItem.type, deleteCartItem);
  },
  function* processBuyCartWatcher() {
    yield takeEvery(accountActions.checkPriceBuy.type, processBuyCart);
  },
  function* processingBuyWatcher() {
    yield takeEvery(accountActions.processingBuy, processingBuy);
  },
  function* addCartProductWatcher() {
    yield takeEvery(accountActions.addCartProduct.type, addCartProduct);
  },
];
