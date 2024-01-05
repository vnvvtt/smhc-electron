import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    Svg,
    Line,
    PDFViewer,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import {
    Button,
    Row,
    Col,
    Table,
} from "reactstrap";

import useAuth from "../../hooks/useAuth";
import axiosUtil from "../../api/axios";
import { PDFDownloadLink } from "@react-pdf/renderer"; // Import PDFDownloadLink for download functionality
import PrescriptionContents from "./PrescriptionContents";
import SMHCLogo from "assets/img/hospital-clinic-plus-logo.png";
import "../../views/Test.css"

const CancelToken = axios.CancelToken;
const prescriptionDataApiUrl = "/prescriptions/generatepdf";

const PrescriptionPDF = () => {
    let { prescriptionId, patientId } = useParams();

    const { auth } = useAuth();
    const bearerToken = auth.accessToken;

    const fileName = `prescriptionPDF_${patientId}_${prescriptionId}_.pdf`;

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(`/admin/user-page/${patientId}`);
    };

    // Define styles for PDF content
    const styles = StyleSheet.create({
        page: {
            padding: 15,
        },
        logo: {
            width: 100,
            height: 100,
        },
        doctorName: {
            fontSize: 14,
            marginTop: 5,
        },
        address: {
            fontSize: 11,
        },
        phone: {
            fontSize: 11,
        },
        email: {
            fontSize: 11,
        },
        patientName: {
            fontSize: 14,
            marginTop: 5,
        },
        topText: {
            fontSize: 14,
            marginTop: 15,
        },
        complaints: {
            fontSize: 14,
            marginTop: 10,
            lineHeight: 2,
        },
        // table: {
        //     display: "table",
        //     width: "auto",
        //     borderStyle: "solid",
        //     borderWidth: 1,
        //     borderRightWidth: 0,
        //     borderBottomWidth: 0,
        //     marginLeft: "5%",
        //     marginRight: "5%",
        // },
        // tableRow: {
        //     margin: "auto",
        //     flexDirection: "row",
        // },
        // tableCol: {
        //     width: "20%",
        //     borderStyle: "solid",
        //     borderWidth: 1,
        //     borderLeftWidth: 0,
        //     borderTopWidth: 0,
        // },
        // tableCell: {
        //     margin: "auto",
        //     marginTop: 5,
        //     fontSize: 10,
        // },

        // exptable: {
        //     display: "table",
        //     width: "auto",
        //     borderStyle: "solid",
        //     borderWidth: 0,
        //     borderColor: "white",
        //     borderRightWidth: 0,
        //     borderBottomWidth: 0,
        //     marginLeft: "5%",
        //     marginRight: "5%",
        //     marginTop: "2%",
        // },
        // exptableRow: {
        //     margin: "auto",
        //     flexDirection: "row",
        // },
        // exptableCol: {
        //     width: "100%",
        //     borderStyle: "solid",
        //     borderWidth: 0,
        //     borderColor: "white",
        //     borderLeftWidth: 0,
        //     borderTopWidth: 0,
        // },
        // exptableCell: {
        //     margin: "auto",
        //     marginTop: 5,
        //     fontSize: 10,
        //     textAlign: "left",
        // },
        table: {
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderWidth: 0,
            borderColor: "#000",
            marginLeft: "5%",
            marginRight: "5%",
        },
        tableRow: {
            flexDirection: "row",
            borderBottomColor: "#000",
            borderBottomWidth: 0,
            alignItems: 'center',
            height: 24, // Set a fixed height for rows
        },
        tableColHeader: {
            width: "25%", // adjust the width as per content
            borderStyle: "solid",
            borderWidth: 0,
            borderColor: "#000",
            justifyContent: 'center',
            textAlign: 'center',
            display: 'flex',
            flex: 1,
            alignItems: 'center',
        },
        tableCellHeader: {
            margin: "auto",
            fontSize: 10,
            fontWeight: 600,
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex',
            flex: 1,
            alignItems: 'center',
        },
        tableCol: {
            width: "25%", // You can adjust the initial width if needed
            borderStyle: "solid",
            borderWidth: 0,
            borderColor: "#000",
            justifyContent: 'center',
        },
        tableCell: {
            margin: "auto",
            fontSize: 9, // Use a smaller font size if content is wrapping
            padding: 5, // Add padding for content to not touch the borders
            textAlign: 'left', // Align the text to the left
            whiteSpace: 'wrap', // Allow the text to wrap within the available space
            flexDirection: Row,
            flex: 1,
        },
    });

    // Create a function to generate the PDF content
    const generatePdfContent = () => (
        <>
            <Document>
                <Page size="A4">
                    <View style={styles.page}>
                        <View style={{ flexDirection: "row" }}>
                            <Image style={styles.logo} src={SMHCLogo} />
                            <View style={{ marginLeft: 20, flex: 1, lineHeight: "2px" }}>
                                <Text style={styles.doctorName}>
                                    {prescriptionData[0].doctorname}
                                </Text>
                                <Text style={styles.address}>
                                    {prescriptionData[0].doctoraddress}
                                </Text>
                                <Text style={styles.phone}>
                                    {prescriptionData[0].doctorphone}
                                </Text>
                                <Text style={styles.email}>
                                    {prescriptionData[0].doctoremail}
                                </Text>
                            </View>
                        </View>
                        <Svg height="10" width="600">
                            <Line
                                x1="0"
                                y1="10"
                                x2="550"
                                y2="10"
                                strokeWidth={1}
                                stroke="rgb(0,0,0)"
                            />
                        </Svg>
                    </View>

                    <View style={{ marginLeft: "5%", marginBottom: "5%" }}>
                        <Text style={styles.patientName}>
                            {prescriptionData[0].patientname} {" - "}{" "}
                            {prescriptionData[0].patientid} {" - "}{" "}
                            {prescriptionData[0].patientage} {" Years "}
                        </Text>
                    </View>

                    <PrescriptionContents
                        caption="Complaints"
                        id={prescriptionData[0].complaints}
                    />

                    <PrescriptionContents
                        caption="Examination"
                        id={prescriptionData[0].examination}
                    />

                    <PrescriptionContents
                        caption="Diagnosis"
                        id={prescriptionData[0].diagnosis}
                    />

                    <PrescriptionContents
                        caption="Investigation"
                        id={prescriptionData[0].investigations}
                    />

                    <PrescriptionContents
                        caption="Advice"
                        id={prescriptionData[0].advice}
                    />

                    <PrescriptionContents
                        caption="Follow Up"
                        id={prescriptionData[0].followup}
                    />

                    <View style={{ marginLeft: "5%", marginTop: "5%" }}>
                        <Text style={styles.complaints}>Medicines prescribed</Text>
                    </View>
                    {Array.isArray(prescriptionData[0].medicinelist) ? (
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={[styles.tableColHeader, { textAlign: 'center' }]}>
                                    <Text style={styles.tableCellHeader}>Medicine Name</Text>
                                </View>
                                <View style={[styles.tableColHeader, { textAlign: 'center' }]}>
                                    <Text style={styles.tableCellHeader}>Dosage</Text>
                                </View>
                                <View style={[styles.tableCellHeader, { textAlign: 'center' }]}>
                                    <Text style={styles.tableCellHeader}>Frequency & Duration</Text>
                                </View>
                                <View style={[styles.tableCellHeader, { textAlign: 'center' }]}>
                                    <Text style={styles.tableCellHeader}>Doctor's Notes</Text>
                                </View>
                            </View>
                            {prescriptionData[0].medicinelist.map((medicine, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>
                                            {medicine["Medicine Name"]}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{medicine["Dosage"]} {medicine["Units"]}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{medicine["Frequency"]} for {medicine["Duration"]} {medicine["FoodTiming"]}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>
                                            {medicine["DoctorNotes"] ? medicine["DoctorNotes"] : "N/A"}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                    ) : (
                        <Text>No medicines have been prescribed</Text>
                    )}
                </Page>
            </Document>
        </>
    );

    const fetchPrescriptionData = async () => {
        const response = await axiosUtil.get(prescriptionDataApiUrl, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            params: {
                prescriptionId: prescriptionId,
            },
            cancelToken: new CancelToken(function executor(c) { }),
        });

        console.log("Prescription Data");
        console.log(response.data);
        return response.data;
    };

    const {
        data: prescriptionData,
        error,
        isLoading,
    } = useQuery("getPrescriptionData", fetchPrescriptionData);

    if (isLoading) {
        <div>Loading...</div>;
    } else if (error) {
        return <div>Error while fetching data!</div>;
    } else {
        return (
            <>
                <div className="content">
                    <Row className='p-4'>
                        <Col md="12">
                            {prescriptionData && isLoading ? (
                                <div>Loading...</div>
                            ) : (

                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Download Prescription PDF</th>
                                            <th>Send Prescription PDF via SMS</th>
                                            <th>Send Prescription PDF via WhatsApp</th>
                                            <th>Go Back</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <PDFDownloadLink
                                                    document={generatePdfContent()}
                                                    fileName={fileName}
                                                >
                                                    {({ blob, url, loading, error }) =>
                                                        loading ? "Loading..." : "Download PDF"
                                                    }
                                                </PDFDownloadLink>

                                            </td>
                                            <td>

                                            </td>
                                            <td>

                                            </td>
                                            <td>
                                                <Button className="custom-button btn-round align-items-center justify-content-center" color="primary" onClick={handleGoBack}>Go Back</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            )}
                        </Col>
                        {/* <Col md="12">
                            <div>
                                {prescriptionData && isLoading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <div>
                                        <div className="bg-white rounded-lg shadow-md">
                                            <PDFViewer width="100%" height={window.innerHeight}>
                                                {generatePdfContent()}
                                            </PDFViewer>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </Col> */}
                    </Row>
                </div>
            </>
        );
    }

}

export default PrescriptionPDF
