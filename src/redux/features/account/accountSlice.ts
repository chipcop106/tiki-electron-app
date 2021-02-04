import { createSlice, current } from '@reduxjs/toolkit';

interface History {
  id: string;
  nameProduct: string;
  productId: string | number;
  link: string;
  quantity: number;
  status: boolean;
  error: string | null;
  orderId: string | number | null;
}

interface Account {
  id: string;
  username: string;
  password: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  customer_id: string | number;
  histories: Array<History>;
  isLogin: boolean;
  isProcessing: boolean;
  cart: {
    cartItems: any[];
    subTotal: number;
  };
  buyError: {
    isError: boolean;
    message: string;
  };
}

export interface AccountType {
  accounts: Array<Account>;
  error: Error | boolean | string | null;
  loading: boolean;
  openModal: boolean;
  cartLoading: boolean;
  cartError: {
    isError: boolean;
    message: string;
  } | null;
  isAdding: boolean;
  addError: {
    isError: boolean;
    message: string;
  };
}

export interface AccountID {
  id: string;
}

const initialState: AccountType = {
  accounts: [],
  error: null,
  cartError: null,
  loading: false,
  openModal: false,
  cartLoading: false,
  isAdding: false,
  addError: {
    isError: false,
    message: '',
  },
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    openModalAccount: (state) => {
      state.openModal = true;
    },
    closeModalAccount: (state) => {
      state.openModal = false;
    },
    addAccount: (state, { payload }) => {
      state.loading = true;
      state.error = null;
    },
    addAccountSuccess: (state, { payload }) => {
      state.accounts = [payload, ...state.accounts];
      state.error = false;
      state.loading = false;
    },
    addAccountFailed: (state, { payload }) => {
      state.error = payload.error;
      state.loading = false;
    },
    deleteAccount: (state, { payload }) => {
      state.accounts = [...state.accounts].filter(
        (account) => account.id !== payload
      );
    },
    updateAccount: (state, { payload }) => {
      state.loading = true;
      state.error = null;
    },
    updateAccountSuccess: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload.id);
      if (index > -1) {
        state.accounts[index].username = payload.username;
        state.accounts[index].password = payload.password;
      }
      state.error = false;
      state.loading = false;
    },
    updateAccountFailed: (state, { payload }) => {
      state.error = payload.error;
      state.loading = false;
    },
    loginAccount: (state, { payload }) => {},
    loginAccountSuccess: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload.id);
      if (index > -1) {
        state.accounts[index] = {
          ...state.accounts[index],
          ...payload,
        };
      }
    },
    setExpiredToken: (state, { payload }) => {
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload) {
          return {
            ...account,
            isLogin: false,
            access_token: '',
            expires_at: null,
          };
        }
        return account;
      });
    },
    getCart: (state, { payload }) => {
      state.cartLoading = true;
      state.error = null;
    },
    getCartSuccess: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload.id);
      const { cartItems, subTotal } = payload;
      state.accounts[index].cart.cartItems = JSON.parse(cartItems);
      state.accounts[index].cart.subTotal = subTotal;
      state.cartLoading = false;
    },
    getCartError: (state, { payload }) => {
      state.error = payload;
      state.cartLoading = false;
    },
    deleteCartItem: (state, { payload }) => {
      state.cartError = null;
    },
    deleteCartItemSuccess: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload.id);
      const newCartItems = [...state.accounts[index].cart.cartItems].filter(
        (item) => item.id !== payload.itemId
      );
      state.accounts[index].cart.cartItems = newCartItems;
      state.accounts[index].cart.subTotal = newCartItems.reduce(
        (prev, next) => prev + next.subtotal,
        0
      );
      state.cartError = null;
    },
    deleteCartItemFailed: (state, { payload }) => {
      state.cartError = {
        isError: true,
        message: payload,
      };
    },

    clearError: (state) => {
      state.error = null;
    },

    processBuyProduct: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload.id);
      if (index > -1) {
        state.accounts[index].isProcessing = true;
      }
    },
    processingBuy: (state, { payload }) => {
      console.log('process buy nè');
    },
    processBuySuccess: (state, { payload }) => {
      const index = state.accounts.findIndex(
        (acc) => acc.id === payload.accountId
      );
      if (index > -1) {
        //   state.accounts[index].histories.push(payload);
        state.accounts[index].isProcessing = false;
      }
    },
    processBuyFailed: (state, { payload }) => {
      const index = state.accounts.findIndex(
        (acc) => acc.id === payload.accountId
      );
      if (index > -1) {
        //  state.accounts[index].histories.push(payload);
        state.accounts[index].isProcessing = false;
      }
    },
    cancelProcessBuy: (state, { payload }) => {},
    deleteHistories: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload);
      if (index > -1) {
        // state.accounts[index].histories = [];
      }
    },
    cancelOrder: (state, { payload }) => {},
    cancelOrderSuccess: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload.id);
      const historyIndex = state.accounts[index].histories.findIndex(
        (item) => item.orderId === payload.orderId
      );
      if (index > -1 && historyIndex > -1) {
        state.accounts[index].histories[historyIndex].status = false;
      }
    },
    getOrders: (state, { payload }) => {},
    getOrdersSuccess: (state, { payload }) => {
      const { accountId, histories } = payload;
      const index = state.accounts.findIndex((acc) => acc.id === accountId);
      console.log({ histories });
      console.log(state.accounts[index]);
      if (index > -1) {
        state.accounts[index].histories = histories;
      }
    },
    checkPriceBuy: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload.id);
      if (index > -1) {
        state.accounts[index].buyError.message = '';
        state.accounts[index].buyError.isError = false;
      }
    },
    checkPriceBuySuccess: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload.id);
      if (index > -1) {
        state.accounts[index].cart.cartItems = [];
        state.accounts[index].buyError.message = 'Mua thành công !!';
        state.accounts[index].buyError.isError = false;
      }
    },
    checkPriceBuyFailed: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload.id);
      if (index > -1) {
        state.accounts[index].buyError.isError = true;
        state.accounts[index].buyError.message = payload;
      }
    },
    addCartProduct: (state, { payload }) => {
      state.isAdding = true;
      state.addError = {
        isError: false,
        message: '',
      };
    },
    addCartProductSuccess: (state, { payload }) => {
      const index = state.accounts.findIndex((acc) => acc.id === payload.id);
      const item = JSON.parse(payload.item);
      if (index > -1) {
        state.accounts[index].cart.cartItems.push(item);
        state.accounts[index].cart.subTotal =
          state.accounts[index].cart.subTotal + item.subtotal;
      }

      state.isAdding = false;
    },
    addCartProductFailed: (state, { payload }) => {
      state.isAdding = false;
      state.addError = {
        isError: true,
        message: payload,
      };
    },
  },
});

export const { actions } = accountSlice;
