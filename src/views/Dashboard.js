import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  Row,
  Col,
  Button,
} from "reactstrap";

import useAuth from "../hooks/useAuth";
import AddPatient from 'components/Patients/AddPatient';
import "../views/Test.css"
import PatientList from 'components/Patients/PatientList';
import { fetchAppointmentsList } from "../api/api"
import DisplayCards from 'components/Misc/DisplayCards';
import patientswaitingImage from '../assets/img/patientswaiting.jpg'
import inPatientsVisitImage from '../assets/img/InPatientsVisits.png'
import revenueImage from '../assets/img/revenue.webp'
import writingPrescriptionsImage from '../assets/img/writingPrescriptions.jpg'
import AppointmentList from 'components/Misc/AppointmentList';

const Dashboard = () => {
  const { auth } = useAuth();
  const { id: doctorId, accessToken, orgid: orgId } = auth;

  const [todaysAppointmentCount, setTodaysAppointmentCount] = useState(0);
  const [appointmentsForToday, setAppointmentsForToday] = useState([]);
  const [todaysAppointmentsListError, setTodaysAppointmentsListError] = useState("");

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/admin/addpatient/`);
  };

  useEffect(() => {

    const fetchAppointments = async () => {
      try {
        const appointments = await fetchAppointmentsList(doctorId, accessToken);
        setTodaysAppointmentsListError("");
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
        setTodaysAppointmentCount(todayApp.length);

      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          setTodaysAppointmentsListError(error);
        }
      }
    };

    fetchAppointments();

  }, [accessToken, doctorId]);

  return (
    <>
      <div className="content">
        <Row className='p-4 d-flex align-items-stretch'>
          <Col lg="3" md="6" sm="6" className="d-flex">
            <DisplayCards
              cardTitle="Today's Appointments"
              cardMessage={todaysAppointmentCount}
              footerMessage="All hospitals considered"
              cardBackGroundColor="#ffffff"
              cardImage={patientswaitingImage}
            />
          </Col>
          <Col lg="3" md="6" sm="6" className="d-flex">
            <DisplayCards
              cardTitle="Patients treated"
              cardMessage={todaysAppointmentCount}
              footerMessage="All hospitals considered"
              cardBackGroundColor="#ffffff"
              cardImage={inPatientsVisitImage}
            />
          </Col>
          <Col lg="3" md="6" sm="6" className="d-flex">
            <DisplayCards
              cardTitle="Revenue"
              cardMessage={todaysAppointmentCount}
              footerMessage="All hospitals considered"
              cardBackGroundColor="#ffffff"
              cardImage={revenueImage}
            />
          </Col>
          <Col lg="3" md="6" sm="6" className="d-flex">
            <DisplayCards
              cardTitle="Prescriptions prescribed"
              cardMessage={todaysAppointmentCount}
              footerMessage="All hospitals considered"
              cardBackGroundColor="#ffffff"
              cardImage={writingPrescriptionsImage}
            />
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col>
                    <CardTitle tag="h4">Patient's List</CardTitle>
                  </Col>
                  <Col className="text-right">
                    <Button color="primary" className='float-end' onClick={handleClick}>Add Patient</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <PatientList
                  doctorId={doctorId}
                  accessToken={accessToken}
                  orgId={orgId}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <AppointmentList
              appointmentsForToday={appointmentsForToday}
            />
          </Col>
        </Row>
      </div>
    </>
  );


}

export default Dashboard;

