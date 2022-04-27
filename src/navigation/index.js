import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from '../components/Login';
import Home from '../pages/Homepage';
import { AuthContext } from '../context/auth';
import { getStore } from '../utils';
import Profile from '../pages/Profilepage';


function AuthenticatedRoute ({component: Component, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => getStore('user') ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

class Navigation extends Component {
  render() {
    return (
      <AuthContext.Provider>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path='/homepage' component={Home} />
            <Route exact path='/profile' component={Profile} />
            <Route path='*' component={Login} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    )
  }
}

export default Navigation;