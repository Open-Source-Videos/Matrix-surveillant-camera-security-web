import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
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
    Image,
} from 'react-bootstrap';
import { isEmpty, isLength, isContainWhiteSpace } from '../../pages/Homepage';
import 'bootstrap/dist/css/bootstrap.min.css';
import useMatrixClient from '../../hooks/useMatrixClient';

export const Login = () => {
    const [formData, setFormData] = useState({
        homeserver: 'https://matrix.pdxinfosec.org',
        email: '@test003:pdxinfosec.org',
        password: 'G3Vsnzvr',
    });
    const [errors, setErrors] = useState({});
    const [problem, setProblem] = useState(false);

    const [formSubmitted, setFormSubmitted] = useState(false);
    const history = useHistory();
    const {
       
        setOnLogInResult,
        loginMatrixServer,
       
        testLogin,
    } = useMatrixClient();

    useEffect(() => {
        setOnLogInResult(handleLoginResult);

        (async () => {
            console.log('Test login');
            await testLogin();
        })();

    }, []);

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        formData[name] = value;
        setFormData(formData);
    };

    const validateLoginForm = (e) => {
        if (isEmpty(formData.homeserver)) {
            errors.homeserver = "Homeserver can't be blank";
        }

        if (isEmpty(formData.email)) {
            errors.email = "Email can't be blank";
        }

        if (isEmpty(formData.password)) {
            errors.password = "Password can't be blank";
        } else if (isContainWhiteSpace(formData.password)) {
            errors.password = 'Password should not contain white spaces';
        } else if (
            !isLength(formData.password, { gte: 6, lte: 16, trim: true })
        ) {
            errors.password = "Password's length must between 6 to 16";
        }

        if (isEmpty(errors)) {
            //setHomeServer(formData.homeserver);
            return true;
        } else {
            return errors;
        }
    };

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

        if (_isLogin) {
            // if (exportedDevice && accessToken) {
            // 	localStorage.setItem("matrix_account", JSON.stringify({exportedDevice,accessToken, homeServer: formData.homeserver}));
            // 	(async()=>{

            // 		//@test007:pdxinfosec.org To Test
            // 		let profileAvatar = await getAvatar(exportedDevice.userId)
            // 		console.log("profileAvatar", profileAvatar)
            // 	})();

            // }
            history.push('/room');
        } else {
            alert('Failed to sign in...');
        }
    };

    const login = async (e) => {
        e.preventDefault();

        let valid = validateLoginForm();

        if (valid === true) {
            console.log('Here', valid);
            setOnLogInResult(handleLoginResult);
            await loginMatrixServer(
                formData.homeserver,
                formData.email,
                formData.password
            );
        } else {
            setErrors(errors);
            setFormSubmitted(true);
        }
    };

    
    return (
        <div className="bg-white m-4 rounded">
            <Row>
                <Col xs={12} lg={6} className="d-none d-lg-block">
                    <Image src={'Mobile login-cuate.svg'} alt="login" />
                </Col>
                <Col xs={12} lg={6} className="Login my-auto">
                    <figure id="mainImg" className="my-auto">
                        <img
                            src={'security-camera.png'}
                            alt="MainImg"
                            width={70}
                            height={70}
                        />
                        <figcaption id="figcaption text-lg">
                            OpenCamera
                        </figcaption>
                    </figure>

                    <h1 className="text-xxl fw-bold text-center py-3">Login</h1>

                    <form onSubmit={login} className="px-3 px-md-5 mx-xl-5">
                        <FormGroup
                            controlId="homeserver"
                            validationState={
                                formSubmitted
                                    ? errors.homeserver
                                        ? 'error'
                                        : 'success'
                                    : null
                            }
                            className="my-2"
                        >
                            <ControlLabel id="homeserver1">
                                Home server
                            </ControlLabel>

                            <FormControl
                                type="text"
                                name="homeserver"
                                placeholder="Enter your homeserver"
                                onChange={handleInputChange}
                                defaultValue={'https://matrix.pdxinfosec.org'}
                            />

                            {errors.homeserver && (
                                <HelpBlock id="helpBlock">
                                    {errors.homeserver}
                                </HelpBlock>
                            )}
                        </FormGroup>
                        <FormGroup
                            controlId="email"
                            validationState={
                                formSubmitted
                                    ? errors.email
                                        ? 'error'
                                        : 'success'
                                    : null
                            }
                        >
                            <ControlLabel id="homeserver1">
                                Username
                            </ControlLabel>

                            <FormControl
                                type="text"
                                name="email"
                                placeholder="Enter your username"
                                onChange={handleInputChange}
                                defaultValue={'@test003:pdxinfosec.org'}
                            />

                            {errors.email && (
                                <HelpBlock id="helpBlock">
                                    {errors.email}
                                </HelpBlock>
                            )}
                        </FormGroup>

                        <FormGroup
                            controlId="password"
                            validationState={
                                formSubmitted
                                    ? errors.password
                                        ? 'error'
                                        : 'success'
                                    : null
                            }
                            className="my-2"
                        >
                            <ControlLabel id="homeserver1">
                                Password
                            </ControlLabel>

                            <FormControl
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                onChange={handleInputChange}
                                defaultValue={'G3Vsnzvr'}
                            />
                            {errors.password && (
                                <HelpBlock id="helpBlock">
                                    {errors.password}
                                </HelpBlock>
                            )}
                        </FormGroup>

                        <div className="text-center">
                            {/* <Button
                                id="button"
                                type="submit"
                                bsStyle="primary"
                                className="border border-dark"
                            >
                                Login
                            </Button> */}
                            <button className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 pt-4 mt-4 overflow-hidden font-semibold text-yellow-400 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group"
                                    id="button2"
                                    type="submit">

                                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-yellow-400 group-hover:h-full"></span>
                                <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </span>
                                <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </span>
                                <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Login</span>
                            </button>
                        </div>

                        <FormGroup className="pt-4 text-center my-2">
                            <ControlLabel>Don't have an account?</ControlLabel>
                            <Button
                                id="sign_up"
                                title="Sign_up"
                                className="text-decoration-none text-sm ps-2"
                                onClick={() =>
                                    (window.location.href =
                                        'https://element.pdxinfosec.org/#/register')
                                }
                            >
                                Sign-up here!
                            </Button>
                            <div className="text-decoration-none text-sm ps-2">
                                <button className="h-1/2 relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-yellow-400 border-2 border-yellow-300 rounded-full hover:text-white group hover:bg-gray-50"
                                        type="button"
                                        onClick={() => {
                                            localStorage.clear();
                                            setProblem(true);
                                            
                                        }}>
                                    <span className="absolute left-0 block w-full h-0 transition-all bg-yellow-400 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>   
                                    <span className="relative">Having Problem</span>
                                </button>
                            </div>
                            {problem ? (
                                <>                                
                                 <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                        {/*content*/}
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"> 
                                        <div className="py-3 px-5 mb-4 bg-green-100 text-green-900 text-sm rounded-md border border-green-200 flex items-center" role="alert">
                                            <div className="w-4 mr-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                </svg>
                                            </div>
                                            <span>
                                                Your problem <strong>have been solve </strong> <br/>
                                                Please <strong>login again!!!</strong> 
                                            </span>
                                            
                                        </div>   
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase pb-4 text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setProblem(false)}
                                            >
                                            Close
                                        </button>                                                           
                                    </div>
                                 </div>
                                 </div>                                                                                                  
                                </>
                            ): null}

                
                        </FormGroup>
                    </form>
                </Col>
            </Row>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
    };
};

export default connect(mapStateToProps)(withRouter(Login));
