import React from "react";
import {
    Row,
    Col,
} from "reactstrap";

import useAuth from "../../hooks/useAuth";
import AddPatient from './AddPatient';
import "../../views/Test.css"

const AddNewPatient = () => {
    const { auth } = useAuth();

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
                            isEdit={false}
                            patientId={0}
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

export default AddNewPatient
