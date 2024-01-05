import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Button,
    FormGroup,
} from "reactstrap";
import { StyleSheet, Font } from '@react-pdf/renderer';

import useAuth from "../../hooks/useAuth";
import { fetchBillDataForPDFGeneration } from "../../api/api"
import { PDFViewer, Document, Page, Text, View, Image } from '@react-pdf/renderer';
import customsansSerifFont from './OpenSans-Medium.ttf';
import customseriFont from './Times New Roman Regular.ttf';
// import kannadaFont from './Nudi-01-e.ttf';
import { useMediaQuery } from 'react-responsive';

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

function getFormattedDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const currentDate = new Date();

    return `Generated on ${currentDate.toLocaleDateString('en-US', options)}`;
};

const formatToTwoDecimalPlaces = (number, decimals) => {
    // Check if the input is a valid number
    if (typeof number !== 'number' || isNaN(number)) {
        return number;
    }

    return number.toFixed(decimals);
};

// Register the fonts
Font.register({
    family: 'MyCustomFontRegular',
    src: customsansSerifFont,
});

Font.register({
    family: 'MyCustomFontBold',
    src: customseriFont,
    fontWeight: 'bold',
});

// Register the Kannada font
// Font.register({ family: 'Nudi Font', src: kannadaFont });

const GenerateBill = () => {
    const { auth } = useAuth();
    const { accessToken } = auth;
    const { billId } = useParams();
    const generatedDateMessage = getFormattedDate();

    const [billDataForPDFReport, setBillDataForPDFReport] = useState([]);
    const [billDataForPDFReportLoading, setBillDataForPDFReportLoading] = useState(true);
    const [billDataForPDFReportError, setBillDataForPDFReportError] = useState(null);
    const [lineItems, setLineItems] = useState([]);
    const invoiceRef = useRef(null);

    const isDesktop = useMediaQuery({ minWidth: 768 });

    const styles = StyleSheet.create({
        table: {
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "50px"
        },
        tableRow: {
            margin: "auto",
            flexDirection: "row"
        },
        tableCol: {
            width: "25%",
            borderStyle: "solid",
            borderWidth: 0,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableCol1: {
            width: "25%",
            borderStyle: "solid",
            borderWidth: 0,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableCell: {
            margin: "auto",
            marginTop: 5,
            fontSize: 10
        },
        tableRowNoBorder: {
            flexDirection: "row",
            margin: "auto",
        },

        // Style for each cell in the row without borders
        tableCellNoBorder: {
            margin: "auto",
            fontSize: 10,
            borderWidth: 0, // Remove all borders
        },
        regularText: {
            fontFamily: 'MyCustomFontRegular',
            fontSize: 10,
            // Add other styles as needed
        },
        boldText: {
            fontFamily: 'MyCustomFontBold',
            fontSize: 10,
        },
        footer: {
            position: 'absolute',
            bottom: 20, // Adjust the bottom value as needed
            left: 0,
            right: 0,
            textAlign: 'center',
        },

        footerLine: {
            borderBottom: 1,
            borderColor: '#000',
        },
        kannadaText: {
            fontFamily: 'Nudi Font',
            fontSize: 12,
        },
    });

    // Fetch Bill data for PDF generation
    useEffect(() => {

        const fetchBillData = async () => {
            try {
                const billdataforpdfgeneration = await fetchBillDataForPDFGeneration(accessToken, billId);
                setBillDataForPDFReport(billdataforpdfgeneration);
                setBillDataForPDFReportLoading(false);
                setBillDataForPDFReportError("");
                setLineItems(billdataforpdfgeneration.bidata);
            } catch (error) {
                setBillDataForPDFReportLoading(false);
                if (axios.isCancel(error)) {
                    setBillDataForPDFReportError(error);
                    console.log("Request canceled:", error.message);
                } else {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        fetchBillData();

    }, [accessToken, billId]);

    if (billDataForPDFReportLoading) {
        return <div>Loading...</div>;
    } else if (billDataForPDFReportError) {
        return <div>Error fetching data</div>;
    } else {
        return (
            <div className='content'>
                {isDesktop ? (
                    <div style={{ width: '100%', height: '600px', marginTop: '20px' }}>
                        <PDFViewer width='100%' height='100%'>
                            <Document>
                                <Page size="A4" style={styles.body}>
                                    <View className='content' ref={invoiceRef}>
                                        <View className="container bootdey">
                                            <View className="row invoice row-printable">
                                                <View className="col-md-12">

                                                    <View className="panel panel-default plain" id="dash_0">


                                                        <View className="row">

                                                            <View className="col-lg-6">

                                                                <View className="invoice-logo"><Image style={{ width: '10%', marginLeft: '5%', marginTop: '4%' }} src={require("assets/img/ydc_logo.jpg")} alt="YDC" /></View>


                                                                <View className="col-lg-6">

                                                                    <View className="invoice-from text-right">
                                                                        <View className="list-unstyled" style={[{ textAlign: 'right', lineHeight: '2', fontSize: '1vh', marginRight: '4%', marginTop: '-11%' }]}>
                                                                            <Text style={{ fontWeight: 'extrabold', color: 'black', fontSize: '10px' }}>YOGIATREYA DIAGNOSTIC CENTER</Text>
                                                                            <Text style={{ fontWeight: 'ultrabold', fontSize: '9px', marginRight: '2%' }}>PRECISION IS OUR PRIORITY</Text>
                                                                            <Text>#2921, 5th Main, 2nd Cross, MCC 'B' Block, Devanagere</Text>
                                                                            <Text>Email: yogiatreyadiagnostics</Text>
                                                                            <Text>Phone: 7337856854</Text>
                                                                        </View>
                                                                    </View>
                                                                </View>





                                                                <View style={{ marginTop: '5%', fontSize: '1vh', marginLeft: '5%', lineHeight: '1.8' }}>


                                                                    <Text style={{ fontSize: '12px', fontWeight: 'extrabold' }}>Invoiced To</Text>
                                                                    <Text style={styles.boldText}>{billDataForPDFReport.bdata[0].salutation}{" "}{billDataForPDFReport.bdata[0].patient_name}</Text>
                                                                    <Text style={styles.boldText}>{billDataForPDFReport.bdata[0].address}</Text>
                                                                    <Text style={styles.boldText}>{billDataForPDFReport.bdata[0].region}</Text>
                                                                    <Text style={styles.boldText}>{billDataForPDFReport.bdata[0].state}{" "}{billDataForPDFReport.bdata[0].country}</Text>


                                                                </View>
                                                                <View style={{ textAlign: 'right', marginTop: '-11%', marginRight: '4%', fontSize: '1vh', lineHeight: '1.8' }}>
                                                                    <Text> <Text style={[{ fontSize: '1.2vh', fontWeight: 'extrabold' }, styles.boldText]}> Bill No: </Text> {"# "}{billDataForPDFReport.bdata[0].id}</Text>
                                                                    <Text> <Text style={[{ fontSize: '1.2vh', fontWeight: 'extrabold' }, styles.boldText]}>  Bill Date: </Text> {formatDate(billDataForPDFReport.bdata[0].billdate)}</Text>
                                                                    <Text> <Text style={[{ fontSize: '1.2vh', fontWeight: 'extrabold' }, styles.boldText]}> Paid by:</Text>
                                                                        {billDataForPDFReport.bdata[0].cash_payment && billDataForPDFReport.bdata[0].cash_payment > 0.0 && (!billDataForPDFReport.bdata[0].digital_payment || billDataForPDFReport.bdata[0].digital_payment === 0.0) ? (
                                                                            " Cash"
                                                                        ) : billDataForPDFReport.bdata[0].digital_payment && billDataForPDFReport.bdata[0].digital_payment > 0.0 && (!billDataForPDFReport.bdata[0].cash_payment || billDataForPDFReport.bdata[0].cash_payment === 0.0) ? (
                                                                            " Digital"
                                                                        ) : billDataForPDFReport.bdata[0].cash_payment && billDataForPDFReport.bdata[0].cash_payment > 0.0 && billDataForPDFReport.bdata[0].digital_payment && billDataForPDFReport.bdata[0].digital_payment > 0.0 ? (
                                                                            " Cash & Digital"
                                                                        ) : (
                                                                            "Pending"
                                                                        )}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.table}>
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableCol1}>
                                                <Text style={styles.tableCell}>Sl No</Text>
                                            </View>
                                            <View style={styles.tableCol1}>
                                                <Text style={styles.tableCell}>Code</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>Description</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>Amount</Text>
                                            </View>
                                        </View>
                                        {lineItems.map((item, index) => (
                                            <View key={index} style={styles.tableRow}>
                                                <View style={styles.tableCol1}>
                                                    <Text style={styles.tableCell}>{index + 1}</Text>
                                                </View>
                                                <View style={styles.tableCol1}>
                                                    <Text style={styles.tableCell}>{item.code}</Text>
                                                </View>
                                                <View style={styles.tableCol}>
                                                    <Text style={styles.tableCell}>{item.name}</Text>
                                                </View>
                                                <View style={styles.tableCol}>
                                                    <Text style={[styles.tableCell, { textAlign: 'right' }, { width: '25%' }]}>{formatToTwoDecimalPlaces(item.amount, 2)}</Text>
                                                </View>
                                            </View>
                                        ))}
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{" "}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{" "}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{" "}</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{" "}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.tableRow}>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCellNoBorder}></Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCellNoBorder}></Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={[styles.tableCell, { textAlign: 'right' }, { width: '100%' }]}>Total Amount:</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={[styles.tableCell, { textAlign: 'right' }, { width: '25%' }]}>{formatToTwoDecimalPlaces(billDataForPDFReport.bdata[0].total_amount, 2)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableRowNoBorder}>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}></Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}></Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={[styles.tableCell, { textAlign: 'right' }, { width: '100%' }]}>Discount:</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={[styles.tableCell, { textAlign: 'right' }, { width: '25%' }]}>{formatToTwoDecimalPlaces(billDataForPDFReport.bdata[0].discount, 2)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableRowNoBorder}>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}></Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}></Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={[styles.tableCell, { textAlign: 'right' }, { width: '100%' }]}>Net Amount:</Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={[styles.tableCell, { textAlign: 'right' }, { width: '25%' }]}>{formatToTwoDecimalPlaces(billDataForPDFReport.bdata[0].net_amount, 2)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.footer}>
                                        <View style={styles.footerLine}></View>
                                        <Image style={{ width: "70%", marginTop: '4px', marginBottom: "10px", marginLeft: "95px" }} src={require("assets/img/kannada_address.png")} alt="YDC" />
                                        {/* <Text style={[styles.kannadaText, { marginBottom: "20px", marginTop: "4px" }]}>#2951, 5ನೇ ಮೈನ್, 2ನೇ ಕ್ರಾಸ್, ಎಂ.ಸಿ.ಸಿ ಬಿ ಬ್ಲಾಕ್, ದಾವಣಗೆರೆ</Text> */}
                                    </View>
                                </Page>
                            </Document>
                        </PDFViewer>
                    </div>

                ) : (
                    <div className='content' ref={invoiceRef}>
                        <div className="container bootdey">
                            <div className="row invoice row-printable">
                                <div className="col-md-12">

                                    <div className="panel panel-default plain" id="dash_0">

                                        <div className="panel-body p30">
                                            <div className="row">

                                                <div className="col-lg-6">

                                                    <div className="invoice-logo"><img width="100" src={require("assets/img/ydc_logo.jpg")} alt="YDC" /></div>
                                                </div>

                                                <div className="col-lg-6">

                                                    <div className="invoice-from text-right">
                                                        <ul className="list-unstyled" style={{ textAlign: 'right' }}>
                                                            <li><strong>YOGIATREYA DIAGNOSTIC CENTER</strong></li>
                                                            <li><strong>PRECISION IS OUR PRIORITY</strong></li>
                                                            <li>#2921, 5th Main, 2nd Cross, MCC 'B' Block, Devanagere</li>
                                                            <li>Email: yogiatreyadiagnostics</li>
                                                            <li>Phone: 7337856854</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">

                                                    <div className="row mt-4">

                                                        <div className="col-lg-6">
                                                            <div className="invoice-to mt25">
                                                                <ul className="list-unstyled">
                                                                    <li><strong>Invoiced To</strong></li>
                                                                    <li>{billDataForPDFReport.bdata[0].salutation}{" "}{billDataForPDFReport.bdata[0].patient_name}</li>
                                                                    <li>{billDataForPDFReport.bdata[0].address}</li>
                                                                    <li>{billDataForPDFReport.bdata[0].region}</li>
                                                                    <li>{billDataForPDFReport.bdata[0].state}{" "}{billDataForPDFReport.bdata[0].country}</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="invoice-details mt25">
                                                                <div className="well">
                                                                    <ul className="list-unstyled mb0" style={{ textAlign: 'right' }}>
                                                                        <li><strong>Bill No:</strong> {"# "}{billDataForPDFReport.bdata[0].id}</li>
                                                                        <li><strong>Bill Date:</strong> {formatDate(billDataForPDFReport.bdata[0].billdate)}</li>
                                                                        <li><strong>Paid by:</strong>
                                                                            {billDataForPDFReport.bdata[0].cash_payment && billDataForPDFReport.bdata[0].cash_payment > 0.0 && (!billDataForPDFReport.bdata[0].digital_payment || billDataForPDFReport.bdata[0].digital_payment === 0.0) ? (
                                                                                " Cash"
                                                                            ) : billDataForPDFReport.bdata[0].digital_payment && billDataForPDFReport.bdata[0].digital_payment > 0.0 && (!billDataForPDFReport.bdata[0].cash_payment || billDataForPDFReport.bdata[0].cash_payment === 0.0) ? (
                                                                                " Digital"
                                                                            ) : billDataForPDFReport.bdata[0].cash_payment && billDataForPDFReport.bdata[0].cash_payment > 0.0 && billDataForPDFReport.bdata[0].digital_payment && billDataForPDFReport.bdata[0].digital_payment > 0.0 ? (
                                                                                " Cash & Digital"
                                                                            ) : (
                                                                                "Pending"
                                                                            )}
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="invoice-items">
                                                        <div className="table-responsive" style={{/*overflow: hidden; outline: none;*/ }} tabIndex="0">
                                                            <table className="table table-bordered">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="per5 text-left">Sl No</th>
                                                                        <th className="per5 text-left">Code</th>
                                                                        <th className="per75 text-left">Description</th>
                                                                        <th className="per15 text-left">Amount</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {lineItems.map((item, index) => (
                                                                        <tr key={item.id}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{item.code}</td>
                                                                            <td>{item.name}</td>
                                                                            <td>{formatToTwoDecimalPlaces(item.amount, 2)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                                <tfoot>
                                                                    <tr>
                                                                        <th colSpan="3" style={{ textAlign: 'right' }}>Total Amount:</th>
                                                                        <th className="text-left">{formatToTwoDecimalPlaces(billDataForPDFReport.bdata[0].total_amount, 2)}</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th colSpan="3" style={{ textAlign: 'right' }}>Discount:</th>
                                                                        <th className="text-left">{formatToTwoDecimalPlaces(billDataForPDFReport.bdata[0].discount, 2)}</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th colSpan="3" style={{ textAlign: 'right' }}>Net Amount:</th>
                                                                        <th className="text-left">{formatToTwoDecimalPlaces(billDataForPDFReport.bdata[0].net_amount, 2)}</th>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                    </div>



                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                )}
            </div>
        );
    }
}

export default GenerateBill;
