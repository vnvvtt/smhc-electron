import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    FormGroup,
    Form,
    Input,
    CardFooter,
} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import axiosUtils from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import "../../views/Test.css"
import { fetchLabTypeCategories, fetchListOfDoctors, fetchListOfHospitals } from "../../api/api"
import { getCurrentDateAndTime, getCurrentDate } from "../../components/Misc/commonUtils"
import { salutationOptions, genderOptions, lTypeOptions } from "../../components/Misc/DataOptions"
import {
    validateStringData,
    validatePhone,
    validateSex,
    checkForEmptyString,
    validateHospitals,
    validateDoctors,
    validateEmptyData,
    validateDate,
} from "../Validations";
const newUserAPIUrl = "/user";

const RegisterUser = () => {
    const { auth } = useAuth();
    const { accessToken, name: userName } = auth;
    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <div className='content'>
            <Row>
                <Col md="12">
                    <Form id="addUserForm">

                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default RegisterUser
