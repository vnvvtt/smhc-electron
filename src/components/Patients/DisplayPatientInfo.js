import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CardText,
    Row,
    Col,
} from "reactstrap";

import axiosUtil from "../../api/axios";

const CancelPLToken = axios.CancelToken;

const DisplayPatientInfo = ({ doctorId, patientId, accessToken }) => {

    const patientDataApiUrl = "/patients/patientdata";

    const [patientData, setPatientData] = useState([]);
    const [isPatientDataLoading, setIsPatientDataLoading] = useState(true);
    const [patientDataError, setPatientDataError] = useState(null);

    useEffect(() => {
        const cancelTokenSource = CancelPLToken.source();

        const fetchPatientData = async () => {
            try {
                const response = await axiosUtil.get(patientDataApiUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                    params: {
                        patientId: patientId,
                        doctorId: doctorId,
                    },
                    cancelToken: cancelTokenSource.token,
                });
                console.log("response.data=", response.data);
                setPatientData(response.data);
                setIsPatientDataLoading(false);

            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    console.error("Error fetching patient data:", error);
                    setPatientDataError(error);
                    setIsPatientDataLoading(false);
                }
            }
        };

        fetchPatientData();

        // Clean up the cancel token source when the component unmounts
        return () => {
            cancelTokenSource.cancel("Request canceled by user"); // Cancel the ongoing request
        };
    }, [accessToken, patientId, doctorId]);

    if (isPatientDataLoading) {
        return <div>Loading...</div>;
    } else if (patientDataError) {
        return <div>Error fetching data</div>;
    } else {

        return (
            <>
                <Row>
                    <Col md="6">
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col xs="3">
                                        {/* Assuming you have an avatar image for the patient */}
                                        <img src={require("assets/img/default-avatar.png")} alt="Patient" style={{ width: '100%' }} />
                                    </Col>
                                    <Col xs="9">
                                        <CardTitle tag="h5">
                                            {patientData[0].firstname +
                                                " " +
                                                patientData[0].lastname} {" - ("}{patientData[0].patientid}{")"}
                                        </CardTitle>
                                        <CardText>
                                            <strong>Age:</strong> {patientData[0].age}<br />
                                            <strong>Gender:</strong> {patientData[0].gender}
                                        </CardText>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Patients Reports</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ul className="list-unstyled team-members">
                                    <li>
                                        <Row>
                                            <Col md="2" xs="2">
                                                <div className="avatar">
                                                    <img
                                                        alt="..."
                                                        className="img-circle img-no-padding img-responsive"
                                                        src={require("assets/img/logo-small.png")}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md="7" xs="7">
                                                Blood Report <br />
                                                <span className="text-muted">
                                                    <small>09/10/2023</small>
                                                </span>
                                            </Col>
                                            <Col className="text-right" md="3" xs="3">
                                                <Button
                                                    className="btn-round btn-icon"
                                                    color="success"
                                                    outline
                                                    size="sm"
                                                >
                                                    <i className="fa fa-envelope" />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </li>
                                    <li>
                                        <Row>
                                            <Col md="2" xs="2">
                                                <div className="avatar">
                                                    <img
                                                        alt="..."
                                                        className="img-circle img-no-padding img-responsive"
                                                        src={require("assets/img/logo-small.png")}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md="7" xs="7">
                                                CT Scan <br />
                                                <span className="text-success">
                                                    <small>01/09/2023</small>
                                                </span>
                                            </Col>
                                            <Col className="text-right" md="3" xs="3">
                                                <Button
                                                    className="btn-round btn-icon"
                                                    color="success"
                                                    outline
                                                    size="sm"
                                                >
                                                    <i className="fa fa-envelope" />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </li>
                                    <li>
                                        <Row>
                                            <Col md="2" xs="2">
                                                <div className="avatar">
                                                    <img
                                                        alt="..."
                                                        className="img-circle img-no-padding img-responsive"
                                                        src={require("assets/img/logo-small.png")}
                                                    />
                                                </div>
                                            </Col>
                                            <Col className="col-ms-7" xs="7">
                                                Urine Analysis <br />
                                                <span className="text-danger">
                                                    <small>09/10/2023</small>
                                                </span>
                                            </Col>
                                            <Col className="text-right" md="3" xs="3">
                                                <Button
                                                    className="btn-round btn-icon"
                                                    color="success"
                                                    outline
                                                    size="sm"
                                                >
                                                    <i className="fa fa-envelope" />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </li>
                                </ul>
                            </CardBody>
                        </Card>

                    </Col>
                </Row>
            </>
        )
    }

}

export default DisplayPatientInfo
