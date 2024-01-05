import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
} from "reactstrap";
import { Pie } from "react-chartjs-2";

import useAuth from "../hooks/useAuth";
import "../views/Test.css"
import { fetchDoctorsTopFiveBillls, fetchHospitalsTopFiveBillls, fetchAllBills, fetchLabTypeBreakUps, fetchMonthlyRevenue, fetchAllExpenses } from "../api/api"
import BarChartData from 'components/Misc/BarChartData';
import BillingList from 'components/billing/BillingList';
import DisplayCardsNoImage from 'components/Misc/DisplayCardsNoImage';
import ExpenseList from 'components/expenses/ExepnseList';
import BillingSummary from 'components/billing/BillingSummary';
import ExpenseSummary from 'components/expenses/ExpenseSummary';
import { formatDate, getMonthFromDate, getTotalBasedOnTodaysExpenses, getTotalExpensesBasedOnCurrentMonth, getTotalBillsCountForToday, getBillsCountForCurrentMonth, getTotalRevenueBasedOnTodaysBills, getTotalRevenueBasedOnCurrentMonth } from "../components/Misc/commonUtils"
import { barChartOptions, pieChartOptions } from '../components/Misc/DataOptions';


const UnauthorizedComponent = () => {
    // Get Authentication data
    const { auth } = useAuth();

    // Access Token is used for authentication for API
    const { accessToken } = auth;
    // userRole is used to control User's access to options/sections
    const userRole = auth.roles;

    // Date/Year and formatted Date/Month are used in reports & display
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const formattedDate = formatDate(currentDate);
    const formattedMonth = getMonthFromDate(currentDate);

    //  Doctor's data to display Top 5 Referral Doctors Bar Chart
    const [doctorsData, setDoctorsData] = useState([]);
    const [doctorsDataError, setDoctorsDataError] = useState("");
    const [doctorsDataLoading, setDoctorsDataLoading] = useState(true);

    //  Hospital's data to display Top 5 Referral Hospitals Bar Chart
    const [hospitalsData, setHospitalsData] = useState([]);
    const [hospitalsDataError, setHospitalsDataError] = useState("");
    const [hospitalsDataLoading, setHospitalsDataLoading] = useState(true);

    //  Lab Type breakup data to display the Pie Chart
    const [labTypeBreakupData, setLabTypeBreakupData] = useState([]);
    const [labTypeBreakupDataError, setLabTypeBreakupDataError] = useState("");
    const [labTypeBreakupDataLoading, setLabTypeBreakupDataLoading] = useState(true);

    //  Bill Monthly Revenue data to display revenue of each month in a Bar Chart
    const [billMonthlyRevenueData, setBillMonthlyRevenueData] = useState([]);
    const [billMonthlyRevenueDataError, setBillMonthlyRevenueDataError] = useState("");
    const [billMonthlyRevenueDataLoading, setBillMonthlyRevenueDataLoading] = useState(true);

    // Bill data stores all the bills stored in the database
    // The total count and today's count is calculated to display in Display Cards at the top
    const [billsData, setBillsData] = useState([]);
    const [totalBillsForToday, setTotalBillsForToday] = useState(0);
    const [totalBillsCount, setTotalBillsCount] = useState(0);
    const [totalRevenueToday, setTotalRevenueToday] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [billsDataLoading, setBillsDataLoading] = useState(true);
    const [billsDataError, setBillsDataError] = useState("");

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/admin/addnewbill/`);
    };

    // Get data from API to display data in different sections
    useEffect(() => {

        // Get Bills data from database
        const fetchBills = async () => {
            try {
                const bills = await fetchAllBills(accessToken);
                setBillsData(bills);
                setTotalBillsForToday(getTotalBillsCountForToday(bills));
                setTotalBillsCount(getBillsCountForCurrentMonth(bills));
                setTotalRevenueToday(getTotalRevenueBasedOnTodaysBills(bills));
                setTotalRevenue(getTotalRevenueBasedOnCurrentMonth(bills));
                setBillsDataLoading(false);
                setBillsDataError("");
            } catch (error) {
                setBillsData([]);
                setBillsDataLoading(false);
                setBillsDataError(error);
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                }
            }
        };

        const fetchTop5BillsByHospital = async () => {
            try {
                const bills = await fetchHospitalsTopFiveBillls(accessToken);
                setHospitalsData(bills);
                setHospitalsDataError("");
                setHospitalsDataLoading(false);
            } catch (error) {
                setHospitalsDataLoading(false);
                setHospitalsData([]);
                setHospitalsDataError("Failed to fetch hospitals data. Please try again later.");
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        const fetchTop5BillsByDoctor = async () => {
            try {
                const bills = await fetchDoctorsTopFiveBillls(accessToken);
                setDoctorsDataError("");
                setDoctorsData(bills);
                setDoctorsDataLoading(false);
            } catch (error) {
                setDoctorsDataLoading(false);
                setDoctorsDataError("Failed to fetch doctors data. Please try again later.");
                setDoctorsData([]);
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        const fetchLabTypeBreakup = async () => {
            try {
                const chartData = await fetchLabTypeBreakUps(accessToken);
                setLabTypeBreakupData({
                    labels: chartData.categoryLabels,
                    datasets: [
                        {
                            data: chartData.categoryData,
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9966FF'],
                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9966FF'],
                        },
                    ],
                });
                setLabTypeBreakupDataLoading(false);
                setLabTypeBreakupDataError("");
            } catch (error) {
                setLabTypeBreakupDataLoading(false);
                setLabTypeBreakupDataError("Failed to fetch Lab Type Category data. Please try again later!");
                setLabTypeBreakupData([]);
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        const fetchBillsMonthlyRevenue = async () => {
            try {
                const lineDataSet = await fetchMonthlyRevenue(accessToken, currentYear);
                setBillMonthlyRevenueDataError("");
                setBillMonthlyRevenueData(lineDataSet);
                setBillMonthlyRevenueDataLoading(false);
            } catch (error) {
                setBillMonthlyRevenueDataLoading(false);
                setBillMonthlyRevenueDataError("Failed to fetch Bill Monthly Revenue. Please try again.");
                setBillMonthlyRevenueData([]);
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        fetchBills();
        fetchTop5BillsByDoctor();
        fetchTop5BillsByHospital();
        fetchLabTypeBreakup();
        fetchBillsMonthlyRevenue();

    }, [accessToken, currentYear]);

    

    return (
        <div className="content">
            {userRole.includes('admin') || userRole.includes('user') ? (billsDataLoading && billsData ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Row className='p-2 d-flex align-items-stretch'>
                        <Col lg="6" md="6" sm="6" className="d-flex">
                            <DisplayCardsNoImage
                                cardTitle1="Today's Bills"
                                cardMessage1={totalBillsForToday}
                                footerMessage={`As On ${formattedDate}`}
                                cardBackGroundColor="#ffffff"
                                cardTitle2="Today's Revenue"
                                cardMessage2={totalRevenueToday}
                            />
                        </Col>
                        <Col lg="6" md="6" sm="6" className="d-flex">
                            <DisplayCardsNoImage
                                cardTitle1="Monthly Bills"
                                cardMessage1={totalBillsCount}
                                footerMessage={`In ${formattedMonth}`}
                                cardBackGroundColor="#ffffff"
                                cardTitle2="Monthly Revenue"
                                cardMessage2={totalRevenue}
                            />
                        </Col>
                    </Row>
                </>
            )
            ) : null}
            <Row>
                <Col md="12">
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col>
                                    <CardTitle tag="h4">List of Bills</CardTitle>
                                </Col>
                                <Col className="text-right">
                                    <Button color="primary" className='float-end' onClick={handleClick}>Add Bill</Button>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            {billsDataLoading && billsData ? (
                                <p>Loading...</p>
                            ) : (
                                <BillingList
                                    isBillListDataLoading={billsDataLoading}
                                    billListDataError={billsDataError}
                                    billListData={billsData}
                                    dataType={"Bill"}
                                />
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <BillingSummary />
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <Card className="card-chart">
                        <CardHeader>
                            <CardTitle tag="h5">Monthly Revenue</CardTitle>
                            <p className="card-category">Year: {currentYear}</p>
                        </CardHeader>
                        <CardBody>
                            {billMonthlyRevenueDataLoading && billMonthlyRevenueData ? (
                                <p>Loading...</p>
                            ) : billMonthlyRevenueDataError ? (
                                <p>Error: {billMonthlyRevenueDataError}</p>
                            ) : (
                                <BarChartData data={billMonthlyRevenueData} options={barChartOptions} />
                            )}
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                </Col>
                <Col md="6">
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h5">Category Type Breakup</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {labTypeBreakupDataLoading && labTypeBreakupData ? (
                                <p>Loading...</p>
                            ) : labTypeBreakupDataError ? (
                                <p>Error: {labTypeBreakupDataError}</p>
                            ) : (
                                <Pie data={labTypeBreakupData} options={pieChartOptions} />
                            )}
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Top 5 Referrals (Doctor)</CardTitle>
                            {doctorsDataLoading && doctorsData ? (
                                <p>Loading...</p>
                            ) : doctorsDataError ? (
                                <p>Error: {doctorsDataError}</p>
                            ) : (
                                <BarChartData data={doctorsData} options={barChartOptions} />
                            )}
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Top 5 Referrals (Hospitals)</CardTitle>
                            {hospitalsDataLoading && hospitalsData ? (
                                <p>Loading...</p>
                            ) : hospitalsDataError ? (
                                <p>Error: {hospitalsDataError}</p>
                            ) : (
                                <BarChartData data={hospitalsData} options={barChartOptions} />
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}


export default UnauthorizedComponent