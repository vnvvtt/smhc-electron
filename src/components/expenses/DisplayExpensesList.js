import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// reactstrap components 
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
} from "reactstrap";

import useAuth from "../../hooks/useAuth";
import "../../views/Test.css"
import { fetchAllExpenses } from "../../api/api"
import ExpenseList from 'components/expenses/ExepnseList';

const DisplayExpensesList = () => {
    const { auth } = useAuth();
    const { accessToken } = auth;
    const today = new Date();
    const currentYear = today.getFullYear();
    // Get the current date
    const currentDate = new Date();

    const [expensesData, setExpensesData] = useState([]);
    const [expensesDataLoading, setExpensesDataLoading] = useState(true);
    const [expensesDataError, setExpensesDataError] = useState("");

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/admin/addnewexpense/`);
    };

    useEffect(() => {

        const fetchExpenses = async () => {
            try {
                const expenses = await fetchAllExpenses(accessToken);
                setExpensesData(expenses);
                setExpensesDataLoading(false);
                setExpensesDataError("");
            } catch (error) {
                setExpensesData([]);
                setExpensesDataLoading(false);
                setExpensesDataError(error);
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                }
            }
        };

        fetchExpenses();

    }, [accessToken, currentYear]);

    return (
        <>
            <div className='content'>
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <Row>
                                    <Col>
                                        <CardTitle tag="h4">List of Expenses</CardTitle>
                                    </Col>
                                    <Col className="text-right">
                                        <Button color="primary" className='float-end' onClick={handleClick}>Add Expense</Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {expensesDataLoading && expensesData ? (
                                    <p>Loading...</p>
                                ) : (
                                    <ExpenseList
                                        isExpenseListDataLoading={expensesDataLoading}
                                        expenseListDataError={expensesDataError}
                                        expenseListData={expensesData}
                                    />
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default DisplayExpensesList
