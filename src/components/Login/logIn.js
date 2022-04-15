import React, { Component } from 'react';
import { withRouter} from "react-router-dom";
import { connect } from 'react-redux';
//import { ActionCreators } from '../actions/profile'; 
//import { getStore } from '../utils'; 
import './style.css';
import { Row, Col, FormGroup, FormControl, ControlLabel, Button, HelpBlock, Label, Image } from 'react-bootstrap';
// import { isEmail, isEmpty, isLength, isContainWhiteSpace, isHomeServer } from '../shared/validator';
import { isEmail, isEmpty, isLength, isContainWhiteSpace, isHomeServer } from '../../pages/Homepage';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			formData: {}, // Contains login form data
			errors: {}, // Contains login field errors
			formSubmitted: false, // Indicates submit status of login form
			loading: false // Indicates in progress state of login form
		}
	}



	handleInputChange = (event) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		let { formData } = this.state;
		formData[name] = value;

		this.setState({
			formData: formData
		});
	}

	validateLoginForm = (e) => {
		let errors = {};
		const { formData } = this.state;

		if (isEmpty(formData.homeserver)) {
			errors.homeserver = "Homeserver can't be blank";
		} else if (!isHomeServer(formData.homeserver)) {
			errors.homeserver = "Please enter a valid homeserver";
		}

		if (isEmpty(formData.email)) {
			errors.email = "Email can't be blank";
		} else if (!isEmail(formData.email)) {
			errors.email = "Please enter a valid username";
		}

		if (isEmpty(formData.password)) {
			errors.password = "Password can't be blank";
		}  else if (isContainWhiteSpace(formData.password)) {
			errors.password = "Password should not contain white spaces";
		} else if (!isLength(formData.password, { gte: 6, lte: 16, trim: true })) {
			errors.password = "Password's length must between 6 to 16";
		}

		if (isEmpty(errors)) {
			return true;
		} else {
			return errors;
		}
	}

	login = (e) => {

	e.preventDefault();

	let errors = this.validateLoginForm();

	if(errors === true){
		alert("You are successfully signed in...");
		this.props.history.push('/homepage')
	} else {
		this.setState({
			errors: errors,
			formSubmitted: true
		});
	}
	}

	loginForm = async (event) => {
	// this.setState({ submitted: true });
	// event.preventDefault();
	// if (this.validateForm(this.state.errors)) {
	//    console.info('Valid Form')
	//    const user = getStore('user')
	//    if (user) {
	//     this.props.dispatch(ActionCreators.login(user));
	//     this.props.history.push('/home')
	//    } else {
	//      this.setState({ loginStatus: 'Login Failed! Invalid Username and Password'})
	//    }
	//  } else {
	//    console.log('Invalid Form')
	//  }
		this.props.history.push('/homepage')
	}

	render() {
		const { errors, formSubmitted } = this.state;
		
		return (
			<div className="bg-white m-4 rounded">
				<Row>
					<Col xs={12} lg={6} className="d-none d-lg-block">
						<Image src={"Mobile login-cuate.svg"} alt="login" />
					</Col>
					<Col xs={12} lg={6} className="Login my-auto">
					<figure id="mainImg" className="my-auto">
						<img src={"security-camera.png"} alt="MainImg" width={70} height={70}/>
						<figcaption id="figcaption text-lg">OpenCamera</figcaption>
					</figure>

					<h1 className="text-xxl fw-bold text-center py-3">Login</h1>

					<form onSubmit={this.login} className="px-3 px-md-5 mx-xl-5">
						<FormGroup 
							controlId="homeserver" 
							validationState={ 
								formSubmitted ? (errors.homeserver ? 'error' : 'success') : null 
							}
							className="my-2"
						>
							<ControlLabel id="homeserver1">Home server</ControlLabel>

							<FormControl 
								type="text" 
								name="homeserver" 
								placeholder="Enter your homeserver" 
								onChange={this.handleInputChange} 
							/>

							{ errors.homeserver &&
								<HelpBlock id="helpBlock">{errors.homeserver}</HelpBlock>
							}

							</FormGroup>
							<FormGroup 
								controlId="email" 
								validationState={ 
									this.formSubmitted ? (errors.email ? 'error' : 'success') : null 
								}
							>

							<ControlLabel id="homeserver1">Username</ControlLabel>

							<FormControl 
								type="text" 
								name="email" 
								placeholder="Enter your username" 
								onChange={this.handleInputChange} 
							/>

							{ errors.email &&
								<HelpBlock id="helpBlock">{errors.email}</HelpBlock>
							}
						</FormGroup>

						<FormGroup 
							controlId="password" 
							validationState={ 
								this.formSubmitted ? (errors.password ? 'error' : 'success') : null 
							}
							className="my-2"
						>
							<ControlLabel id="homeserver1">Password</ControlLabel>

							<FormControl 
								type="password" 
								name="password" 
								placeholder="Enter your password" 
								onChange={this.handleInputChange} 
							/>
							{ errors.password &&
								<HelpBlock id="helpBlock">{errors.password}</HelpBlock>
							}

						</FormGroup>

						<div className="text-center">
							<Button 
								id="button" 
								type="submit" 
								bsStyle="primary"
								className="border border-dark"
							>
								Login
							</Button>
						</div>

						<FormGroup 
							className="pt-4 text-center my-2"
						>
							<ControlLabel>Don't have an account?</ControlLabel>
							<Label 
								id="sign_up" 
								className="text-decoration-none text-sm ps-2"
							>
								Sign-up here! 
							</Label>
						</FormGroup>
					</form>
					</Col>
				</Row>
			</div>
		)
	}
}



const mapStateToProps = (state) => {
return {
profile: state.user.profile
}
}

export default connect(mapStateToProps)(withRouter(Login));