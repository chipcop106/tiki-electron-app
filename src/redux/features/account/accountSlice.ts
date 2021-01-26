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
  } | null;
}

export interface AccountType {
  accounts: Array<Account> | null;
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
  addError: null,
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
      state.accounts = [...state.accounts].map((account) => {
        if (account.id === payload.id) {
          account.username = payload.username;
          account.password = payload.password;
        }
        return account;
      });
      state.error = false;
      state.loading = false;
    },
    updateAccountFailed: (state, { payload }) => {
      state.error = payload.error;
      state.loading = false;
    },
    loginAccount: (state, { payload }) => {},
    loginAccountSuccess: (state, { payload }) => {
      state.accounts = [...state.accounts].map((account) => {
        if (account.id === payload.id) {
          return { ...account, ...payload };
        }
        return account;
      });
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
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload.id) {
          return {
            ...account,
            cartItems: JSON.parse(payload.cartItems),
            subTotal: payload.subTotal,
          };
        }
        return account;
      });
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
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload.id) {
          const newCartItems = account.cart.cartItems.filter(
            (item) => item.id !== payload.itemId
          );

          return {
            ...account,
            cart: {
              ...account.cart,
              cartItems: newCartItems,
              subTotal: newCartItems.reduce(
                (prev, next) => prev + next.subtotal,
                0
              ),
            },
          };
        }
        return account;
      });
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
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload.id) {
          return { ...account, isProcessing: true };
        }
        return account;
      });
    },
    processBuySuccess: (state, { payload }) => {
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload.accountId) {
          account.histories.push(payload);
          return { ...account, isProcessing: false };
        }
        return account;
      });
    },
    deleteHistories: (state, { payload }) => {
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload) {
          account.histories = [];
        }
        return account;
      });
    },
    cancelOrder: (state, { payload }) => {},
    cancelOrderSuccess: (state, { payload }) => {
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload.id) {
          account.histories = account.histories.map((item) => {
            if (item.orderId === payload.orderId) {
              item.status = false;
            }
            return item;
          });
        }
        return account;
      });
    },
    checkPriceBuy: (state, { payload }) => {
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload.id) {
          account.buyError = {
            isError: false,
            message: '',
          };
        }
        return account;
      });
    },
    checkPriceBuySuccess: (state, { payload }) => {
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload.id) {
          account.cart.cartItems = [];
          account.buyError = {
            isError: false,
            message: 'Mua thành công !!',
          };
        }
        return account;
      });
    },
    checkPriceBuyFailed: (state, { payload }) => {
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload.id) {
          account.buyError = {
            isError: true,
            message: payload,
          };
        }
        return account;
      });
    },
    addCartProduct: (state, { payload }) => {
      state.isAdding = true;
      state.addError = {
        isError: false,
        message: '',
      };
      return state;
    },
    addCartProductSuccess: (state, { payload }) => {
      console.log({payload});
      state.accounts = [...state.accounts].map((account: Account) => {
        if (account.id === payload.id) {
          console.log('matching nè');
          return {
            ...account,
            cart: {
              cartItems: [...account.cart.cartItems, JSON.parse(payload.item)],
            },
          };
        }
        return account;
      });
      state.isAdding = false;
      return state;
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
