import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
}

export default App;