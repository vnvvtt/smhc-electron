import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Table,
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
import { fetchDoctorsTopFiveBillls, fetchHospitalsTopFiveBillls, fetchAllBills, fetchLabTypeBreakUps, fetchMonthlyRevenue, fetchAllExpenses, fetchAnalyticsDataFromAPI } from "../api/api"
import BarChartData from 'components/Misc/BarChartData';
import BillingList from 'components/billing/BillingList';
import DisplayCardsNoImage from 'components/Misc/DisplayCardsNoImage';
import ExpenseList from 'components/expenses/ExepnseList';
import BillingSummary from 'components/billing/BillingSummary';
import ExpenseSummary from 'components/expenses/ExpenseSummary';
import { formatDate, getMonthFromDate, getTotalBasedOnTodaysExpenses, getTotalExpensesBasedOnCurrentMonth, getTotalBillsCountForToday, getBillsCountForCurrentMonth, getTotalRevenueBasedOnTodaysBills, getTotalRevenueBasedOnCurrentMonth } from "../components/Misc/commonUtils"
import { barChartOptions, pieChartOptions, stackedBarChartOptions } from '../components/Misc/DataOptions';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const UserDashboard = () => {
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

    //  Bill Monthly Revenue data to display revenue of each month in a Bar Chart
    const [billMonthlyRevenueData, setBillMonthlyRevenueData] = useState([]);
    const [billMonthlyRevenueDataError, setBillMonthlyRevenueDataError] = useState("");
    const [billMonthlyRevenueDataLoading, setBillMonthlyRevenueDataLoading] = useState(true);

    // Bill data stores all the bills stored in the database
    // The total count and today's count is calculated to display in Display Cards at the top
    // Analytics Data
    const [analyticsData, setAnalyticsData] = useState([]);
    // Today's Bill Count
    const [totalBillsForToday, setTotalBillsForToday] = useState(0);
    // Today's Revenue
    const [totalRevenueToday, setTotalRevenueToday] = useState(0);

    // Monthly Bill Count
    const [totalBillsForThisMonth, setTotalBillsForThisMonth] = useState(0);
    // Monthly Revenue
    const [totalRevenueForThisMonth, setTotalRevenueForThisMonth] = useState(0);

    // Weekly Bill Count
    const [totalBillsForThisWeek, setTotalBillsForThisWeek] = useState(0);
    // Weekly Revenue
    const [totalRevenueForThisWeek, setTotalRevenueForThisWeek] = useState(0);

    // Day Comparison
    const [totalRevenueForToday, setTotalRevenueForToday] = useState(0);
    const [totalRevenueForYesterday, setTotalRevenueForYesterday] = useState(0);

    // Monthly Comparison
    const [totalRevenueForCurrentMonth, setTotalRevenueForCurrentMonth] = useState(0);
    const [totalRevenueForLastMonth, setTotalRevenueForLastMonth] = useState(0);

    // Day Revenue Comparison bar Chart
    const [revenueForDayBarChart, setRevenueForDayBarChart] = useState(0);
    // Day Revenue Comparison bar Chart
    const [revenueForMonthBarChart, setRevenueForMonthBarChart] = useState(0);

    const [analyticsDataLoading, setAnalyticsDataLoading] = useState(true);
    const [analyticsDataError, setAnalyticsDataError] = useState("");


    const [showChatbot, setShowChatbot] = useState(true);

    const handleNewUserMessage = (newMessage) => {
        console.log(newMessage);
        addResponseMessage("Message received!");

    };

    const handleToggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    // const navigate = useNavigate();
    // const handleClick = () => {
    //     navigate(`/admin/addnewbill/`);
    // };
    // const handleExpensesClick = () => {
    //     navigate(`/admin/addnewexpense/`);
    // };

    // Get data from API to display data in different sections
    useEffect(() => {

        // Get Expenses data from database
        const fetchAnalyticsData = async () => {
            try {
                const analytics = await fetchAnalyticsDataFromAPI(accessToken);
                setTotalBillsForToday(analytics.todaysCount);
                setTotalRevenueToday(analytics.todaysRevenue);
                setTotalBillsForThisMonth(analytics.monthlyCount);
                setTotalRevenueForThisMonth(analytics.monthlyRevenue);
                setTotalBillsForThisWeek(analytics.weeklyCount);
                setTotalRevenueForThisWeek(analytics.weeklyRevenue);
                setTotalRevenueForToday(analytics.dayRevenueComparisonreturn.today);
                setTotalRevenueForYesterday(analytics.dayRevenueComparisonreturn.yesterday);
                setTotalRevenueForCurrentMonth(analytics.monthRevenueComparison.currentMonth);
                setTotalRevenueForLastMonth(analytics.monthRevenueComparison.lastMonth);
                setRevenueForDayBarChart(analytics.dayBarChartData);
                setRevenueForMonthBarChart(analytics.monthBarChartData);
                setAnalyticsData(analytics);
                setAnalyticsDataLoading(false);
            } catch (error) {
                setAnalyticsData([]);
                setAnalyticsDataLoading(false);
                setAnalyticsDataError(error);
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

        fetchAnalyticsData();
        fetchTop5BillsByDoctor();
        fetchTop5BillsByHospital();
        fetchBillsMonthlyRevenue();

    }, [accessToken, currentYear]);

    return (
        <div className="content">
            {userRole.includes('admin') || userRole.includes('user') ? (analyticsDataLoading && analyticsData ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Row className='p-2 d-flex align-items-stretch'>
                        <Col lg="4" md="6" sm="6" className="d-flex">
                            <DisplayCardsNoImage
                                cardTitle1="Today's Bills"
                                cardMessage1={totalBillsForToday}
                                footerMessage={`As on ${formattedDate}`}
                                cardBackGroundColor="#ffffff"
                                cardTitle2="Today's Revenue"
                                cardMessage2={totalRevenueToday}
                            />
                        </Col>
                        <Col lg="4" md="6" sm="6" className="d-flex">
                            <DisplayCardsNoImage
                                cardTitle1={`Weekly Bills`}
                                cardMessage1={totalBillsForThisWeek}
                                footerMessage="As on this Week"
                                cardBackGroundColor="#ffffff"
                                cardTitle2={`Weekly Revenue`}
                                cardMessage2={totalRevenueForThisWeek}
                            />
                        </Col>
                        <Col lg="4" md="6" sm="6" className="d-flex">
                            <DisplayCardsNoImage
                                cardTitle1="Monthly Bills"
                                cardMessage1={totalBillsForThisMonth}
                                footerMessage={`In ${formattedMonth}`}
                                cardBackGroundColor="#ffffff"
                                cardTitle2="Monthly Revenue"
                                cardMessage2={totalRevenueForThisMonth}
                            />
                        </Col>
                    </Row>
                    <Row className='p-2 d-flex align-items-stretch'>
                        <Col md="6">
                            <Card>
                                <CardTitle className='p-2'><h5>Daily Revenue Comparison</h5></CardTitle>
                                <CardBody>
                                    <BarChartData data={revenueForDayBarChart} options={barChartOptions} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card>
                                <CardTitle className='p-2'><h5>Monthly Revenue Comparison</h5></CardTitle>
                                <CardBody>
                                    <BarChartData data={revenueForMonthBarChart} options={barChartOptions} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </>
            )
            ) : null}
            <Row>
                <Col md="12">
                    <Card className="card-chart">
                        <CardHeader>
                            <CardTitle tag="h5">Monthly Revenue</CardTitle>
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
            </Row>
            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Top 5 Referrals (Doctor)</CardTitle>
                            {doctorsDataLoading && doctorsData ? (
                                <p>Loading...</p>
                            ) : doctorsDataError ? (
                                <p>Error: {doctorsDataError}</p>
                            ) : (
                                <BarChartData data={doctorsData} options={stackedBarChartOptions} />
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <Card>
                        <CardTitle tag="h5">Top 5 Referrals (Hospitals)</CardTitle>
                        <CardBody>
                            {hospitalsDataLoading && hospitalsData ? (
                                <p>Loading...</p>
                            ) : hospitalsDataError ? (
                                <p>Error: {hospitalsDataError}</p>
                            ) : (
                                <BarChartData data={hospitalsData} options={stackedBarChartOptions} />
                            )}
                        </CardBody>
                    </Card>
                </Col>

                <Col md="6">
                    <Widget
                        handleNewUserMessage={handleNewUserMessage}
                        title="YDC Bot"
                        subtitle="Contact Support"
                        handleToggle={handleToggleChatbot}
                        // fullScreenMode={showChatbot} 
                        showCloseButton={true}
                    />
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <BillingSummary />
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <ExpenseSummary />
                </Col>
            </Row>
        </div>
    )
}


export default UserDashboard
