import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import Dashboard from './redux/features/dashboard';
import Account from './redux/features/account';
import { Nav, PageContainer, Footer } from './components/Layout';
import FastSale from './redux/features/fastsale';
import Deals from './redux/features/deals';

const AppRouter = () => {
  return (
    <Router>
      <Redirect from="/" to="/dashboard" />
      <Nav />
      <Flex flexDirection="column" flexGrow={1} overflow="auto" py={4} px={4}>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/account" component={Account} />
          <Route path="/fast-sale" component={FastSale} />
          <Route path="/deals" component={Deals} />
        </Switch>
      </Flex>
      <Footer />
    </Router>
  );
};

export default AppRouter;
