import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from '../components/Login';
import Home from '../pages/Homepage';
import Page404 from '../pages/Page404';
import Page403 from '../pages/Page403';
import { AuthContext } from '../context/auth';
import { getStore } from '../utils';
import Profile from '../pages/Profilepage';
import Setting from '../pages/Settingpage';


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
            <Route exact path='/setting' component={Setting} />
            <Route path="/404" component={Page404} />
            <Route path="/403" component={Page403} />
            <Route path='*' component={Login} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    )
  }
}

export default Navigation;