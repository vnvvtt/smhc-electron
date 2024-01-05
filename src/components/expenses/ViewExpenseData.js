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

const ViewExpenseData = () => {
    const { auth } = useAuth();
    const { accessToken } = auth;
    const { expenseId } = useParams();

    return (
        <div>ViewExpenseData</div>
    )
}

export default ViewExpenseData
