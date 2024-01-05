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
const newBillingAPIUrl = "/billing";

const AddNewBill = () => {

    const { auth } = useAuth();
    const { accessToken, name: userName } = auth;
    const currentDate = new Date().toISOString().split('T')[0];

    const [labTypeCategories, setLabTypeCategories] = useState([]);
    const [islabTypeCategoriesLoading, setIsLabTypeCategoriesLoading] = useState(true);
    const [labTypeCategoriesError, setLabTypeCategoriesError] = useState(null);

    const [selectedLabType, setSelectedLabType] = useState(null);
    const [lineItems, setLineItems] = useState([]);
    const [disabledLabTypes, setDisabledLabTypes] = useState([]);

    const [doctorOptions, setDoctorOptions] = useState([]);
    const [isDoctorOptionsLoading, setIsDoctorOptionsLoading] = useState(true);
    const [doctorOptionsError, setDoctorOptionsError] = useState(null);

    const [hospitalOptions, setHospitalOptions] = useState([]);
    const [isHospitalOptionsLoading, setIsHospitalOptionsLoading] = useState(true);
    const [hospitalOptionsError, setHospitalOptionsError] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [discount, setDiscount] = useState("");

    const [formData, setFormData] = useState({
        salutation: "Mrs",
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        phone: "",
        address: "",
        place: "",
        admissionDate: getCurrentDateAndTime(),
        age: "",
        gender: "Female",
        referredbyDoctor: "",
        newDoctorName: "",
        referredbyHospital: "",
        newHospitalName: "",
        labtype: "",
        blockscount: "0",
        slidescount: "0",
        ipno: "",
        createdAt: getCurrentDateAndTime(),
        createdBy: userName,
        updatedAt: getCurrentDateAndTime(),
        updatedBy: userName,
        cashPayment: "0",
        digitalPayment: "0",
        lab_type_id: "",
        billDate: getCurrentDate()
    });

    // Fetch lab type categories from API
    useEffect(() => {

        const fetchLabTypes = async () => {
            try {
                const categories = await fetchLabTypeCategories(accessToken);
                setLabTypeCategories(categories);
                setIsLabTypeCategoriesLoading(false);
            } catch (error) {
                if (axios.isCancel(error)) {
                    setLabTypeCategoriesError(error);
                    console.log("Request canceled:", error.message);
                } else {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        const fetchDoctors = async () => {
            try {
                const data = await fetchListOfDoctors(accessToken);
                const options = data.map((doctor) => ({
                    value: doctor.id,
                    label: doctor.name,
                }));

                setDoctorOptions(options);
                setIsDoctorOptionsLoading(false);
            } catch (error) {
                setIsDoctorOptionsLoading(false);
                if (axios.isCancel(error)) {
                    setDoctorOptionsError(error);
                    console.log("Request canceled:", error.message);
                } else {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        const fetchHospitals = async () => {
            try {
                const data = await fetchListOfHospitals(accessToken);
                const options = data.map((hospital) => ({
                    value: hospital.id,
                    label: hospital.name,
                }));

                setHospitalOptions(options);
                setIsHospitalOptionsLoading(false);
            } catch (error) {
                setIsHospitalOptionsLoading(false);
                if (axios.isCancel(error)) {
                    setHospitalOptionsError(error);
                    console.log("Request canceled:", error.message);
                } else {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        fetchLabTypes();
        fetchDoctors();
        fetchHospitals();

    }, [accessToken]);

    const handleLabTypeChange = (selectedOption) => {
        setSelectedLabType(selectedOption);
    };

    // Calculate total net amount whenever line items or discount change
    const totalAmount = (lineItems.reduce((total, item) => total + item.rate, 0));
    // const totalNetAmount = lineItems.reduce((total, item) => total + item.rate, 0) - discount;
    const discount_input = parseFloat(discount) || 0;
    const netAmount = (totalAmount - (totalAmount * (discount_input * 0.01)));

    const handleAddItem = () => {
        if (selectedLabType) {
            const newLineItem = {
                id: selectedLabType.data.id,
                dept: selectedLabType.data.dept,
                code: selectedLabType.data.code,
                name: selectedLabType.data.name,
                rate: selectedLabType.data.rate,
            };

            setLineItems([...lineItems, newLineItem]);
            setDisabledLabTypes([...disabledLabTypes, selectedLabType.value]);
            setSelectedLabType(null);
            setErrors({
                ...errors,
                selectedLabType: "", // Clear the error message for this field
            });
        }
    };

    const handleDiscountChange = (event) => {
        const newDiscount = event.target.value;
        setDiscount(newDiscount);
    };

    const handleDeleteItem = (lineItemId, deletedLabType) => {
        const newLineItems = lineItems.filter(item => item.id !== lineItemId);
        setLineItems(newLineItems);

        const newDisabledLabTypes = disabledLabTypes.filter(type => type !== deletedLabType);
        setDisabledLabTypes(newDisabledLabTypes);
    };

    // Format lab type data for react-select
    const labTypeOptions = labTypeCategories.map(type => ({
        value: type.name,
        label: type.name + " - " + type.dept,
        data: type,
        isDisabled: disabledLabTypes.includes(type.name),
    }));

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
    };

    const validateForm = () => {
        let newErrors = {};
        // Validate Phone
        const isContactPhoneCheck = checkForEmptyString(formData.phone);
        if (isContactPhoneCheck) {
            newErrors.phone = "Contact Number is required!";
        } else {
            newErrors.phone = validatePhone(formData.phone);
        }

        // Validate First Name
        const isFirstNamecheck = checkForEmptyString(formData.firstName);
        if (!isFirstNamecheck) {
            newErrors.firstName = validateStringData(
                formData.firstName,
                true,
                true,
                100,
                "Invalid data. Please check!"
            );
        }

        if (isFirstNamecheck) {
            newErrors.firstName = "Name is required!";
        }

        // Validate Address
        if (checkForEmptyString(formData.address)) {
            newErrors.address = "Address needs to be entered!";
        }

        // Validate for Age
        if (checkForEmptyString(formData.age)) {
            newErrors.age = "Enter Age!";
        } else {
            if ((formData.age <= 0) || (formData.age > 100)) {
                newErrors.age = "Enter valid Age!";
            }
        }

        // Validate Gender
        newErrors.gender = validateSex(formData.gender);

        // Validate Referral Doctor
        if (checkForEmptyString(formData.newDoctorName)) {
            newErrors.referredbyDoctor = validateDoctors(formData.referredbyDoctor);
        } else {
            const isDoctorChosen = checkForEmptyString(formData.referredbyDoctor);
            if (!isDoctorChosen) {
                formData.newDoctorName = "";
            }
        }

        // Validate Referral Hospital
        if (checkForEmptyString(formData.newHospitalName)) {
            newErrors.referredbyHospital = validateHospitals(formData.referredbyHospital);
        } else {
            const isHospitalChosen = checkForEmptyString(formData.referredbyHospital);
            if (!isHospitalChosen) {
                formData.newHospitalName = "";
            }
        }

        // Check if any Category has been chosen
        if (lineItems && lineItems.length <= 0) {
            newErrors.selectedLabType = "Please choose at least one Lab Type Category!";
        }

        // Validate Salutation
        newErrors.salutation = validateEmptyData(formData.salutation);

        // Validate Bill Date
        const isBillDateEmpty = checkForEmptyString(formData.billDate);
        if (isBillDateEmpty) {
            newErrors.billDate = "Bill Date is required!";
        } else {
            const isBillDateCheck = validateDate(formData.billDate);
            if (!isBillDateCheck) {
                newErrors.billDate = "Invalid Expense Date!";
            }
        }
        if (formData.billDate > currentDate) {
            // Handle end date greater than current date
            newErrors.billDate = "Bill Date should be less than or equal to the current date.";
        }

        // Check if Payment has been made
        try {
            const cash_payment_number = parseFloat(formData.cashPayment || 0.0);
            const digital_payment_number = parseFloat(formData.digitalPayment || 0.0);
            const net_amount = parseFloat(netAmount);

            const isCashValid = !isNaN(cash_payment_number);
            const isDigitalValid = !isNaN(digital_payment_number);

            console.log("cash_payment_number=", cash_payment_number);
            console.log("digital_payment_number=", digital_payment_number);
            console.log("Sum=", (cash_payment_number + digital_payment_number));

            if (isCashValid && isDigitalValid && (cash_payment_number + digital_payment_number) === net_amount) {
                newErrors.submitdata = "";
            } else {
                newErrors.submitdata = "Please check! (Cash payment + Digital payment) is not equal to Net Amount.";
            }
        } catch (error) {
            // Handle the error, if needed
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
        // console.log("SAVING BILL DATA");
        // console.log("Form Data=", formData);
        // console.log("Category Data=", lineItems);
        // console.log("total_amount=", totalAmount);
        // console.log("net_amount=", netAmount);
        const combinedData = {
            formData,
            lineItems,
            totalAmount,
            netAmount,
            discount
        };
        // console.log("combined data=", combinedData);
        try {
            await addNewBill.mutateAsync(combinedData);
        } catch (err) {
            setIsLoading(false);
            // Handle errors
            if (err.response?.status === 409) {
                setErrors("Patient already exists!");
            } else {
                console.error("Error adding patient:", err.message);
            }
        }
    };

    const cancelTokenSource = axios.CancelToken.source();
    const addNewBill = useMutation(
        async (combinedData) => {
            const response = await axiosUtils.post(
                newBillingAPIUrl,
                JSON.stringify(combinedData),
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
                const billingId = responseData.data;
                navigate(`/admin/generatebill/${billingId}`);
            },
            onError: (err) => {
                setIsLoading(false);
                setErrors("No Server Response", err.message);
            },
        }
    );

    if (islabTypeCategoriesLoading && isDoctorOptionsLoading && isHospitalOptionsLoading) {
        return <div>Loading...</div>;
    } else if (labTypeCategoriesError) {
        return <div>Error fetching Lab Categories data</div>;
    } else if (doctorOptionsError) {
        return <div>Error fetching Doctors data</div>;
    } else if (hospitalOptionsError) {
        return <div>Error fetching Hospitals data</div>;
    } else {
        return (
            <div className='content'>
                <Row>
                    <Col md="12">
                        <Form id="addBillForm" onSubmit={handleSubmit}>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <label htmlFor='billDate' className='addPLabel'>Bill Date</label>
                                        <Input
                                            type="date"
                                            id="billDate"
                                            name="billDate"
                                            placeholder="Enter bill date"
                                            value={formData.billDate}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            autoComplete='off'
                                        />
                                        {errors.billDate && (
                                            <div className="text-danger">{errors.billDate}</div>
                                        )}
                                    </FormGroup>

                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <Card className="card-user">
                                        <CardTitle className='p-2'><strong>Enter Patient Data</strong>
                                        </CardTitle>
                                        <CardBody>
                                            <Row>
                                                <Col md="8">
                                                    <FormGroup>
                                                        <label htmlFor='firstName' className='addPLabel'>Patient Name *</label>
                                                        <Input
                                                            type="text"
                                                            name="firstName"
                                                            id="firstName"
                                                            placeholder="Patient's name"
                                                            autoComplete="off"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            disabled={isLoading}
                                                            maxLength={100}
                                                        />
                                                        {errors.firstName && (
                                                            <div className="text-danger">{errors.firstName}</div>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <label htmlFor='age' className='addPLabel'>
                                                            Age *
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            id="age"
                                                            name="age"
                                                            value={formData.age}
                                                            onChange={handleChange}
                                                            placeholder="Patient's age"
                                                            disabled={isLoading}
                                                        />
                                                        {errors.age && (
                                                            <div className="text-danger">{errors.age}</div>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <label htmlFor='address' className='addPLabel'>Address *</label>
                                                        <Input
                                                            type="textarea"
                                                            id="address"
                                                            name="address"
                                                            placeholder="Address"
                                                            value={formData.address}
                                                            onChange={handleChange}
                                                            disabled={isLoading}
                                                            autoComplete='off'
                                                        />
                                                        {errors.address && (
                                                            <div className="text-danger">{errors.address}</div>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Contact Number</label>
                                                                <Input
                                                                    type="number"
                                                                    id="phone"
                                                                    name="phone"
                                                                    value={formData.phone}
                                                                    onChange={handleChange}
                                                                    placeholder="Patient's contact number"
                                                                    disabled={isLoading}
                                                                    maxLength={10}
                                                                    autoComplete="new-password"
                                                                />
                                                                {errors.phone && (
                                                                    <div className="text-danger">{errors.phone}</div>
                                                                )}
                                                            </FormGroup>

                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label className='addPLabel'>Salutation</label>
                                                                <select
                                                                    options={salutationOptions}
                                                                    style={{ width: "100%" }}
                                                                    className="relative p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                    id="salutation"
                                                                    name="salutation"
                                                                    value={formData.salutation || salutationOptions[0].value}
                                                                    onChange={handleChange}
                                                                    disabled={isLoading}
                                                                >
                                                                    {salutationOptions.map((unit) => (
                                                                        <option
                                                                            key={unit.label}
                                                                            value={unit.value}
                                                                        >
                                                                            {unit.label}
                                                                        </option>
                                                                    ))}

                                                                </select>
                                                                {errors.salutation && (
                                                                    <div className="text-danger">{errors.salutation}</div>
                                                                )}
                                                            </FormGroup>

                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <label className='addPLabel'>
                                                            Place
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            id="place"
                                                            name="place"
                                                            value={formData.place}
                                                            onChange={handleChange}
                                                            placeholder="Patient's place"
                                                            disabled={isLoading}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <label htmlFor='gender' className='addPLabel'>Gender *</label>
                                                        <select
                                                            style={{ width: "100%" }}
                                                            className="relative m-1 p-1 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                            id="gender"
                                                            name="gender"
                                                            value={formData.gender || genderOptions[0].value}
                                                            onChange={handleChange}
                                                            disabled={isLoading}
                                                        >
                                                            {genderOptions.map((unit) => (
                                                                <option
                                                                    key={unit.label}
                                                                    value={unit.value}
                                                                >
                                                                    {unit.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.gender && (
                                                            <div className="text-danger">{errors.gender}</div>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                    <Card className="card-user">
                                        <CardTitle className='p-2'><strong>Enter Miscellaneous Data</strong>
                                        </CardTitle>
                                        <CardBody>

                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label htmlFor='ipno' className='addPLabel'>IP Number</label>
                                                        <Input
                                                            type="text"
                                                            name="ipno"
                                                            id="ipno"
                                                            placeholder="In Patient Number"
                                                            autoComplete="off"
                                                            value={formData.ipno}
                                                            onChange={handleChange}
                                                            disabled={isLoading}
                                                            maxLength={100}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <label htmlFor='labtype' className='addPLabel'>Histo/Cyto</label>
                                                        <select
                                                            style={{ width: "100%" }}
                                                            className="relative m-1 p-1 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                            id="labtype"
                                                            name="labtype"
                                                            value={formData.labtype}
                                                            onChange={handleChange}
                                                            disabled={isLoading}
                                                        >
                                                            {lTypeOptions.map((unit) => (
                                                                <option
                                                                    key={unit.label}
                                                                    value={unit.value}
                                                                >
                                                                    {unit.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </FormGroup>

                                                </Col>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <label htmlFor='slidescount' className='addPLabel'>
                                                            Slides
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            id="slidescount"
                                                            name="slidescount"
                                                            value={formData.slidescount}
                                                            onChange={handleChange}
                                                            placeholder="Slides"
                                                            disabled={isLoading}
                                                        />
                                                    </FormGroup>

                                                </Col>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <label htmlFor='blockscount' className='addPLabel'>
                                                            Blocks
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            id="blockscount"
                                                            name="blockscount"
                                                            value={formData.blockscount}
                                                            onChange={handleChange}
                                                            placeholder="Blocks"
                                                            disabled={isLoading}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md="6">
                                    <Card className="card-user">
                                        <CardTitle className='p-2'><strong>Enter Doctor Referral Data</strong></CardTitle>
                                        <CardBody>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label htmlFor='referredbyDoctor' className='addPLabel'>Referred by Doctor *</label>
                                                        <select
                                                            style={{ width: "100%" }}
                                                            className="relative m-2 p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                            id="referredbyDoctor"
                                                            name="referredbyDoctor"
                                                            value={formData.referredbyDoctor}
                                                            onChange={handleChange}
                                                            disabled={isLoading}
                                                        >
                                                            <option value="">Choose Doctor</option>
                                                            {doctorOptions.map((unit) => (
                                                                <option
                                                                    key={unit.label}
                                                                    value={unit.value}
                                                                >
                                                                    {unit.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.referredbyDoctor && (
                                                            <div className="text-danger">{errors.referredbyDoctor}</div>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label className='addPLabel'>
                                                            Enter Doctor Name if not found in dropdown
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            id="newDoctorName"
                                                            name="newDoctorName"
                                                            value={formData.newDoctorName}
                                                            onChange={handleChange}
                                                            placeholder="new Doctor's Name"
                                                            disabled={isLoading}
                                                        />
                                                        {errors.newDoctorName && (
                                                            <div className="text-danger">{errors.newDoctorName}</div>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                    <Card className="card-user">
                                        <CardTitle className='p-2'><strong>Enter Hospital referral Data</strong></CardTitle>
                                        <CardBody>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label htmlFor='referredbyHospital' className='addPLabel'>Referred by Hospital *</label>
                                                        <select
                                                            style={{ width: "100%" }}
                                                            className="relative m-2 p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                            id="referredbyHospital"
                                                            name="referredbyHospital"
                                                            value={formData.referredbyHospital}
                                                            onChange={handleChange}
                                                            disabled={isLoading}
                                                        >
                                                            <option value="">Choose Hospital</option>
                                                            {hospitalOptions.map((unit) => (
                                                                <option
                                                                    key={unit.label}
                                                                    value={unit.value}
                                                                >
                                                                    {unit.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.referredbyHospital && (
                                                            <div className="text-danger">{errors.referredbyHospital}</div>
                                                        )}
                                                    </FormGroup>

                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label className='addPLabel'>
                                                            Enter Hospital Name if not found in dropdown
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            id="newHospitalName"
                                                            name="newHospitalName"
                                                            value={formData.newHospitalName}
                                                            onChange={handleChange}
                                                            placeholder="new Hospital's Name"
                                                            disabled={isLoading}
                                                        />
                                                        {errors.newHospitalName && (
                                                            <div className="text-danger">{errors.newHospitalName}</div>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                    <Card className="card-user">
                                        <CardTitle className='p-2'><strong>Enter Lab Test Categories</strong></CardTitle>
                                        <CardBody>
                                            <Row>
                                                <Col className="pr-1" md="6">
                                                    <FormGroup>
                                                        <label>Choose Lab Type *</label>
                                                        <Select
                                                            className="select-dropdown"
                                                            id="selectedLabType"
                                                            name="selectedLabType"
                                                            value={selectedLabType}
                                                            onChange={handleLabTypeChange}
                                                            options={labTypeOptions}
                                                            isSearchable
                                                            placeholder="Select Lab Type"
                                                            disabled={isLoading}
                                                        />
                                                        {errors.selectedLabType && (
                                                            <div className="text-danger">{errors.selectedLabType}</div>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col className="pl-1" md="6">
                                                    <FormGroup>
                                                        <Button onClick={handleAddItem} disabled={!selectedLabType} className='mt-4'>Add Item</Button>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <div className="container bootdey">
                                                        <div className="row invoice row-printable">
                                                            <div className="col-md-12">

                                                                <div className="panel panel-default plain" id="dash_0">

                                                                    <div className="panel-body p30">
                                                                        <div className="row">

                                                                            <div className="col-lg-12">

                                                                                <div className="invoice-items">
                                                                                    <div className="table-responsive" style={{/*overflow: hidden; outline: none;*/ }} tabIndex="0">
                                                                                        <table className="table table-bordered">
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th className="per10 text-center">Sl No</th>
                                                                                                    <th className="per10 text-center">Type</th>
                                                                                                    <th className="per5 text-center">Code</th>
                                                                                                    <th className="per60 text-center">Description</th>
                                                                                                    <th className="per15 text-center">Total</th>
                                                                                                    <th className="per25 text-center">Delete</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {lineItems.map((item, index) => (
                                                                                                    <tr key={item.id}>
                                                                                                        <td>{index + 1}</td>
                                                                                                        <td>{item.dept}</td>
                                                                                                        <td>{item.code}</td>
                                                                                                        <td>{item.name}</td>
                                                                                                        <td>{item.rate}</td>
                                                                                                        <td>
                                                                                                            <Button color="link" onClick={() => handleDeleteItem(item.id, item.name)}>
                                                                                                                <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} />
                                                                                                            </Button>

                                                                                                        </td>
                                                                                                    </tr>
                                                                                                ))}
                                                                                            </tbody>
                                                                                            <tfoot>
                                                                                                <tr>
                                                                                                    <th colSpan="4" style={{ textAlign: 'right' }}>Total Amount</th>
                                                                                                    <th id="totalamount" name="totalamount" className="text-right">{totalAmount}</th>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th colSpan="4" style={{ textAlign: 'right' }}>Discount (%)</th>
                                                                                                    <th className="text-center"><Input id="discount" name="discount" type="number" placeholder="Discount" value={discount} onChange={handleDiscountChange} className='sm' /></th>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th colSpan="4" style={{ textAlign: 'right' }}>Net Amount</th>
                                                                                                    <th className="text-right">{netAmount}</th>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th colSpan="4" style={{ textAlign: 'right' }}>Cash payment</th>
                                                                                                    <th>
                                                                                                        <Input
                                                                                                            type="number"
                                                                                                            id="cashPayment"
                                                                                                            name="cashPayment"
                                                                                                            value={formData.cashPayment}
                                                                                                            onChange={handleChange}
                                                                                                            placeholder="Cash payment made"
                                                                                                            disabled={isLoading}
                                                                                                            maxLength={15}
                                                                                                        />

                                                                                                    </th>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <th colSpan="4" style={{ textAlign: 'right' }}>Digital payment</th>
                                                                                                    <th>
                                                                                                        <Input
                                                                                                            type="number"
                                                                                                            id="digitalPayment"
                                                                                                            name="digitalPayment"
                                                                                                            value={formData.digitalPayment}
                                                                                                            onChange={handleChange}
                                                                                                            placeholder="Digital payment made"
                                                                                                            disabled={isLoading}
                                                                                                            maxLength={15}
                                                                                                        />

                                                                                                    </th>
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
                                                </Col>

                                            </Row>
                                            <Row>
                                                <div className="update ml-auto mr-auto">
                                                    <Button
                                                        className="btn-round float-right"
                                                        color="primary"
                                                        type="submit"
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <FontAwesomeIcon icon={faSpinner} spin />
                                                                Please wait...
                                                            </>
                                                        ) : (
                                                            "Save Bill & Print"
                                                        )}
                                                    </Button>
                                                    {errors.submitdata && (
                                                        <div className="text-danger">{errors.submitdata}</div>
                                                    )}
                                                </div>
                                            </Row>
                                        </CardBody>
                                        <CardFooter>Fields marked with * are mandatory<br />Please ensure that payment is received and entered before generating the bill. (Cash payment + Digital payment) = Net Amount - Only then the system allows you to generate the bill. </CardFooter>
                                    </Card>
                                </Col>
                            </Row>

                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }

}

export default AddNewBill
