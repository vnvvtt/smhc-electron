import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import Table from "../../components/RTDataTable";

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

const BillingList = ({ isBillListDataLoading, billListDataError, billListData, dataType }) => {
    const isSmallDevice = useMediaQuery('(max-width: 768px)');

    const navigate = useNavigate();
    const handleView = useCallback(
        (row) => {
            navigate(`/admin/generatebill/${row.original.id}`);
        },
        [navigate]
    );
    const handleEdit = useCallback(
        (row) => {
            navigate(`/admin/editpatient/${row.original.id}`);
        },
        [navigate]
    );

    let billColumnsDefinition = [
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: "Referral Doctor",
            accessor: "referral_doc_name",
        },
        {
            Header: "Referral Hospital",
            accessor: "hospital_name",
            show: !isSmallDevice,
        },
        {
            Header: "Net Amount",
            accessor: "net_amount",
            show: !isSmallDevice,
        },
        {
            Header: "Bill Date",
            accessor: "billdate",
            show: !isSmallDevice,
        },
        {
            Header: "Paid?",
            accessor: "paid",
            show: !isSmallDevice,
            Cell: ({ value }) => (
                <span style={{ color: value === 1 ? 'green' : 'red' }}>
                    {value === 1 ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            Header: "Action",
            accessor: "action",
            Cell: ({ row }) => (
                <div>
                    <FontAwesomeIcon icon={faEye} onClick={() => handleView(row)} style={{ cursor: 'pointer', marginRight: "10px" }} />
                    {/* <Button className="custom-button btn-round align-items-center justify-content-center" color="primary" onClick={() => handleView(row)}>View</Button> */}
                    {/* <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit(row)} style={{ cursor: 'pointer' }} /> */}
                </div>
            ),
        },
    ];
    const billColumns = React.useMemo(() => billColumnsDefinition, [billColumnsDefinition, handleView, isSmallDevice, handleEdit]);

    // const billColumns = React.useMemo(
    //     () => [
    //         {
    //             Header: "Name",
    //             accessor: "name",
    //         },
    //         {
    //             Header: "Referral Doctor",
    //             accessor: "referral_doc_name",
    //         },
    //         {
    //             Header: "Referral Hospital",
    //             accessor: "hospital_name",
    //             show: !isSmallDevice,
    //         },
    //         {
    //             Header: "Net Amount",
    //             accessor: "net_amount",
    //             show: !isSmallDevice,
    //         },
    //         {
    //             Header: "Bill Date",
    //             accessor: "billdate",
    //             show: !isSmallDevice,
    //         },
    //         {
    //             Header: "Paid?",
    //             accessor: "paid",
    //             show: !isSmallDevice,
    //             Cell: ({ value }) => (
    //                 <span style={{ color: value === 1 ? 'green' : 'red' }}>
    //                     {value === 1 ? 'Yes' : 'No'}
    //                 </span>
    //             ),
    //         },
    //         {
    //             Header: "Action",
    //             accessor: "action",
    //             Cell: ({ row }) => (
    //                 <div>
    //                     <FontAwesomeIcon icon={faEye} onClick={() => handleView(row)} style={{ cursor: 'pointer', marginRight: "10px" }} />
    //                     {/* <Button className="custom-button btn-round align-items-center justify-content-center" color="primary" onClick={() => handleView(row)}>View</Button> */}
    //                     {/* <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit(row)} style={{ cursor: 'pointer' }} /> */}
    //                 </div>
    //             ),
    //         },
    //     ],
    //     [handleView, isSmallDevice, handleEdit]
    // );

    if (isBillListDataLoading) {
        return <div>Loading...</div>;
    } else if (billListDataError) {
        return <div>Error fetching data</div>;
    } else {
        const visibleColumns = billColumns.filter(column => column.show !== false);
        return (
            <Table columns={visibleColumns} data={billListData} />
        )
    }
}

export default BillingList
