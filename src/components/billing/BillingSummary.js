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
import { fetchBillingSummaryForAPeriodFromAPI } from "../../api/api"
import BillingList from 'components/billing/BillingList';

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

const BillingSummary = () => {
    const { auth } = useAuth();
    const { accessToken } = auth;
    const currentDate = new Date();

    const [startBillingDate, setStartBillingDate] = useState(getCurrentDate());
    const [endBillingDate, setEndBillingDate] = useState(getCurrentDate());

    const [showBillingSummaryData, setShowBillingSummaryData] = useState(false);
    const [summaryBillsData, setSummaryBillsData] = useState([]);
    const [summaryBillsDataLoading, setSummaryBillsDataLoading] = useState(true);
    const [summaryBillsDataError, setSummaryBillsDataError] = useState("");

    const [errors, setErrors] = useState({});

    const handleStartDateChange = (event) => {
        const selectedDate = event.target.value;
        setStartBillingDate(selectedDate);
    }

    const handleEndDateChange = (event) => {
        const selectedDate = event.target.value;
        setEndBillingDate(selectedDate);
    }

    const getBillingSummaryDataFromAPI = async () => {
        try {
            const data = await fetchBillingSummaryForAPeriodFromAPI(accessToken, startBillingDate, endBillingDate);
            setSummaryBillsData(data);
            setSummaryBillsDataLoading(false);
            setSummaryBillsDataError("");
            setShowBillingSummaryData(true);
        } catch (error) {
            setSummaryBillsData([]);
            setSummaryBillsDataLoading(false);
            setSummaryBillsDataError(error);
            setShowBillingSummaryData(false);
            if (axios.isCancel(error)) {
                console.log("Request canceled:", error.message);
            }
        }
    };

    const handleBillingSummary = () => {
        let newErrors = {};
        if (startBillingDate === "" || endBillingDate === "") {
            // Handle empty start or end date
            newErrors.startBillingDate = "Please enter both start and end dates.";
        }

        if (new Date(startBillingDate) > new Date(endBillingDate)) {
            // Handle invalid date range
            newErrors.startBillingDate = "Start Date should be less than or equal to End Date.";
        }

        const currentDate = new Date().toISOString().split('T')[0];
        if (endBillingDate > currentDate) {
            // Handle end date greater than current date
            newErrors.endBillingDate = "End Date should be less than or equal to the current date.";
        }
        setErrors(newErrors);
        const isDataValid = Object.values(newErrors).every((error) => !error);
        if (isDataValid) {
            // If all validations pass, fetch data from API
            getBillingSummaryDataFromAPI();
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle tag="h5">Billing Summary</CardTitle>
                    <p>Enter period for which the billing list has to be displayed</p>
                </CardHeader>
                <CardBody>
                    <Form>
                        <Row>
                            <Col className="pr-1" md="4">
                                <FormGroup>
                                    <label htmlFor='startBillingDate' className='addPLabel'>Start Date</label>
                                    <Input
                                        type="date"
                                        id="startBillingDate"
                                        name="startBillingDate"
                                        placeholder="Enter start date"
                                        value={startBillingDate}
                                        autoComplete='off'
                                        onChange={handleStartDateChange}
                                    />
                                    {errors.startBillingDate && (
                                        <div className="text-danger">{errors.startBillingDate}</div>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col className="px-1" md="4">
                                <FormGroup>
                                    <label htmlFor='endBillingDate' className='addPLabel'>End Date</label>
                                    <Input
                                        type="date"
                                        id="endBillingDate"
                                        name="endBillingDate"
                                        placeholder="Enter end date"
                                        value={endBillingDate}
                                        autoComplete='off'
                                        onChange={handleEndDateChange}
                                    />
                                    {errors.endBillingDate && (
                                        <div className="text-danger">{errors.endBillingDate}</div>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col className="pl-1" md="4">
                                <div className="update ml-auto mr-auto mt-2">
                                    <FormGroup>
                                        <Button
                                            color="primary"
                                            type="button"
                                            onClick={handleBillingSummary}
                                        >
                                            Display Billing Summary
                                        </Button>
                                    </FormGroup>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                {showBillingSummaryData && !summaryBillsDataLoading && summaryBillsData ? (
                                    <BillingList
                                        isBillListDataLoading={summaryBillsDataLoading}
                                        billListDataError={summaryBillsDataError}
                                        billListData={summaryBillsData}
                                        dataType={"Bill"}
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

export default BillingSummary
