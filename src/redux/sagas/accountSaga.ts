import { takeEvery, put, takeLatest, select } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import { actions as accountActions } from '../features/account/accountSlice';
import {
  login,
  getUserAddress,
  cancelOrder as cancelOrderById,
} from '../../api/account';
import { getProductInfo } from '../../api/product';
import {
  getCartData,
  addToCart,
  setAddress,
  setPaymentMethod,
  setGiftNone,
  completeCheckOut,
} from '../../api/cart';

export function* loginAccount({ payload }) {
  try {
    const resLogin = yield login({
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
        },
      });
    }
  } catch (error) {
    console.log({ error });
  }
}

export function* addAccount({ payload }) {
  try {
    const resLogin = yield login({
      email: payload.username,
      password: payload.password,
    });
    if (resLogin.data) {
      yield put({
        type: accountActions.addAccountSuccess,
        payload: {
          id: uuidv4(),
          ...resLogin.data,
          ...payload,
          histories: [],
          isLogin: true,
          isProcessing: false,
        },
      });
    } else {
      yield put({
        type: accountActions.addAccountFailed,
        payload: {
          error: resLogin.error.message ?? 'Tài khoản hoặc mật khẩu không đúng',
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
    const resLogin = yield login({
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

export function* processBuyProduct({ payload }) {
  console.log('Payload processbuy', payload);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const {
    access_token,
    quantity,
    productId: product_id,
    payment_method,
    gift,
  } = payload;
  try {
    const userAddress = yield getUserAddress({ access_token });
    const cartData = yield getCartData({ access_token });

    console.log({ cartData });
    yield addToCart({
      product_id,
      access_token,
      quantity: quantity.toString(),
    });
    yield setAddress({
      access_token,
      address_id: userAddress.data.data.find(
        (item: any) => item.is_default === true
      ).id,
    });
    yield setPaymentMethod({
      access_token,
      payment_method,
    });

    if (gift) {
      yield setGiftNone({
        access_token,
      });
    }
    const resCheckout = yield completeCheckOut({
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
        nameProduct:
          cartData?.data?.items[0]?.product_name ?? 'Không tìm thấy tên',
        productId: product_id,
        link: cartData?.data?.items[0]?.product_url ?? 'Không tìm thấy link',
        quantity,
        status: true,
        error: null,
      },
    });
  } catch (error) {
    console.log({ error });
    yield put({
      type: accountActions.processBuySuccess,
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

export function* cancelOrder({ payload }) {
  console.log('Payload cancel', payload);
  try {
    const res = yield cancelOrderById({
      access_token: payload.access_token,
      orderId: payload.orderId,
    });
    if (res.data) {
      yield put({ type: accountActions.cancelOrderSuccess, payload });
    }
  } catch (error) {
    console.log({ error });
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
  function* processBuyProductMultiple() {
    yield takeEvery(accountActions.processBuyProduct.type, processBuyProduct);
  },
];
