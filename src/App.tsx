import React from 'react';
import { Provider } from 'react-redux';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import AppRouter from './route';
import { PageContainer } from './components/Layout';

const colors = {};

const theme = extendTheme({ colors });

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          <PageContainer isFixedNav>
            <AppRouter />
          </PageContainer>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}
