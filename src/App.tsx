import React from 'react';
import { Provider } from 'react-redux';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import store from './redux/store';
import AppRouter from './route';

const colors = {};

const theme = extendTheme({ colors });

export default function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <AppRouter />
      </ChakraProvider>
    </Provider>
  );
}
