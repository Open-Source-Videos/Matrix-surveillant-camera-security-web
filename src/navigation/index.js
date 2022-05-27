import React, { 
	Component 
} from 'react';
import { 
	BrowserRouter as Router, 
	Route, 
	Switch 
} from 'react-router-dom';
import Login from '../components/Login';
import Home from '../pages/Homepage';
import Page404 from '../pages/Page404';
import Page403 from '../pages/Page403';
import { AuthContext } from '../context/auth';
import Profile from '../pages/Profile';
// import Setting from '../pages/Settingpage';
import Requests from '../pages/Requests';
import RoomPage from '../pages/Roompage';

class Navigation extends Component {
	render() {
		return (
			<AuthContext.Provider>
				<Router>
					<Switch>
						<Route exact path="/login" component={Login} />
						<Route exact path='/homepage' component={Home} />
						<Route exact path='/requests' component={Requests} />
						<Route exact path='/profile' component={Profile} />
						{/* <Route exact path='/setting' component={Setting} /> */}
						<Route exact path='/room' component={RoomPage} />
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