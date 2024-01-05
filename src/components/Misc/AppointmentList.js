import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

const AppointmentList = ({ appointmentsForToday }) => {

    const navigate = useNavigate();
    const handleClick = useCallback(
        (row) => {
            navigate(`/admin/user-page/${row.id}`);
        },
        [navigate] // Dependency array
    );

    return (
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

    )
}

export default AppointmentList
