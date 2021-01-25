import { createSlice, current } from '@reduxjs/toolkit';

interface History {
  id: string;
  nameProduct: string;
  productId: string | number;
  link: string;
  quantity: number;
  status: boolean;
  error: string | null;
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
}

export interface AccountType {
  accounts: Array<Account> | null;
  error: boolean | string | null;
  loading: boolean;
  openModal: boolean;
}

export interface AccountID {
  id: string;
}

const initialState: AccountType = {
  accounts: [
    {
      id: 'f873242f-bf26-4e5a-bb21-e9e3a82a825c',
      username: 'tle53161@gmail.com',
      password: 'Lhv123321',
      isLogin: false,
      access_token: '',
      refresh_token: 'feceb4b8-6a14-451c-a00f-e1fa98007c07',
      token_type:
        'eu mi nulla ac enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis',
      expires_in: 1800,
      expires_at: 171021037,
      customer_id: 'e4e4cd51-acde-4fbd-8c13-f224643e319e',
      isProcessing: false,
      histories: [],
    },
    {
      id: 'e05fea1a-1804-4667-a1c5-54669b5c2509',
      username: 'lt4211987@gmail.com',
      password: 'Lhv123321',
      isLogin: false,
      access_token: '',
      refresh_token: 'b6bbe334-0a3f-4a31-b113-7279b882207e',
      token_type:
        'congue diam id ornare imperdiet sapien urna pretium nisl ut volutpat',
      expires_in: 1800,
      expires_at: 0,
      isProcessing: false,
      customer_id: '53f4415b-6002-4664-864f-7f6d3b076f18',
      histories: [],
    },
    {
      id: 'e9abc5ec-cc63-4544-ab2f-bb6622d9e34c',
      username: 'kmanhkhiem1@gmail.com',
      password: 'Lhv123321',
      isLogin: false,
      access_token: '',
      refresh_token: 'fe21d343-ad05-47f8-9598-9ed36311b7b4',
      token_type:
        'suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas ut massa quis augue luctus tincidunt nulla',
      expires_in: 1800,
      expires_at: 167069975,
      isProcessing: false,
      customer_id: 'b1db6254-a81b-47f8-a6be-a176f2d5b8cb',
      histories: [],
    },
    {
      id: 'd03a009c-bbf6-4f84-a988-b1ec2ab19493',
      username: 'buit0983@gmail.com',
      password: 'Lhv123321',
      isLogin: false,
      access_token: '',
      refresh_token: 'b14f3f5a-6095-4828-887a-2a407d352cd1',
      token_type:
        'suscipit ligula in lacus curabitur at ipsum ac tellus semper interdum mauris ullamcorper purus sit amet',
      expires_in: 1800,
      expires_at: 0,
      isProcessing: false,
      customer_id: '756afb6b-e158-4fab-8708-f60cf9a19004',
      histories: [],
    },
    {
      id: '1dfeba0f-fe24-49e5-b287-7a98664055d6',
      username: 'phupngng233@gmail.com',
      password: 'Lhv123321',
      isLogin: false,
      access_token: '',
      refresh_token: '85ad673c-eeb8-4760-91d2-6c8f9b6d7a70',
      token_type:
        'rutrum at lorem integer tincidunt ante vel ipsum praesent blandit lacinia',
      expires_in: 1800,
      expires_at: 0,
      isProcessing: false,
      customer_id: 'ce692a04-3a64-4e2f-8e94-839a9b46d330',
      histories: [],
    },
  ],
  error: null,
  loading: false,
  openModal: false,
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
  },
});

export const { actions } = accountSlice;
