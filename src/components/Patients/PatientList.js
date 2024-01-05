import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import Table from "../../components/RTDataTable";
import { fetchPatientsList } from '../../api/api';

const useMediaQuery = (query) => {
    const [matches, setMatches] = React.useState(window.matchMedia(query).matches);

    React.useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const documentChangeHandler = (event) => setMatches(event.matches);

        // Add event listener
        mediaQueryList.addEventListener('change', documentChangeHandler);

        // Clean up
        return () => {
            // Remove event listener
            mediaQueryList.removeEventListener('change', documentChangeHandler);
        };
    }, [query]);

    return matches;
};

const PatientList = ({ doctorId, accessToken, orgId }) => {
    const isSmallDevice = useMediaQuery('(max-width: 768px)');
    // const { auth } = useAuth();

    // const doctorId = auth.id;
    // const accessToken = auth.accessToken;

    const navigate = useNavigate();
    const handleView = useCallback(
        (row) => {
            navigate(`/admin/user-page/${row.original.id}`);
        },
        [navigate]
    );
    const handleEdit = useCallback(
        (row) => {
            navigate(`/admin/editpatient/${row.original.id}`);
        },
        [navigate]
    );

    const patientColumns = React.useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Patient Id",
                accessor: "patientid",
            },
            {
                Header: "Phone",
                accessor: "phone",
                show: !isSmallDevice,
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <div>
                        <FontAwesomeIcon icon={faEye} onClick={() => handleView(row)} style={{ cursor: 'pointer', marginRight: "10px" }} />
                        {/* <Button className="custom-button btn-round align-items-center justify-content-center" color="primary" onClick={() => handleView(row)}>View</Button> */}
                        <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit(row)} style={{ cursor: 'pointer' }} />
                    </div>
                ),
            },
        ],
        [handleView, isSmallDevice, handleEdit]
    );

    const [patientListData, setPatientListData] = useState([]);
    const [isPatientListDataLoading, setIsPatientListDataLoading] = useState(true);
    const [patientListDataError, setPatientListDataError] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const data = await fetchPatientsList({ doctorId, accessToken });
                setPatientListData(data);
                setIsPatientListDataLoading(false);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    setPatientListDataError(error);
                    setIsPatientListDataLoading(false);
                }
            }
        };

        fetchData();

    }, [accessToken, doctorId]);

    if (isPatientListDataLoading) {
        return <div>Loading...</div>;
    } else if (patientListDataError) {
        return <div>Error fetching data</div>;
    } else {
        const visibleColumns = patientColumns.filter(column => column.show !== false);
        return (
            <Table columns={visibleColumns} data={patientListData} />
        )
    }
}

export default PatientList
