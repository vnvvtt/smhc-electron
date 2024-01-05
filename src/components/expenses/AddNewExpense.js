import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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
    Table,
} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import axiosUtils from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import "../../views/Test.css"
import { fetchExpenseCategories, fetchModesOfPayment } from "../../api/api"
import {
    validateStringData,
    validatePhone,
    validateSex,
    checkForEmptyString,
    GeneratePatientID,
    validateAge,
    validateEmptyData,
    validateAddress,
    validateDate,
    validateHospitals,
    validateDoctors,
} from "../Validations";
const newExpenseAPIUrl = "/expense";

const moment = require('moment-timezone');

const getCurrentDateAndTime = () => {
    const indianTimeZone = 'Asia/Kolkata';
    return moment().tz(indianTimeZone).format('LLL');
};

const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const AddNewExpense = () => {

    const { auth } = useAuth();
    const { accessToken, name: userName } = auth;
    const currentDate = new Date().toISOString().split('T')[0];

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);

    const [expenseCatoeryOptions, setExpenseCategoryOptions] = useState([]);
    const [isExpenseCatoeryOptionsLoading, setIsExpenseCategoryOptionsLoading] = useState(true);
    const [expenseCategoryOptionsError, setExpenseCategoryOptionsError] = useState(null);

    const [modesOfPaymentOptions, setmodesOfPaymentOptions] = useState([]);
    const [ismodesOfPaymentOptionsLoading, setIsmodesOfPaymentOptionsLoading] = useState(true);
    const [modesOfPaymentOptionsError, setmodesOfPaymentOptionsError] = useState(null);

    const [formData, setFormData] = useState({
        expenseReason: "",
        expenseAmount: "0.0",
        expenseCategory: "",
        deductableExpense: "",
        paidBy: "",
        comment: "",
        purpose: "",
        checkNo: "",
        checkDate: "",
        beneficiaryName: "",
        expenseDate: getCurrentDate(),
        createdAt: getCurrentDateAndTime(),
        updatedAt: getCurrentDateAndTime(),
        createdBy: userName,
        updatedBy: userName
    });

    useEffect(() => {

        const fetchExpenseCategory = async () => {
            try {
                const data = await fetchExpenseCategories();
                // const options = data.map((doctor) => ({
                //     value: doctor.id,
                //     label: doctor.name,
                // }));
                setExpenseCategoryOptions(data);
                setIsExpenseCategoryOptionsLoading(false);
            } catch (error) {
                setIsExpenseCategoryOptionsLoading(false);
                if (axios.isCancel(error)) {
                    setExpenseCategoryOptionsError(error);
                    console.log("Request canceled:", error.message);
                } else {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        const fetchPaymentModes = async () => {
            try {
                const data = await fetchModesOfPayment();
                // const options = data.map((doctor) => ({
                //     value: doctor.id,
                //     label: doctor.name,
                // }));
                setmodesOfPaymentOptions(data);
                setIsmodesOfPaymentOptionsLoading(false);
            } catch (error) {
                setIsmodesOfPaymentOptionsLoading(false);
                if (axios.isCancel(error)) {
                    setmodesOfPaymentOptionsError(error);
                    console.log("Request canceled:", error.message);
                } else {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        fetchExpenseCategory();
        fetchPaymentModes();

    }, [accessToken]);

    const navigate = useNavigate();
    const handleChange = (e, id = null) => {
        let name = null;
        let value = null;
        let type = null;
        // Check if the event has a target property (standard form elements)
        if (e.target) {
            ({ name, value, type } = e.target);
        } else {
            // Assuming 'e' is the selected option from react-select
            name = id; // The name of the react-select field
            value = e.value; // The entire selected option object
        }
        // const { name, value, type } = e.target;

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "", // Clear the error message for this field
            });
        }

        // setUnsavedChanges(true);
        // Handle radio button change differently
        if (type === "radio") {
            setFormData({
                ...formData,
                [name]: value,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        // console.log("name=", name.trim());
        // console.log("value=", value.trim());
        if (name.trim() === 'paidBy') {
            if (value.trim() === 'Check') {
                setShowAdditionalFields(true);
            } else {
                setShowAdditionalFields(false);
            }
        }

    };

    const validateForm = () => {
        let newErrors = {};

        // Validate Expense Description
        const isExpenseReasonCheck = checkForEmptyString(formData.expenseReason);
        if (!isExpenseReasonCheck) {
            newErrors.expenseReason = validateStringData(
                formData.expenseReason,
                true,
                true,
                100,
                "Invalid data. Please check!"
            );
        }

        if (isExpenseReasonCheck) {
            newErrors.expenseReason = "Expense reason is required!";
        }

        // Validate Expense Category
        const isExpenseCategoryCheck = checkForEmptyString(formData.expenseCategory);
        if (isExpenseCategoryCheck) {
            newErrors.expenseCategory = "Expense Category is required!";
        }

        // Validate for Expense Amount
        if (checkForEmptyString(formData.expenseAmount)) {
            newErrors.expenseAmount = "Enter Amount!";
        } else {
            if ((formData.expenseAmount <= 0) || (formData.expenseAmount > 10000000)) {
                newErrors.expenseAmount = "Enter valid Amount!";
            }
        }

        // // Validate Comments
        // const isCommentsCheck = checkForEmptyString(formData.comment);
        // if (isCommentsCheck) {
        //     newErrors.comment = "Comments are required!";
        // }

        // // Validate Purpose
        // const isPurposeCheck = checkForEmptyString(formData.purpose);
        // if (isPurposeCheck) {
        //     newErrors.purpose = "Purpose is required!";
        // }

        // Validate Beneficiary Name
        const isBeneficiaryCheck = checkForEmptyString(formData.beneficiaryName);
        if (isBeneficiaryCheck) {
            newErrors.beneficiaryName = "Beneficiary name is required!";
        }

        // Validate Paid By options
        const isPaidByCheck = checkForEmptyString(formData.paidBy);
        if (isPaidByCheck) {
            newErrors.paidBy = "Paid by options is required!";
        }

        // Validate Expense Date
        const isExepnseDateEmpty = checkForEmptyString(formData.expenseDate);
        if (isExepnseDateEmpty) {
            newErrors.expenseDate = "Expense Date is required!";
        } else {
            const isExpenseDateCheck = validateDate(formData.expenseDate);
            if (!isExpenseDateCheck) {
                newErrors.expenseDate = "Invalid Expense Date!";
            }
        }
        if (formData.expenseDate > currentDate) {
            // Handle end date greater than current date
            newErrors.expenseDate = "Expense Date should be less than or equal to the current date.";
        }

        setErrors(newErrors);
        const isDataValid = Object.values(newErrors).every((error) => !error);
        return isDataValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isDataValid = validateForm();
        if (!isDataValid) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        console.log("SAVING EXPENSE DATA");
        console.log("Form Data=", formData);
        try {
            await addExpenseBill.mutateAsync(formData);
        } catch (err) {
            setIsLoading(false);
            // Handle errors
            if (err.response?.status === 409) {
                setErrors("Expense data not valid!");
            } else {
                console.error("Error adding expense:", err.message);
            }
        }
    };

    const cancelTokenSource = axios.CancelToken.source();
    const addExpenseBill = useMutation(
        async (formData) => {
            const response = await axiosUtils.post(
                newExpenseAPIUrl,
                JSON.stringify(formData),
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                    cancelToken: cancelTokenSource.token,
                }
            );
            return response;
        },
        {
            onSuccess: (responseData) => {
                navigate(`/admin/userdashboard`);
            },
            onError: (err) => {
                setIsLoading(false);
                setErrors("No Server Response", err.message);
            },
        }
    );

    if (isExpenseCatoeryOptionsLoading && ismodesOfPaymentOptionsLoading) {
        return <div>Loading...</div>;
    } else if (expenseCategoryOptionsError) {
        return <div>Error fetching Expense Categories data</div>;
    } else if (modesOfPaymentOptionsError) {
        return <div>Error fetching Mode of Payments data</div>;
    } else {
    }
    return (
        <div className='content'>
            <Row>
                <Col md="12">
                    <Form id="addExpenseForm" onSubmit={handleSubmit}>
                        <Card className="card-user">
                            <CardTitle className='p-2'><strong>Enter Expense Data</strong></CardTitle>
                            <CardBody>
                                <Row>
                                    <Col className="pr-1" md="6">
                                        <FormGroup>
                                            <label htmlFor='expenseCategory' className='addPLabel'>Choose Expense Category</label>
                                            <select
                                                style={{ width: "100%" }}
                                                className="relative m-1 p-1 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                id="expenseCategory"
                                                name="expenseCategory"
                                                value={formData.expenseCategory}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            >
                                                <option value="">Choose Expense Category</option>
                                                {expenseCatoeryOptions.map((unit) => (
                                                    <option
                                                        key={unit.label}
                                                        value={unit.value}
                                                    >
                                                        {unit.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.expenseCategory && (
                                                <div className="text-danger">{errors.expenseCategory}</div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col className="pr-1" md="6">
                                        <FormGroup>
                                            <label htmlFor='expenseDate' className='addPLabel'>Expense Date</label>
                                            <Input
                                                type="date"
                                                id="expenseDate"
                                                name="expenseDate"
                                                placeholder="Enter expense date"
                                                value={formData.expenseDate}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                autoComplete='off'
                                            />
                                            {errors.expenseDate && (
                                                <div className="text-danger">{errors.expenseDate}</div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4">
                                        <FormGroup>
                                            <label htmlFor='expenseAmount' className='addPLabel'>
                                                Expense Amount
                                            </label>
                                            <Input
                                                type="number"
                                                id="expenseAmount"
                                                name="expenseAmount"
                                                value={formData.expenseAmount}
                                                onChange={handleChange}
                                                placeholder="Expense amount"
                                                disabled={isLoading}
                                            />
                                            {errors.expenseAmount && (
                                                <div className="text-danger">{errors.expenseAmount}</div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col md="8">
                                        <FormGroup>
                                            <label htmlFor='expenseReason' className='addPLabel'>Expense Description</label>
                                            <Input
                                                type="textarea"
                                                id="expenseReason"
                                                name="expenseReason"
                                                placeholder="Reason for expense"
                                                value={formData.expenseReason}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                autoComplete='off'
                                                style={{ marginLeft: "10px", textAlign: "justify" }}
                                            />
                                            {errors.expenseReason && (
                                                <div className="text-danger">{errors.expenseReason}</div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4">
                                        <FormGroup>
                                            <label htmlFor='comment' className='addPLabel'>
                                                Comments
                                            </label>
                                            <Input
                                                type="textarea"
                                                id="comment"
                                                name="comment"
                                                placeholder="Comment"
                                                value={formData.comment}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                autoComplete='off'
                                                style={{ marginLeft: "10px", textAlign: "justify" }}
                                            />
                                            {/* {errors.comment && (
                                                <div className="text-danger">{errors.comment}</div>
                                            )} */}
                                        </FormGroup>
                                    </Col>
                                    <Col md="8">
                                        <FormGroup>
                                            <label htmlFor='purpose' className='addPLabel'>Purpose</label>
                                            <Input
                                                type="textarea"
                                                id="purpose"
                                                name="purpose"
                                                placeholder="Enter purpose"
                                                value={formData.purpose}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                autoComplete='off'
                                                style={{ marginLeft: "10px", textAlign: "justify" }}
                                            />
                                            {/* {errors.purpose && (
                                                <div className="text-danger">{errors.purpose}</div>
                                            )} */}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="pr-1" md="6">
                                        <FormGroup>
                                            <label htmlFor='paidBy' className='addPLabel'>Choose mode of payment</label>
                                            <select
                                                style={{ width: "100%" }}
                                                className="relative m-1 p-1 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                id="paidBy"
                                                name="paidBy"
                                                value={formData.paidBy}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            >
                                                <option value="">Choose Mode of Payment</option>
                                                {modesOfPaymentOptions.map((unit) => (
                                                    <option
                                                        key={unit.label}
                                                        value={unit.value}
                                                    >
                                                        {unit.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.paidBy && (
                                                <div className="text-danger">{errors.paidBy}</div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label htmlFor='beneficiaryName' className='addPLabel'>Beneficiary Name</label>
                                            <Input
                                                type="text"
                                                id="beneficiaryName"
                                                name="beneficiaryName"
                                                placeholder="Enter beneficiary name"
                                                value={formData.beneficiaryName}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                autoComplete='off'
                                            />
                                            {errors.beneficiaryName && (
                                                <div className="text-danger">{errors.beneficiaryName}</div>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {showAdditionalFields && (
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <label htmlFor='checkNo' className='addPLabel'>Check Number</label>
                                                <Input
                                                    type="text"
                                                    id="checkNo"
                                                    name="checkNo"
                                                    placeholder="Enter check number"
                                                    value={formData.checkNo}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                    autoComplete='off'
                                                />
                                            </FormGroup>

                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <label htmlFor='checkDate' className='addPLabel'>Check Date</label>
                                                <Input
                                                    type="date"
                                                    id="checkDate"
                                                    name="checkDate"
                                                    placeholder="Enter check date"
                                                    value={formData.checkDate}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                    autoComplete='off'
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                )}
                                <Row>
                                    <div className="update ml-auto mr-auto">
                                        <Button
                                            className="btn-round float-right"
                                            color="primary"
                                            type="submit"
                                        >
                                            Save
                                        </Button>
                                        {errors.submitdata && (
                                            <div className="text-danger">{errors.submitdata}</div>
                                        )}
                                    </div>
                                </Row>
                            </CardBody>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </div>
    )

}

export default AddNewExpense
