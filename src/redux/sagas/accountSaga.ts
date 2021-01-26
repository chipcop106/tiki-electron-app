import { takeEvery, put, takeLatest, select, call, take } from 'redux-saga/effects';
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
  deleteCart,
} from '../../api/cart';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
        },
      });
    }
  } catch (error) {
    console.log({ error });
  }
}

export function* addAccount({ payload }) {
  try {
    const resLogin = yield call(login, {
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
    const userAddress = yield call(getUserAddress, { access_token });
    const cartData = yield call(getCartData, { access_token });
    yield call(addToCart, {
      product_id,
      access_token,
      quantity: quantity.toString(),
    });
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

export function* processBuyCart({ payload }) {
  try {
    const { access_token, id, method: payment_method, gift } = payload;
    const userAddress = yield call(getUserAddress, { access_token });
    const cartData = yield call(getCartData, { access_token });
    yield call(setAddress, {
      access_token,
      address_id: userAddress.data.data.find(
        (item: any) => item.is_default === true
      ).id,
    });
    yield call(setPaymentMethod, {
      access_token,
      payment_method,
      gift,
    });

    if (gift) {
      yield call(setGiftNone, {
        access_token,
      });
    }
    yield call(completeCheckOut, {
      access_token,
      payment_method,
    });
    yield put({
      type: accountActions.checkPriceBuySuccess,
      payload: {
        ...payload,
      },
    });
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
      yield put({ type: accountActions.cancelOrderSuccess, payload });
    }
  } catch (error) {
    console.log({ error });
  }
}

export function* getCart({ payload }) {
  const { access_token, id } = payload;
  try {
    const cartData = yield call(getCartData, { access_token });
    if (cartData.data) {
      const {items, subtotal} = cartData.data;
      const newItems = items.map(item => ({
        id: item.id,
        subtotal: item.subtotal,
        price: item.price,
        product_id: item.product_id,
        product_name: item.product_name,
        product_url: item.product_url,
        qty: item.qty,
      }));
      yield put({
        type: accountActions.getCartSuccess,
        payload: {
          id,
          cartItems: JSON.stringify(newItems),
          subTotal: subtotal,
        },
      });
    }
  } catch (error) {
    yield put({
      type: accountActions.getCartError,
      payload: error.response.error.message ?? 'Lỗi khi lấy dữ liệu cart',
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
    }
  } catch (error) {
    yield put({
      type: accountActions.deleteCartItemFailed,
      payload: error?.response?.error?.message ?? 'Lỗi khi lấy dữ liệu cart',
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

    const newItem = cartData.data.find(
      (item) => item.product_id === product_id
    );
    yield put({
      type: accountActions.addCartProductSuccess,
      payload: {
        ...payload,
        item: {
          id: newItem.id,
          subtotal: newItem.subtotal,
          price: newItem.price,
          product_id: newItem.product_id,
          product_name: newItem.product_name,
          product_url: newItem.product_url,
          qty: newItem.qty,
        },
      },
    });
  } catch (error) {
    console.log({error});
    yield put({
      type: accountActions.addCartProductFailed,
      payload: error.response.error.message ?? 'Không thể thêm vào cart',
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
  function* addCartProductWatcher() {
    yield takeEvery(accountActions.addCartProduct.type, addCartProduct);
  },
];
