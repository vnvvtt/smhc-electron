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
} from "reactstrap";

import useAuth from "../../hooks/useAuth";
import "../../views/Test.css"
import { fetchAllBills } from "../../api/api"
import BillingList from 'components/billing/BillingList';


const DisplayBillsList = () => {
    const { auth } = useAuth();
    const { accessToken } = auth;
    const today = new Date();
    const currentYear = today.getFullYear();

    const [billsData, setBillsData] = useState([]);
    const [billsDataLoading, setBillsDataLoading] = useState(true);
    const [billsDataError, setBillsDataError] = useState("");

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/admin/addnewbill/`);
    };

    useEffect(() => {

        const fetchBills = async () => {
            try {
                const bills = await fetchAllBills(accessToken);
                setBillsData(bills);
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

        fetchBills();

    }, [accessToken, currentYear]);

    return (
        <>
            <div className="content p-2">
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
            </div>
        </>
    );
}

export default DisplayBillsList
