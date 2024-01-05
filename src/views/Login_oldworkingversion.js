import React from 'react'
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Form,
    Input,
    Row,
    Col,
    Label,
    FormGroup,
} from "reactstrap";
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

const Login = () => {
    const navigate = useNavigate();

    const { setAuth, persist, setPersist } = useAuth();

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // const [organizationName, setOrganizationName] = useState("");
    // const [organizationTagLine, setOrganizationTagLine] = useState("");
    // const [organizationLogoPath, setOrganizationLogoPath] = useState("");

    // useEffect(() => {
    //     // Fetch organization details
    // }, []);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [email, pwd]);

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
        const errMsg = checkLoginData(email, pwd);
        if (!checkForEmptyString(errMsg)) {
            setErrMsg(errMsg);
            setIsLoading(false);
            return;
        }
        setErrMsg("");
        try {
            await checkUser.mutateAsync({ userName: email, passWord: pwd });
        } catch (err) {
            errorHandling(err);
        }
    };

    return (
        <>
            <div className="content">
                <Row>
                    <Col md="3"></Col>
                    <Col md="6">
                        <Card className="card-user">
                            <div className="image">
                                <img alt="..." src={require("assets/img/smhc-hospital.png")} />
                            </div>
                            <CardBody>
                                <div className="author">
                                    <img
                                        alt="..."
                                        className="avatar border-gray"
                                        src={require("assets/img/smnh-logo_400x393.png")}
                                    />
                                    <h5 className="title">Sri Mruthunjaya Heathcare</h5>
                                    <h6 className="title">A Hospital That Cares</h6>
                                </div>
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
                                        <Col className="pr-1" md="12">
                                            <FormGroup>
                                                <Label for="emailInput" id="emailLabel" className="form-label">
                                                    Email
                                                </Label>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    id="emailInput"
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
                                                <Label for="passwordInput" id="passwordLabel" className="form-label">
                                                    Password
                                                </Label>
                                                <Input
                                                    type="password"
                                                    name="password"
                                                    id="passwordInput"
                                                    placeholder="Enter your password"
                                                    autoComplete="off"
                                                    onChange={(e) => setPwd(e.target.value)}
                                                    value={pwd}
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
                                            {/* <Label check>
                                                Remember me
                                            </Label> */}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12">
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

                            </CardBody>
                            <CardFooter>
                            </CardFooter>
                        </Card>

                    </Col>
                    <Col md="3"></Col>
                </Row>
            </div>
        </>
    );
}

export default Login
