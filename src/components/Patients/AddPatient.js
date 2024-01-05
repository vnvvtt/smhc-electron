import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
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
} from "reactstrap";

import axiosUtils from "../../api/axios";
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
} from "../Validations";
import "../../views/Test.css";
import { fetchDoctorsList, fetchPatientData } from '../../api/api';

const salutationOptions = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Sri', label: 'Sri' },
    { value: 'Smt', label: 'Smt' },
    { value: 'Master', label: 'Master' },
    { value: 'Kumari', label: 'Kumari' },
    { value: 'Dr', label: 'Doctor' },
    { value: 'Miss', label: 'Miss' }
]

const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
]

const mstatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' }
]

const relationshipOptions = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Husband', label: 'Husband' },
    { value: 'Wife', label: 'Wife' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
]

const bloodGroupOptions = [
    { value: 'A+ve', label: 'A Positive' },
    { value: 'A-ve', label: 'A Negative' },
    { value: 'B+ve', label: 'B Positive' },
    { value: 'B-ve', label: 'B Negative' },
    { value: 'AB+ve', label: 'AB Positive' },
    { value: 'AB-ve', label: 'AB Negative' },
    { value: 'O+ve', label: 'O Positive' },
    { value: 'O-ve', label: 'AONegative' },
]

const newPatientAPIUrl = "/patients/createpatient";
const editPatientAPIUrl = "/patients";

const AddPatient = ({ isEdit, patientId, doctorId, accessToken, orgId }) => {

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleGoBack = () => {
        navigate(`/admin/dashboard`);
    };

    const [doctorsList, setDoctorsList] = useState([]);
    const [isDoctorsListLoading, setIsDoctorsListLoading] = useState(true);
    const [doctorsListError, setDoctorsListError] = useState(null);

    let pageTitle = "Add Patient";
    if (isEdit) {
        pageTitle = "Edit Patient";
    }
    const [isLoading, setIsLoading] = useState(false);

    const [currentStep, setCurrentStep] = useState(1);
    const goToNextStep = () => {
        let isDataValid = true;
        setIsLoading(true);
        if (currentStep === 1) {
            // Validate data entered in Step 1
            let new1Errors = {};
            // Name
            new1Errors.firstName = validateStringData(
                formData.firstName,
                true,
                true,
                100,
                "Invalid data. Please check!"
            );
            // Age
            new1Errors.age = validateAge(formData.age);
            // Phone
            new1Errors.phone = validatePhone(formData.phone);
            // Marital Status
            new1Errors.maritalStatus = validateEmptyData(formData.maritalStatus);
            // Gender
            new1Errors.gender = validateEmptyData(formData.gender);
            // Salutation
            new1Errors.salutation = validateEmptyData(formData.salutation);
            // Blood Group
            new1Errors.bloodgroup = validateEmptyData(formData.bloodgroup);

            setErrors(new1Errors);
            isDataValid = Object.values(new1Errors).every((error) => !error);
            new1Errors = {};
        } else if (currentStep === 2) {
            let new2Errors = {};
            // Address            
            if (checkForEmptyString(formData.address)) {
                new2Errors.address = "Address is required!";
            } else {
                new2Errors.address = validateAddress(formData.address);
            }
            // Emergency Contact Name
            new2Errors.emergencyContactName = validateEmptyData(formData.emergencyContactName);
            // Emergency Contact Relationship
            new2Errors.relationship = validateEmptyData(formData.relationship);

            setErrors(new2Errors);
            isDataValid = Object.values(new2Errors).every((error) => !error);
            new2Errors = {};

        } else if (currentStep === 3) {
            let new3Errors = {};
            // Admission Date
            if (!validateDate(formData.admissionDate)) {
                new3Errors.admissionDate = "Please enter valid date";
            }
            // Assign Doctor
            new3Errors.assignedDoctorId = validateEmptyData(formData.assignedDoctorId);

            setErrors(new3Errors);
            isDataValid = Object.values(new3Errors).every((error) => !error);
            new3Errors = {};
        }
        setIsLoading(false);
        if (isDataValid) {
            setCurrentStep(currentStep + 1);
        }
    };
    const goToPrevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        salutation: "Mr",
        patientId: "",
        orgId: orgId?.toString() || "",
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        admissionDate: getCurrentDate(),
        age: "",
        doctorId: doctorId?.toString() || "",
        gender: "Male",
        maritalStatus: "Single",
        preferredMethodofContact: "phone",
        inoutpatient: "outpatient",
        pre_existing_conditions: "",
        allergies: " ",
        emergencyContactName: " ",
        emergencyContactPhone: " ",
        relationship: "Husband",
        bloodgroup: "A+ve",
        referredby: "",
        assignedDoctorId: "",
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate()
    });

    useEffect(() => {

        const fetchDoctorsData = async () => {
            try {
                const data = await fetchDoctorsList(orgId);
                setDoctorsList(data);
                setIsDoctorsListLoading(false);
            } catch (error) {
                setDoctorsListError(error);
                setIsDoctorsListLoading(false);
            }
        };

        fetchDoctorsData();

        if (isEdit && patientId) {
            const fetchData = async () => {
                try {
                    const patientDetails = await fetchPatientData({ doctorId, patientId, accessToken });
                    if (patientDetails && patientDetails.length > 0) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            salutation: patientDetails[0].salutation || "Mr",
                            patientId: patientId,
                            orgId: orgId?.toString() || "",
                            firstName: patientDetails[0].firstname || "",
                            lastName: patientDetails[0].lastname || "",
                            middleName: patientDetails[0].middlename || "",
                            email: patientDetails[0].email || "",
                            phone: patientDetails[0].phone || "",
                            address: patientDetails[0].address || "",
                            dateOfBirth: patientDetails[0].dateofbirth || "",
                            admissionDate: patientDetails[0].admissiondate || getCurrentDate(),
                            age: patientDetails[0].age || "",
                            doctorId: doctorId?.toString() || "",
                            gender: patientDetails[0].gender || "Male",
                            maritalStatus: patientDetails[0].maritalStatus || "Married",
                            preferredMethodofContact: patientDetails[0].preferredMethodofContact || "phone",
                            inoutpatient: patientDetails[0].inoutpatient || "outpatient",
                            pre_existing_conditions: patientDetails[0].pre_existing_conditions || "",
                            allergies: patientDetails[0].allergies || " ",
                            emergencyContactName: patientDetails[0].emergencycontactname || " ",
                            emergencyContactPhone: patientDetails[0].emergencycontactphone || " ",
                            relationship: patientDetails[0].relationship || "Husband",
                            bloodgroup: patientDetails[0].bloodgroup || "A+ve",
                            assignedDoctorId: patientDetails[0].assigneddoctorid.toString(),
                            referredby: patientDetails[0].referredby || "",
                            createdAt: patientDetails[0].createdat || getCurrentDate(),
                            updatedAt: getCurrentDate()
                        }));

                    }


                } catch (error) {
                    console.error("Error fetching patient data:", error.message);
                }
            };

            fetchData();

        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                admissionDate: getCurrentDate(),
                createdAt: getCurrentDate(),
            }));
        }

    }, [isEdit, doctorId, orgId, patientId, accessToken]);

    // useEffect(() => {
    //     if (orgId) {
    //         setFormData((prevFormData) => ({
    //             ...prevFormData,
    //             orgId: orgId.toString() || "",
    //             doctorId: doctorId?.toString() || "",
    //         }));

    //     }
    // }, [orgId, doctorId]);

    const [errors, setErrors] = useState({});

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
        const newErrors = {};

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
        } else {
            if (!isEdit) {
                formData.patientId = "SMHC" + GeneratePatientID(formData.firstName);
            }
        }

        if (checkForEmptyString(formData.age)) {
            // newErrors.dateOfBirth = "Enter Date of Birth or Age!";
            newErrors.age = "Enter Age!";
        } else {
            if ((formData.age <= 0) || (formData.age > 100)) {
                newErrors.age = "Enter valid Age!";
            }
        }

        // Validate Phone
        newErrors.phone = validatePhone(formData.phone);

        // Validate Gender
        newErrors.gender = validateSex(formData.gender);

        // Validate MaritalStatus
        if (checkForEmptyString(formData.maritalStatus)) {
            newErrors.maritalStatus = "Marital Status needs to be chosen!";
        }

        // Validate Blood Group
        if (checkForEmptyString(formData.bloodgroup)) {
            newErrors.bloodgroup = "Blood Group needs to be chosen!";
        }

        // Validate Address
        // if (checkForEmptyString(formData.address)) {
        //     newErrors.address = "Address needs to be entered!";
        // }

        // // Validate Emergency Contact Name
        // if (checkForEmptyString(formData.emergencyContactName)) {
        //     newErrors.emergencyContactName = "Emergency Contact name needs to be entered!";
        // }

        // // Validate Emergency Contact Relationship
        // if (checkForEmptyString(formData.relationship)) {
        //     newErrors.relationship = "Emergency Contact relationship needs to be chosen!";
        // }

        // // Validate Assigned Doctor
        // if (checkForEmptyString(formData.assignedDoctorId)) {
        //     newErrors.assignedDoctorId = "Please assign a doctor to the patient!";
        // }

        // Validate Gender
        if (checkForEmptyString(formData.gender)) {
            newErrors.gender = "Gender needs to be chosen!";
        }

        const patientId = formData.patientId;
        setFormData({
            ...formData,
            patientId,
        });
        setErrors(newErrors);

        const isDataValid = Object.values(newErrors).every((error) => !error);
        return isDataValid;
    };

    const cancelTokenSource = axios.CancelToken.source();

    const addPatient = useMutation(
        async (formData) => {
            if (isEdit) {
                const response = await axiosUtils.put(
                    editPatientAPIUrl,
                    JSON.stringify(formData),
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        withCredentials: true,
                        params: {
                            patientId: patientId
                        },
                        cancelToken: cancelTokenSource.token,
                    }
                );

                return response;
            } else {
                const response = await axiosUtils.post(
                    newPatientAPIUrl,
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
            }
        },
        {
            onSuccess: (responseData) => {
                if (!isEdit) {
                    const newPatientId = responseData.data.patientId;
                    navigate(`/admin/user-page/${newPatientId}`);
                } else {
                    navigate(`/admin/user-page/${patientId}`);
                }
            },
            onError: (err) => {
                setIsLoading(false);
                setErrors("No Server Response", err.message);
            },
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // console.log("SAVING PATIENT DATA");
        // console.log("Form Data=", formData);
        const isDataValid = validateForm();
        if (!isDataValid) {
            setIsLoading(false);
            return;
        }
        try {
            await addPatient.mutateAsync(formData);
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

    return (
        <Card>
            <CardHeader>
                <CardTitle tag="h5">{pageTitle}</CardTitle>
            </CardHeader>
            <CardBody>
                <Form id="addPatientForm" onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <>
                            <Card className="card-user">
                                <CardHeader>
                                    <CardTitle tag="h6">Patient's Personal Data</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col className="px-1" md="6">
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
                                        <Col className="px-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>Patient Name *</label>
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
                                    </Row>
                                    <Row>
                                        <Col className="pl-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>
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
                                        <Col className="pl-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>Phone *</label>
                                                <Input
                                                    type="number"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Patient's contact number"
                                                    disabled={isLoading}
                                                    maxLength={15}
                                                />
                                                {errors.phone && (
                                                    <div className="text-danger">{errors.phone}</div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>Marital Status *</label>
                                                <select
                                                    style={{ width: "100%" }}
                                                    className="relative m-2 p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    id="maritalStatus"
                                                    name="maritalStatus"
                                                    value={formData.maritalStatus || mstatusOptions[0].value}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                >
                                                    {mstatusOptions.map((unit) => (
                                                        <option
                                                            key={unit.label}
                                                            value={unit.value}
                                                        >
                                                            {unit.label}
                                                        </option>
                                                    ))}

                                                </select>
                                                {errors.maritalStatus && (
                                                    <div className="text-danger">{errors.maritalStatus}</div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col className="pl-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>Gender *</label>
                                                <select
                                                    style={{ width: "100%" }}
                                                    className="relative m-2 p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                                    <Row>
                                        <Col className="pl-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>
                                                    Blood Group *
                                                </label>
                                                <select
                                                    style={{ width: "100%" }}
                                                    className="relative m-2 p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    id="bloodgroup"
                                                    name="bloodgroup"
                                                    value={formData.bloodgroup || bloodGroupOptions[0].value}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                >
                                                    {bloodGroupOptions.map((unit) => (
                                                        <option
                                                            key={unit.label}
                                                            value={unit.value}
                                                        >
                                                            {unit.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.bloodgroup && (
                                                    <div className="text-danger">{errors.bloodgroup}</div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col className="pl-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>Referred By</label>
                                                <Input
                                                    type="text"
                                                    id="referredby"
                                                    name="referredby"
                                                    value={formData.referredby}
                                                    onChange={handleChange}
                                                    placeholder="Referred by"
                                                    disabled={isLoading}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <div className="button-container">
                                        <Row>
                                            <Col className="ml-auto" lg="12" md="12" xs="12">
                                                <p>Click Next to proceed to entering other data</p>
                                            </Col>
                                        </Row>
                                    </div>

                                </CardFooter>
                            </Card>

                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <Card className="card-user">
                                <CardHeader>
                                    <CardTitle tag="h6">Patient's Address & Contact Info</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col className="pl-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>Address *</label>
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
                                    </Row>
                                    <Row>
                                        <Col className="pr-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>Emergency Contact Name *</label>
                                                <Input
                                                    type="text"
                                                    id="emergencyContactName"
                                                    name="emergencyContactName"
                                                    value={formData.emergencyContactName}
                                                    onChange={handleChange}
                                                    placeholder="Patient's emergency contact name"
                                                    disabled={isLoading}
                                                />
                                                {errors.emergencyContactName && (
                                                    <div className="text-danger">
                                                        {errors.emergencyContactName}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col className="px-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>Relationship to Patient</label>
                                                <select
                                                    style={{ width: "100%" }}
                                                    className="relative p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    id="relationship"
                                                    name="relationship"
                                                    value={formData.relationship}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                >
                                                    {relationshipOptions.map((unit) => (
                                                        <option
                                                            key={unit.label}
                                                            value={unit.value}
                                                        >
                                                            {unit.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.relationship && (
                                                    <div className="text-danger">
                                                        {errors.relationship}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                </CardBody>
                                <CardFooter>
                                    <div className="button-container">
                                        <Row>
                                            <Col className="ml-auto" lg="12" md="12" xs="12">
                                                <p>Click Next to proceed to entering other data</p>
                                            </Col>
                                        </Row>
                                    </div>

                                </CardFooter>
                            </Card>
                        </>
                    )}

                    {currentStep === 3 && (
                        <>
                            <Card className="card-user">
                                <CardHeader>
                                    <CardTitle tag="h6">Patient's Vital Information</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>Pre-Existing Conditions</label>
                                                <Input
                                                    type="textarea"
                                                    id="pre_existing_conditions"
                                                    name="pre_existing_conditions"
                                                    placeholder="Pre Existing Conditions"
                                                    value={formData.pre_existing_conditions}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>Allergies</label>
                                                <Input
                                                    type="textarea"
                                                    id="allergies"
                                                    name="allergies"
                                                    placeholder="Allergies (if any)"
                                                    value={formData.allergies}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pl-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>
                                                    Admission Date
                                                </label>
                                                <Input
                                                    type="date"
                                                    id="admissionDate"
                                                    name="admissionDate"
                                                    value={formData.admissionDate}
                                                    onChange={handleChange}
                                                    placeholder="Admit Date"
                                                    disabled={isLoading}
                                                />
                                                {errors.admissionDate && (
                                                    <div className="text-danger">
                                                        {errors.admissionDate}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col className="pl-1" md="6">
                                            <FormGroup>
                                                <label className='addPLabel'>
                                                    Assign Doctor
                                                </label>
                                                <select
                                                    style={{ width: "100%" }}
                                                    className="relative p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    id="assignedDoctorId"
                                                    name="assignedDoctorId"
                                                    value={formData.assignedDoctorId}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                >
                                                    <option value="">Assign Doctor</option>
                                                    {doctorsList.map((unit) => (
                                                        <option
                                                            key={unit.id}
                                                            value={unit.id}
                                                        >
                                                            {unit.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.assignedDoctorId && (
                                                    <div className="text-danger">
                                                        {errors.assignedDoctorId}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <div className="button-container">
                                        <Row>
                                            <Col className="ml-auto" lg="12" md="12" xs="12">
                                                <p>Click Next to review data entered & save data</p>
                                            </Col>
                                        </Row>
                                    </div>

                                </CardFooter>
                            </Card>
                        </>
                    )}

                    {currentStep === 4 && (
                        <>
                            <Card className="card-user">
                                <CardHeader>
                                    <p tag="h6" style={{ textAlign: "justify" }}>Please review data entered and click "ADD PATIENT" if data is ok. Click "NEXT/BACK" if you want to change/edit any data before clicking on "ADD PATIENT"</p>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col className="pl-1" md="6">
                                            <p className='addPLabel'>
                                                Patient Name: {formData.salutation} {" "} {formData.firstName}
                                            </p>
                                            <p className='addPLabel'>
                                                Patient Age: {formData.age}
                                            </p>
                                            <p className='addPLabel'>
                                                Patient Phone: {formData.phone}
                                            </p>
                                            <p className='addPLabel'>
                                                Patient Gender: {formData.gender}
                                            </p>
                                            <p className='addPLabel'>
                                                Patient Marital Status: {formData.maritalStatus}
                                            </p>
                                            <p className='addPLabel'>
                                                Patient Emergency Contact: {formData.emergencyContactName}
                                            </p>
                                            <p className='addPLabel'>
                                                Patient Address: {formData.address}
                                            </p>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <div className="button-container">
                                        <Row>
                                            <div className="update ml-auto mr-auto">
                                                <Button
                                                    style={{ marginRight: "4px" }}
                                                    className="btn-round custom-button"
                                                    color="secondary"
                                                    onClick={handleGoBack}
                                                    disabled={isLoading}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className="btn-round custom-button"
                                                    color="primary"
                                                    type="submit"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (isEdit ? "Editing Patient..." : "Adding Patient...")
                                                        : (isEdit ? "Edit Patient" : "Add Patient")}
                                                </Button>
                                            </div>
                                        </Row>
                                    </div>

                                </CardFooter>
                            </Card>

                        </>
                    )}

                    <Button color="primary" onClick={goToPrevStep} disabled={currentStep === 1}>
                        Back
                    </Button>{' '}
                    <Button color="primary" onClick={goToNextStep} disabled={currentStep === 4}>
                        Next
                    </Button>{' '}

                </Form>

            </CardBody>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}

export default AddPatient