import React from "react";

import useAuth from "../../hooks/useAuth";
import DisplayPatientInfo from './DisplayPatientInfo';

const DisplayPatientData = ({ patientId }) => {
    const { auth } = useAuth();

    if (!auth || !auth.id || !auth.accessToken) {
        return (
            <div>
                <p>Error: Missing required authentication information.</p>
            </div>
        );
    }

    const doctorId = auth.id;
    const accessToken = auth.accessToken;

    return (
        <DisplayPatientInfo doctorId={doctorId} patientId={patientId} accessToken={accessToken} />
    );

}

export default DisplayPatientData
