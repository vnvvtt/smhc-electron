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

const ExpenseList = ({ isExpenseListDataLoading, expenseListDataError, expenseListData }) => {
    const isSmallDevice = useMediaQuery('(max-width: 768px)');

    const navigate = useNavigate();
    const handleView = useCallback(
        (row) => {
            navigate(`/admin/viewexpense/${row.original.expenseid}`);
        },
        [navigate]
    );
    const handleEdit = useCallback(
        (row) => {
            navigate(`/admin/editpatient/${row.original.id}`);
        },
        [navigate]
    );

    const expenseColumns = React.useMemo(
        () => [
            {
                Header: "Beneficiary Name",
                accessor: "beneficiaryname",
            },
            {
                Header: "Date",
                accessor: "expenseDate",
            },
            {
                Header: "Reason",
                accessor: "expenseReason",
                show: !isSmallDevice,
            },
            {
                Header: "Amount",
                accessor: "expenseAmount",
                show: !isSmallDevice,
            },
            {
                Header: "Payment Mode",
                accessor: "paymentmode",
                show: !isSmallDevice,
            },
            {
                Header: "Entered by",
                accessor: "createdby",
                show: !isSmallDevice,
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <div>
                        {/* <FontAwesomeIcon icon={faEye} onClick={() => handleView(row)} style={{ cursor: 'pointer', marginRight: "10px" }} /> */}
                        {/* <Button className="custom-button btn-round align-items-center justify-content-center" color="primary" onClick={() => handleView(row)}>View</Button> */}
                        {/* <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit(row)} style={{ cursor: 'pointer' }} /> */}
                    </div>
                ),
            },
        ],
        [handleView, isSmallDevice, handleEdit]
    );

    if (isExpenseListDataLoading) {
        return <div>Loading...</div>;
    } else if (expenseListDataError) {
        return <div>Error fetching data</div>;
    } else {
        const visibleColumns = expenseColumns.filter(column => column.show !== false);
        return (
            <Table columns={visibleColumns} data={expenseListData} />
        )
    }
}

export default ExpenseList
