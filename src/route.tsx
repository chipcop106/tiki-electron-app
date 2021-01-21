import React from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Dashboard from './redux/features/dashboard';

const AppRouter = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard} />
        </Switch>
      </Router>
    </>
  );
};

export default AppRouter;
