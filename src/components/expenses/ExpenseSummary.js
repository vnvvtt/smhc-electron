import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// reactstrap components 
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
    FormGroup,
    Form,
    Input,
} from "reactstrap";

import useAuth from "../../hooks/useAuth";
import "../../views/Test.css"
import { fetchExpenseSummaryForAPeriodFromAPI } from "../../api/api"
import BillingList from 'components/billing/BillingList';
import ExpenseList from './ExepnseList';

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const ExpenseSummary = () => {
    const { auth } = useAuth();
    const { accessToken } = auth;
    const currentDate = new Date();

    const [startExpenseDate, setStartExpenseDate] = useState(getCurrentDate());
    const [endExpenseDate, setEndExpenseDate] = useState(getCurrentDate());

    const [showExpenseSummaryData, setShowExpenseSummaryData] = useState(false);
    const [summaryExpensesData, setSummaryExpensesData] = useState([]);
    const [summaryExpensesDataLoading, setSummaryExpensesDataLoading] = useState(true);
    const [summaryExpensesDataError, setSummaryExpensesDataError] = useState("");

    const [errors, setErrors] = useState({});

    const handleStartDateChange = (event) => {
        const selectedDate = event.target.value;
        setStartExpenseDate(selectedDate);
    }

    const handleEndDateChange = (event) => {
        const selectedDate = event.target.value;
        setEndExpenseDate(selectedDate);
    }

    const getExpenseSummaryDataFromAPI = async () => {
        try {
            const data = await fetchExpenseSummaryForAPeriodFromAPI(accessToken, startExpenseDate, endExpenseDate);
            setSummaryExpensesData(data);
            setSummaryExpensesDataLoading(false);
            setSummaryExpensesDataError("");
            setShowExpenseSummaryData(true);
        } catch (error) {
            setSummaryExpensesData([]);
            setSummaryExpensesDataLoading(false);
            setSummaryExpensesDataError(error);
            setShowExpenseSummaryData(false);
            if (axios.isCancel(error)) {
                console.log("Request canceled:", error.message);
            }
        }
    };

    const handleExpenseSummary = () => {
        let newErrors = {};
        if (startExpenseDate === "" || endExpenseDate === "") {
            // Handle empty start or end date
            newErrors.startExpenseDate = "Please enter both start and end dates.";
        }

        if (new Date(startExpenseDate) > new Date(endExpenseDate)) {
            // Handle invalid date range
            newErrors.startExpenseDate = "Start Date should be less than or equal to End Date.";
        }

        const currentDate = new Date().toISOString().split('T')[0];
        if (endExpenseDate > currentDate) {
            // Handle end date greater than current date
            newErrors.endExpenseDate = "End Date should be less than or equal to the current date.";
        }
        setErrors(newErrors);
        const isDataValid = Object.values(newErrors).every((error) => !error);
        if (isDataValid) {
            // If all validations pass, fetch data from API
            getExpenseSummaryDataFromAPI();
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle tag="h5">Expense Summary</CardTitle>
                    <p>Enter period for which the Expense list has to be displayed</p>
                </CardHeader>
                <CardBody>
                    <Form>
                        <Row>
                            <Col className="pr-1" md="4">
                                <FormGroup>
                                    <label htmlFor='startExpenseDate' className='addPLabel'>Start Date</label>
                                    <Input
                                        type="date"
                                        id="startExpenseDate"
                                        name="startExpenseDate"
                                        placeholder="Enter start date"
                                        value={startExpenseDate}
                                        autoComplete='off'
                                        onChange={handleStartDateChange}
                                    />
                                    {errors.startExpenseDate && (
                                        <div className="text-danger">{errors.startExpenseDate}</div>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col className="px-1" md="4">
                                <FormGroup>
                                    <label htmlFor='endExpenseDate' className='addPLabel'>End Date</label>
                                    <Input
                                        type="date"
                                        id="endExpenseDate"
                                        name="endExpenseDate"
                                        placeholder="Enter end date"
                                        value={endExpenseDate}
                                        autoComplete='off'
                                        onChange={handleEndDateChange}
                                    />
                                    {errors.endExpenseDate && (
                                        <div className="text-danger">{errors.endExpenseDate}</div>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col className="pl-1" md="4">
                                <div className="update ml-auto mr-auto mt-2">
                                    <FormGroup>
                                        <Button
                                            color="primary"
                                            type="button"
                                            onClick={handleExpenseSummary}
                                        >
                                            Display Expense Summary
                                        </Button>
                                    </FormGroup>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                {showExpenseSummaryData && !summaryExpensesDataLoading && summaryExpensesData ? (
                                    <ExpenseList
                                        isExpenseListDataLoading={summaryExpensesDataLoading}
                                        expenseListDataError={summaryExpensesDataError}
                                        expenseListData={summaryExpensesData}
                                    />

                                ) : (
                                    <p>Choose the Start and End Date</p>
                                )}

                            </Col>
                        </Row>
                    </Form>
                </CardBody>
                <CardFooter>
                </CardFooter>
            </Card>
        </>
    )
}

export default ExpenseSummary
