import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
} from "reactstrap";

// import useAuth from "../../hooks/useAuth";
import axiosUtil from "../../api/axios";
import "../../views/Test.css"

const appointmentListApiUrl = "/patients/appointments";
const CancelPLToken = axios.CancelToken;

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

const Appointments = ({ doctorId, accessToken, orgId }) => {

    const navigate = useNavigate();

    // const { auth } = useAuth();

    // const doctorId = auth.id;
    // const accessToken = auth.accessToken;

    const handleClick = useCallback(
        (row) => {
            navigate(`/admin/user-page/${row.id}`);
        },
        [navigate] // Dependency array
    );

    const [todaysAppointmentCount, setTodaysAppointmentCount] = useState(0);
    const [appointmentsForToday, setAppointmentsForToday] = useState([]);
    const [totalAppointmentCount, setTotalAppointmentCount] = useState(0);
    const [futureAppointments, setFutureAppointments] = useState(null);
    const [isAppointmentListDataLoading, setIsAppointmentListDataLoading] = useState(true);
    const [appointmenttListDataError, setAppointmentListDataError] = useState(null);

    useEffect(() => {
        const cancelTokenSource = CancelPLToken.source();

        const fetchAppointmentData = async () => {
            try {
                const response = await axiosUtil.get(appointmentListApiUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                    params: {
                        doctorId: doctorId,
                    },
                });

                const appointments = response.data;

                // Get current date in UTC
                const nowUtc = new Date(new Date().toISOString());
                // Adjust for the time zone difference (e.g., for IST, add 5 hours and 30 minutes)
                const timeZoneOffset = 330; // IST is UTC +5:30
                nowUtc.setMinutes(nowUtc.getMinutes() + timeZoneOffset);

                // Format the date in YYYY-MM-DD format
                const adjustedDate = nowUtc.toISOString().split('T')[0];
                const today = new Date(adjustedDate).setHours(0, 0, 0, 0);

                const todayApp = appointments.filter(appointment =>
                    new Date(appointment.appointmentdate).setHours(0, 0, 0, 0) === today
                )
                setAppointmentsForToday(todayApp);

                const futureApp = appointments.filter(appointment =>
                    new Date(appointment.appointmentdate).setHours(0, 0, 0, 0) > today
                )
                setFutureAppointments(futureApp);

                setTodaysAppointmentCount(todayApp.length);
                setTotalAppointmentCount(appointments.length);
                setIsAppointmentListDataLoading(false);

            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    console.error("Error fetching medicines data:", error.message);
                    setAppointmentListDataError(error);
                    setIsAppointmentListDataLoading(false);
                }
            }

        };

        fetchAppointmentData();

        // Clean up the cancel token source when the component unmounts
        return () => {
            cancelTokenSource.cancel("Request canceled by user"); // Cancel the ongoing request
        };
    }, [accessToken, doctorId]);

    if (isAppointmentListDataLoading) {
        return <div>Loading...</div>;
    } else if (appointmenttListDataError) {
        return <div>Error fetching data</div>;
    } else {
        return (
            <>
                <Row className='p-4 d-flex align-items-stretch'>
                    <Col lg="3" md="6" sm="6" className="d-flex">
                        <Card className="card-stats flex-fill" style={{ backgroundColor: "#FBFFFF" }}>
                            <CardBody>
                                <Row>
                                    <Col md="4" xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <img
                                                alt="..."
                                                src={require("assets/img/patientswaiting.jpg")}
                                            />

                                        </div>
                                    </Col>
                                    <Col md="8" xs="7">
                                        <div className="numbers">
                                            <p className="card-category">Today's Appointments</p>
                                            <CardTitle tag="p">{todaysAppointmentCount}</CardTitle>
                                            <p />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <div className="stats">
                                    <i className="fas fa-sync-alt" /> @SMN #1, SMN #2 and SMHC
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" sm="6" className="d-flex">
                        <Card className="card-stats flex-fill" style={{ backgroundColor: "#FBFFFF" }}>
                            <CardBody>
                                <Row>
                                    <Col md="4" xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <img
                                                alt="..."
                                                src={require("assets/img/InPatientsVisits.png")}
                                            />
                                        </div>
                                    </Col>
                                    <Col md="8" xs="7">
                                        <div className="numbers">
                                            <p className="card-category">Patients treated</p>
                                            <CardTitle tag="p">TBDWS</CardTitle>
                                            <p />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <div className="stats">
                                    <i className="far fa-calendar" />@Sri Murhunjaya Healthcare
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" sm="6" className="d-flex">
                        <Card className="card-stats flex-fill" style={{ backgroundColor: "#FBFFFF" }}>
                            <CardBody>
                                <Row>
                                    <Col md="4" xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <img
                                                alt="..."
                                                src={require("assets/img/revenue.webp")}
                                            />
                                        </div>
                                    </Col>
                                    <Col md="8" xs="7">
                                        <div className="numbers">
                                            <p className="card-category">Revenue</p>
                                            <CardTitle tag="p">{totalAppointmentCount}</CardTitle>
                                            <p />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <div className="stats">
                                    <i className="far fa-clock" /> @YOGIATREYA Diagnostic Center
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" sm="6" className="d-flex">
                        <Card className="card-stats flex-fill" style={{ backgroundColor: "#FBFFFF" }}>
                            <CardBody>
                                <Row>
                                    <Col md="4" xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            <img
                                                alt="..."
                                                src={require("assets/img/writingPrescriptions.jpg")}
                                            />
                                        </div>
                                    </Col>
                                    <Col md="8" xs="7">
                                        <div className="numbers">
                                            <p className="card-category">Prescriptions prescribed</p>
                                            <CardTitle tag="p">1000</CardTitle>
                                            <p />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <div className="stats">
                                    <i className="fas fa-sync-alt" /> All hospitals considered
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Today's Appointments</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {appointmentsForToday.length === 0 ? (
                                    <p>No appointments today.</p>
                                ) : (
                                    <ul className="list-unstyled team-members">
                                        {appointmentsForToday.map((item) => (
                                            <li key={item.id} className='mb-2'>
                                                <Row>
                                                    <Col md="1" xs="1">
                                                        <div className="avatar">
                                                            <img
                                                                alt="..."
                                                                className="img-circle img-no-padding img-responsive"
                                                                src={require("assets/img/faces/person.jpg")}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md="3" xs="3">
                                                        {item.patientname} <br />
                                                        <span className="text-muted">
                                                            <small>{item.patientphone}</small>
                                                        </span>
                                                    </Col>
                                                    <Col md="4" xs="4">
                                                        {item.hospitalname}<br />
                                                        <span className="text-muted">
                                                            <small>{formatDate(item.appointmentdate)}{" - "}{item.appointmenttime}</small>
                                                        </span>
                                                    </Col>
                                                    <Col md="2" xs="2">
                                                        {item.status}
                                                    </Col>
                                                    <Col className="text-right" md="2" xs="2">
                                                        <Button
                                                            className="btn-round btn-icon"
                                                            color="success"
                                                            outline
                                                            size="sm"
                                                            onClick={() => handleClick(item)}
                                                            disabled={item.status === "Completed"}
                                                        >
                                                            <i className="fa fa-envelope" />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Future Appointments</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ul className="list-unstyled team-members">
                                    {futureAppointments.map((item) => (
                                        <li key={item.id} className='mb-2'>
                                            <Row>
                                                <Col md="2" xs="2">
                                                    <div className="avatar">
                                                        <img
                                                            alt="..."
                                                            className="img-circle img-no-padding img-responsive"
                                                            src={require("assets/img/faces/person.jpg")} // You might want to dynamically set this as well
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md="4" xs="4">
                                                    {item.patientname} <br />
                                                    <span className="text-muted">
                                                        <small>{item.patientphone}</small>
                                                    </span>
                                                </Col>
                                                <Col md="3" xs="3">
                                                    {item.hospitalname}<br />
                                                    <span className="text-muted">
                                                        <small>{formatDate(item.appointmentdate)}{" - "}{item.appointmenttime}</small>
                                                    </span>
                                                </Col>
                                                <Col className="text-right" md="3" xs="3">
                                                    <Button
                                                        className="btn-round btn-icon"
                                                        color="success"
                                                        outline
                                                        size="sm"
                                                        onClick={() => handleClick(item)}
                                                        disabled={true}
                                                    >
                                                        <i className="fa fa-envelope" />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </li>
                                    ))}
                                </ul>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

export default Appointments;
