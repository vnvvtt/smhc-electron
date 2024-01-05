import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import {
    Input,
    Label,
    Button,
    Form,
    Row,
    Col,
    FormGroup,
} from "reactstrap";

import './Login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../hooks/useAuth";
import axiosUtils from "../api/axios";
import {
    checkLoginData,
    checkForEmptyString,
} from "../components/Validations";

const apiUrl = process.env.REACT_APP_AUTH_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

function Login() {
    const navigate = useNavigate();

    const { setAuth, persist, setPersist } = useAuth();

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [email, password]);

    const togglePersist = () => {
        setPersist((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist]);

    const errorHandling = (errMsg) => {
        if (!errMsg?.response) {
            setErrMsg("$2 - No Server Response");
        } else if (errMsg.response?.status === 400) {
            setErrMsg("Missing Username or Password");
        } else if (errMsg.response?.status === 401) {
            setErrMsg("Unauthorized");
            console.log("error message")
        } else {
            setErrMsg("Login Failed");
        }
        errRef.current.focus();
    };

    const cancelTokenSource = axios.CancelToken.source();

    const checkUser = useMutation(
        async (loginData) => {
            const response = await axiosUtils.post(
                apiUrl,
                JSON.stringify(loginData),
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`,
                    },
                    withCredentials: true,
                    cancelToken: cancelTokenSource.token,
                }
            );

            return response;
        },
        {
            onSuccess: (responseData) => {
                const data = responseData.data;
                const accessToken = data?.accessToken;
                const id = data?.id;
                const name = data?.name;
                const age = data?.age;
                const title = data?.title;
                const roles = data?.roles;
                const salutation = data?.salutation;
                const roleid = data?.roleid;
                const orgid = data?.orgid;
                const specialization = data?.specialization;
                const branchid = data?.branchid;
                setAuth({
                    email,
                    id,
                    name,
                    age,
                    title,
                    roles,
                    salutation,
                    roleid,
                    orgid,
                    specialization,
                    branchid,
                    accessToken,
                });

                setIsLoading(false);
                if (roleid === 3) {
                    navigate("/dashboard", { replace: true });
                } else if (roleid === 6) {
                    navigate("/userdashboard", { replace: true });
                } else {
                    navigate("/dashboard", { replace: true });
                }
            },
            onError: (err) => {
                setIsLoading(false);
                errorHandling(err);
            },
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const errMsg = checkLoginData(email, password);
        if (!checkForEmptyString(errMsg)) {
            setErrMsg(errMsg);
            setIsLoading(false);
            return;
        }
        setErrMsg("");
        try {
            await checkUser.mutateAsync({ userName: email, passWord: password });
        } catch (err) {
            errorHandling(err);
        }
    };

    return (
        <div className='login'>
            <Link to='/'>
                <img
                    className="login__logo"
                    src={require("assets/img/ydc_logo.jpg")}
                    alt="YDC"
                />
            </Link>

            <div className='login__container'>
                <h1>Sign-in</h1>

                <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                    style={{ color: "red" }}
                >
                    {errMsg}
                </p>
                <Form id="loginForm" onSubmit={handleSubmit}>
                    <Row>
                        <Col md="12">
                            <FormGroup>
                                <Label htmlFor='email' id="emailLabel" className="form-label">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter your registered email"
                                    autoFocus
                                    ref={userRef}
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <FormGroup>
                                <Label htmlFor='password' id="passwordLabel" className="form-label">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    autoComplete="off"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <Input
                                type="checkbox"
                                name="remember"
                                id="persist"
                                size="small"
                                sx={{ padding: 0 }}
                                onChange={togglePersist}
                                checked={persist}
                            />
                            {' '}
                            <Label check for="persist" id="rememberLabel" className="form-check-label">Remember me</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" className="d-flex justify-content-center">
                            <Button
                                className="btn-round align-items-center justify-content-center btn btn-primary" aria-live="polite" type="submit"
                            >
                                {isLoading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin />
                                        Please wait...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <p className='title'>
                    By signing-in you agree to the Yogiatreya Diagnostic (P) Limited Terms & Conditions of use.
                </p>

                <button disabled className='login__registerButton'><strong>YOGIATREYA DIAGNOSTIC CENTER</strong><br />Precision is our priority</button>
            </div>
        </div>
    )
}

export default Login
