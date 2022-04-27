import React, { 
	useState 
} from 'react';
import { useHistory } from "react-router-dom";
import { withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import './style.css';
import { 
	Row, 
	Col, 
	FormGroup, 
	FormControl, 
	ControlLabel, 
	Button, 
	HelpBlock, 
	Label, 
	Image 
} from 'react-bootstrap';
import { 
	isEmpty, 
	isLength, 
	isContainWhiteSpace
} from '../../pages/Homepage';
import 'bootstrap/dist/css/bootstrap.min.css';
import useMatrixClient from '../../hooks/useMatrixClient';


// const BASE_URL = 'https://matrix.pdxinfosec.org';
// const PASSWORD = '66CeWrVm';
// const USERNAME = '@test008:pdxinfosec.org';
// const ROOM_ID = '!RNeodVfHGpDgUnjvYy:pdxinfosec.org';

export const Login = () => {
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({}); 
	const [formSubmitted, setFormSubmitted] = useState(false);
	const history = useHistory();

	
	const handleInputChange = (event) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		formData[name] = value;
		setFormData(formData);
	}

	const validateLoginForm = (e) => {
		if (isEmpty(formData.homeserver)) {
			errors.homeserver = "Homeserver can't be blank";
		}

		if (isEmpty(formData.email)) {
			errors.email = "Email can't be blank";
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

	const handleLoginResult = (
		_isLogin, 
		error, 
		exportedDevice, 
		accessToken
	) => {
        console.log('Login = ', _isLogin);
        console.log('error = ', error);
        console.log('exportedDevice = ', exportedDevice);
        console.log('accessToken = ', accessToken);

        if (exportedDevice && accessToken) {
            localStorage.setItem(
				formData.email, 
				JSON.stringify({exportedDevice,accessToken})
			);
        }
    };


	const {loginMatrixServer} =
	useMatrixClient(
		null,
		null,
		handleLoginResult
	);

	
	const login = async(e) => {
		e.preventDefault();

		await loginMatrixServer(
			formData.homeserver, 
			formData.email, 
			formData.password
		);

		console.log("#################");
		console.log(loginMatrixServer);
		console.log("#################");

		let valid = validateLoginForm();
		if(valid === true) {
			alert("You are successfully signed in...");
			history.push('/homepage');
		} else {
			setErrors(errors);
			setFormSubmitted(true);
		}
	}

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

				<form onSubmit={login} className="px-3 px-md-5 mx-xl-5">
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
							onChange={handleInputChange} 
						/>

						{ errors.homeserver &&
							<HelpBlock id="helpBlock">{errors.homeserver}</HelpBlock>
						}

						</FormGroup>
						<FormGroup 
							controlId="email" 
							validationState={ 
								formSubmitted ? (errors.email ? 'error' : 'success') : null 
							}
						>

						<ControlLabel id="homeserver1">Username</ControlLabel>

						<FormControl 
							type="text" 
							name="email" 
							placeholder="Enter your username" 
							onChange={handleInputChange} 
						/>

						{ errors.email &&
							<HelpBlock id="helpBlock">{errors.email}</HelpBlock>
						}
					</FormGroup>

					<FormGroup 
						controlId="password" 
						validationState={ 
							formSubmitted ? (errors.password ? 'error' : 'success') : null 
						}
						className="my-2"
					>
						<ControlLabel id="homeserver1">Password</ControlLabel>

						<FormControl 
							type="password" 
							name="password" 
							placeholder="Enter your password" 
							onChange={handleInputChange} 
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


const mapStateToProps = (state) => {
	return {
		profile: state.user.profile
	}
}

export default connect(mapStateToProps)(withRouter(Login));