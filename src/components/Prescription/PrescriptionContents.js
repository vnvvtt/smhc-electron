import React from "react";
import {
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const PrescriptionContents = (props) => {
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
        table: {
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            marginLeft: "5%",
            marginRight: "5%",
        },
        tableRow: {
            margin: "auto",
            flexDirection: "row",
        },
        tableCol: {
            width: "25%",
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
        },
        tableCell: {
            margin: "auto",
            marginTop: 5,
            fontSize: 10,
        },

        exptable: {
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderWidth: 0,
            borderColor: "white",
            borderRightWidth: 0,
            borderBottomWidth: 0,
            marginLeft: "5%",
            marginRight: "5%",
            marginTop: "2%",
        },
        exptableRow: {
            margin: "auto",
            flexDirection: "row",
        },
        exptableCol: {
            width: "100%",
            borderStyle: "solid",
            borderWidth: 0,
            borderColor: "white",
            borderLeftWidth: 0,
            borderTopWidth: 0,
        },
        exptableCell: {
            margin: "auto",
            marginTop: 5,
            fontSize: 10,
            textAlign: "left",
        },
        complaintContainer: {
            flexDirection: 'row', // Align items in a row
            paddingLeft: '1%',
            marginTop: '2%',
        },
        captionText: {
            fontSize: 14, // Use a number for fontSize
            color: 'black',
            marginRight: 5, // Add some space between caption and id
        },
        idText: {
            fontSize: 12, // Use a number for fontSize
            color: 'black',
        },
    });

    return (
        <View style={[styles.complaintContainer, { marginLeft: "5%" }]}>
            <Text style={[styles.captionText, { fontSize: '14px' }]}>
                {props.caption} -
            </Text>
            <Text style={[styles.idText, { fontSize: '14px' }]}>
                {props.id}
            </Text>
        </View>
    );
};

export default PrescriptionContents;
