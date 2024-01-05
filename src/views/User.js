import React from "react";
import { useParams } from "react-router-dom";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

import "../views/Test.css";
import AddPrescription from 'components/Prescription/AddPrescription';
import DisplayPatientData from 'components/Patients/DisplayPatientData';
import PrescriptionList from 'components/Prescription/PrescriptionList';

function User() {

  const { patientId } = useParams();

  return (
    <>
      <div className="content">
        <Row className='p-4'>
          <Col md="12">
            <DisplayPatientData patientId={patientId} />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <AddPrescription patientId={patientId} />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card className="card-user">
              <CardHeader>
                <CardTitle tag="h5">Prescription List</CardTitle>
              </CardHeader>
              <CardBody>
                <PrescriptionList patientId={patientId} />
              </CardBody>
            </Card>

          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
