import React from "react";
import { useParams } from "react-router-dom";
import {
    Row,
    Col,
} from "reactstrap";

import useAuth from "../../hooks/useAuth";
import AddPatient from './AddPatient';
import "../../views/Test.css"

const EditPatient = () => {
    const { auth } = useAuth();
    const { patientId } = useParams();

    if (!auth || !auth.id || !auth.accessToken || !auth.orgid) {
        return (
            <div>
                <p>Error: Missing required authentication information.</p>
            </div>
        );
    }

    const { id: doctorId, accessToken, orgid: orgId } = auth;

    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        <AddPatient
                            isEdit={true}
                            patientId={patientId}
                            doctorId={doctorId}
                            accessToken={accessToken}
                            orgId={orgId}
                        />
                    </Col>
                </Row>
            </div>
        </>
    );


}

export default EditPatient
