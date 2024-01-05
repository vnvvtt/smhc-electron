import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Button,
} from "reactstrap";

import axiosUtil from "../../api/axios";
import Table from "../../components/RTDataTable";
import useAuth from "../../hooks/useAuth";
import "../../views/Test.css"

const CancelPLToken = axios.CancelToken;

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

const PrescriptionList = ({ patientId }) => {
    const prescriptionDataApiUrl = "/prescriptions";
    const isSmallDevice = useMediaQuery('(max-width: 768px)');
    const { auth } = useAuth();

    const doctorId = auth.id;
    const bearerToken = auth.accessToken;

    const navigate = useNavigate();
    const handleView = useCallback(
        (row) => {
            navigate(`/admin/generatepdf/${row.original.prescription_id}/${patientId}`);
        },
        [navigate, patientId]
    );

    const prescriptionDataColumns = React.useMemo(
        () => [
            {
                Header: "Id",
                accessor: "prescription_id",
            },
            {
                Header: "Date",
                accessor: "createddate",
            },
            {
                Header: "Complaints",
                accessor: "complaints",
            },
            {
                Header: "Examination",
                accessor: "examination",
                show: !isSmallDevice,
            },
            {
                Header: "Diagnosis",
                accessor: "diagnosis",
                show: !isSmallDevice,
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <div>
                        <Button className="custom-button btn-round align-items-center justify-content-center" color="primary" onClick={() => handleView(row)}>Generate</Button>
                    </div>
                ),
            },
        ],
        [handleView, isSmallDevice]
    );

    const [prescriptionData, setPrescriptionData] = useState([]);
    const [isPrescriptionDataLoading, setIsPrescriptionDataLoading] = useState(true);
    const [prescriptionDataError, setPrescriptionDataError] = useState(null);

    useEffect(() => {
        const cancelTokenSource = CancelPLToken.source();

        const fetchPrescriptionListData = async () => {
            try {
                const response = await axiosUtil.get(prescriptionDataApiUrl, {

                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                    params: {
                        patientId: patientId,
                        doctorId: doctorId,
                    },
                    cancelToken: cancelTokenSource.token,
                });
                setPrescriptionData(response.data);
                setIsPrescriptionDataLoading(false);

            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    console.error("Error fetching medicines data:", error);
                    setPrescriptionDataError(error);
                    setIsPrescriptionDataLoading(false);
                }
            }
        };

        fetchPrescriptionListData();

        // Clean up the cancel token source when the component unmounts
        return () => {
            cancelTokenSource.cancel("Request canceled by user"); // Cancel the ongoing request
        };
    }, [bearerToken, patientId, doctorId]);

    if (isPrescriptionDataLoading) {
        return <div>Loading...</div>;
    } else if (prescriptionDataError) {
        return <div>Error fetching data</div>;
    } else {
        const visibleColumns = prescriptionDataColumns.filter(column => column.show !== false);
        return (
            <Table columns={visibleColumns} data={prescriptionData} />
        )
    }
}

export default PrescriptionList
