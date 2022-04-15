import React, { Component } from 'react';
import { withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import { ActionCreators } from '../actions/profile'; 
import { getStore } from '../utils'; 
import './style.css';
import { Row, FormGroup, FormControl, ControlLabel, Button, HelpBlock, Label } from 'react-bootstrap'; 
// import { isEmail, isEmpty, isLength, isContainWhiteSpace, isHomeServer } from '../shared/validator';
import { isEmail, isEmpty, isLength, isContainWhiteSpace, isHomeServer } from '../Home';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import MainImage from '../security-camera.png';

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
      this.props.history.push('/home')
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
    this.props.history.push('/home')
  }

  render() {
    const { errors, formSubmitted } = this.state;
    return (
      <div className="Login">
      <Row>
          <figure id="mainImg">
            <img src={MainImage} alt="MainImg" width={100} height={100}/>
            <figcaption id= "figcaption">Open-Camera</figcaption>
          </figure>
          <h1 id="header">Sign-In</h1>
          <form onSubmit={this.login}>
              <FormGroup controlId="homeserver" validationState={ formSubmitted ? (errors.homeserver ? 'error' : 'success') : null }>
                  <ControlLabel id="homeserver1">Home Server</ControlLabel>
                  <FormControl type="text" name="homeserver" placeholder="Enter your homeserver" onChange={this.handleInputChange} />
              { errors.homeserver &&
                  <HelpBlock id="helpBlock">{errors.homeserver}</HelpBlock>
              }
              </FormGroup>
              <FormGroup controlId="email" validationState={ this.formSubmitted ? (errors.email ? 'error' : 'success') : null }>
                  <ControlLabel id="homeserver1">Username</ControlLabel>
                  <FormControl type="text" name="email" placeholder="Enter your username" onChange={this.handleInputChange} />
              { errors.email &&
                  <HelpBlock id="helpBlock">{errors.email}</HelpBlock>
              }
              </FormGroup>
              <FormGroup controlId="password" validationState={ this.formSubmitted ? (errors.password ? 'error' : 'success') : null }>
                  <ControlLabel id="homeserver1">Password</ControlLabel>
                  <FormControl type="password" name="password" placeholder="Enter your password" onChange={this.handleInputChange} />
              { errors.password &&
                  <HelpBlock id="helpBlock">{errors.password}</HelpBlock>
              }
              </FormGroup>
              <Button id="button" type="submit" bsStyle="primary" >Sign-In</Button>
              <FormGroup>
              <ControlLabel>Don't have an account?</ControlLabel>
                <Label id="sign_up"> Register </Label>
              </FormGroup>
          </form>
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