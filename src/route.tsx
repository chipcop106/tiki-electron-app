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

const AppRouter = () => {
  return (
    <Router>
      <Redirect from="/" to="/dashboard" />
      <Nav />
      <Flex flexDirection="column" flexGrow={1} overflow="auto" py={4} px={4}>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/account" component={Account} />
        </Switch>
      </Flex>
      <Footer />
    </Router>
  );
};

export default AppRouter;
