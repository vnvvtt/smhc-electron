import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    Table,
} from "reactstrap";

import useAuth from "../../hooks/useAuth";
import axiosUtil from "../../api/axios";
import "../../views/Test.css";
import { checkForEmptyString } from "../../components/Validations";
import { fetchMedicinesList } from '../../api/api';

const newPrescriptionAPIUrl = "/prescriptions";

const timingOptions = [
    { value: 'Before Food', label: 'Before Food' },
    { value: 'After Food', label: 'After Food' },
    { value: 'None', label: 'Not Applicable' }
]

const unitOptions = [
    { value: 'Tablet(s)', label: 'Tablet(s)' },
    { value: 'Capsule(s)', label: 'Capsule(s)' },
    { value: 'Milliliters (ml)', label: 'Milliliters (ml)' },
    { value: 'Gram(s) (g)', label: 'Gram(s) (g)' },
    { value: 'Milligram(s) (mg)', label: 'Milligram(s) (mg)' },
    { value: 'Puff(s)', label: 'Puff(s)' },
    { value: 'Dose(s)', label: 'Dose(s)' },
    { value: 'International Unit(s) (IU)', label: 'International Unit(s) (IU)' },
    { value: 'Drop(s)', label: 'Drop(s)' },
    { value: 'Sachet(s)', label: 'Sachet(s)' },
    { value: 'Suppository(suppositories)', label: 'Suppository(suppositories)' },
    { value: 'Patch(es)', label: 'Patch(es)' },
    { value: 'Spray(s)', label: 'Spray(s)' }
]

const frequencyOptions = [
    { value: '1-0-0', label: 'Morning [1-0-0]' },
    { value: '1-1-0', label: 'Morning & Afternoon [1-1-0]' },
    { value: '1-1-1', label: 'Morning & Afternoon & Night [1-1-1]' },
    { value: '0-1-0', label: 'Afternoon [0-1-0]' },
    { value: '0-1-1', label: 'Afternoon & Night [0-1-1]' },
    { value: '0-0-1', label: 'Night [0-0-1]' },
    { value: '1-0-1', label: 'Morning & Night [1-0-1]' },
    { value: 'SOS', label: 'SOS' },
    { value: 'Every 30 minutes', label: 'Every 30 Mts' },
    { value: 'Every 1 Hour', label: 'Every 1 Hour' },
    { value: 'Every 2 Hours', label: 'Every 2 Hours' },
    { value: 'Every 3 Hours', label: 'Every 3 Hours' },
    { value: 'Every 4 Hours', label: 'Every 4 Hours' },
    { value: 'Every 5 Hours', label: 'Every 5 Hours' },
    { value: 'Every 6 Hours', label: 'Every 6 Hours' },
    { value: 'Every 7 Hours', label: 'Every 7 Hours' },
    { value: 'Every 8 Hours', label: 'Every 8 Hours' },
    { value: 'Alternate Day', label: 'Alternate Day' },
    { value: 'Weekly once', label: 'Weekly once' },
    { value: 'Weekly twice', label: 'Weekly twice' },
    { value: 'Every 15 days', label: 'Fortnightly' },
]

const durationOptions = [
    { value: '1 day', label: '1 day' },
    { value: '2 days', label: '2 days' },
    { value: '3 Days', label: '3 Days' },
    { value: '4 Days', label: '4 Days' },
    { value: '5 Days', label: '5 Days' },
    { value: '6 Days', label: '6 Days' },
    { value: '7 Days', label: '7 Days' },
    { value: '8 Days', label: '8 Days' },
    { value: '9 Days', label: '9 Days' },
    { value: '10 Days', label: '10 Days' },
    { value: '11 Days', label: '11 Days' },
    { value: '12 Days', label: '12 Days' },
    { value: '1 Week', label: '1 Week' },
    { value: '2 Weeks', label: '2 Weeks' },
    { value: '3 Weeks', label: '3 Weeks' },
    { value: '1 Month', label: '1 Month' },
    { value: '2 Months', label: '2 Months' },
    { value: '3 Months', label: '3 Months' },
    { value: '4 Months', label: '4 Months' },
    { value: 'Forever', label: 'Forever' },
]

const AddPrescription = ({ patientId }) => {

    const navigate = useNavigate();

    const { auth } = useAuth();

    const doctorId = auth.id;
    const accessToken = auth.accessToken;
    const branchId = auth.branchid;

    const [isLoading, setIsLoading] = useState(false);
    const [complaints, setComplaints] = useState(undefined);
    const [examination, setExamination] = useState(undefined);
    const [diagnosis, setDiagnosis] = useState(undefined);
    const [advice, setAdvice] = useState(undefined);
    const [followUp, setFollowUp] = useState(undefined);
    const [investigation, setInvestigation] = useState(undefined);
    const [temperature, setTemperature] = useState("98.5");
    const [bp, setBP] = useState("120/80");
    const [pulseRate, setPulseRate] = useState("90");
    const [medications, setMedications] = useState([]);
    const [medicineName, setMedicineName] = useState("");
    const [dosage, setDosage] = useState("1");
    const [units, setUnits] = useState("tablets(s)");
    const [frequency, setFrequency] = useState("1-0-0");
    const [duration, setDuration] = useState("1 day");
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [foodTiming, setFoodTiming] = useState("Before Food");
    const [doctorNotes, setDoctorNotes] = useState("");
    const [heightf, setHeightf] = useState("");
    const [heighti, setHeighti] = useState("");
    const [weight, setWeight] = useState("");
    const [headc, setHeadc] = useState("");

    const [errors, setErrors] = useState({});

    const handleUnitsChange = (event) => {
        setUnits(event.target.value);
    }
    const handleFrequencyChange = (event) => {
        setFrequency(event.target.value);
    }
    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    }
    const handleFoodTimingChange = (event) => {
        setFoodTiming(event.target.value);
    }

    function resetFormFields() {
        setComplaints("");
        setExamination("");
        setDiagnosis("");
        setTemperature("98.5");
        setBP("120/80");
        setPulseRate("90");
        setAdvice("");
        setFollowUp("");
        setInvestigation("");
        setMedicineName("");
        setDosage("1");
        setUnits("tabelts(s)");
        setFrequency("1-0-0");
        setDuration("1 day");
        setFoodTiming("Before Food");
        setSpecialInstructions("");
        setDoctorNotes("");
        setHeadc("");
        setHeightf("");
        setHeighti("");
        setWeight("");
    }

    const validateForm = () => {
        const newErrors = {};
        // Complaints
        if (checkForEmptyString(complaints)) {
            setIsLoading(false);
            newErrors.complaints = "Complaints is required!";
        }
        // // Examination
        // if (checkForEmptyString(examination)) {
        //     setIsLoading(false);
        //     newErrors.examination = "Examination is required!";
        // }
        // // Diagnosis
        // if (checkForEmptyString(diagnosis)) {
        //     setIsLoading(false);
        //     newErrors.diagnosis = "Diagnosis is required!";
        // }

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => !error);
    };

    const cancelTokenSource = axios.CancelToken.source();
    const errorHandling = (errMsg) => {
        if (!errMsg?.response) {
            setErrors("$2 - No Server Response");
        } else if (errMsg.response?.status === 400) {
            setErrors("$3 - Missing data or Invalid data");
        } else if (errMsg.response?.status === 401) {
            setErrors("$4 - Unauthorized");
        } else {
            setErrors("$1 - Add Prescription Failed");
        }
    };

    const cellClass = "px-6 py-4 whitespace-nowrap sm:whitespace-normal";
    const handleDelete = (index) => {
        // Remove the medication from the array by creating a copy of the array and filtering out the item to be deleted
        const updatedMedications = [...medications];
        updatedMedications.splice(index, 1);
        setMedications(updatedMedications); // Update the state with the new array
    };

    const [currentStep, setCurrentStep] = useState(1);
    const goToNextStep = () => {
        let isDataValid = true;
        setIsLoading(true);
        if (currentStep === 1) {
            // Validate data entered in Step 1
            isDataValid = validateForm();
        }
        setIsLoading(false);
        if (isDataValid) {
            setCurrentStep(currentStep + 1);
        }
    };
    const goToPrevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // Handling change of data - Start
    const handleInputChange = (e, setStateFunction, id = null) => {
        let name = null;
        let value = null;
        // Check if the event has a target property (standard form elements)
        if (e.target) {
            ({ name, value } = e.target);
        } else {
            // Assuming 'e' is the selected option from react-select
            name = id; // The name of the react-select field
            value = e.value; // The entire selected option object
        }

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "", // Clear the error message for this field
            });
        }

        setStateFunction(value);
    };
    // Handling change of data - end

    const addMedication = () => {
        const newErrors = {};

        const mnameCheck = checkForEmptyString(medicineName);
        if (mnameCheck) {
            newErrors.medicineName = "Please choose a Medicine!";
        }

        setErrors(newErrors);
        const isDataValid = Object.values(newErrors).every((error) => !error);
        if (!isDataValid) {
            return;
        }

        // console.log("Data of Medicine selected");
        // console.log("medicineName=", medicineName);
        // console.log("Dosage=", dosage);
        // console.log("Units=", units);
        // console.log("Frequency=", frequency);
        // console.log("duration=", duration);
        // console.log("foodTimimg=", foodTiming);
        // console.log("specialInstructions=", specialInstructions);
        // console.log("doctor notes=", doctorNotes);
        const medication = {
            medicineName,
            dosage,
            units,
            frequency,
            duration,
            foodTiming,
            specialInstructions,
            doctorNotes,
        };
        setMedications([...medications, medication]);
        // Clear the form for the next entry
        setMedicineName("");
        setDosage("");
        setUnits("");
        setFrequency("");
        setDuration("");
        setSpecialInstructions("");
        setFoodTiming("Before Food");
        setDoctorNotes("");
    };

    const addPrescription = useMutation(
        async (pData) => {
            // console.log("SAVING PRESCRIPTION DATA");
            // console.log(JSON.stringify(pData));
            const response = await axiosUtil.post(
                newPrescriptionAPIUrl,
                JSON.stringify(pData),
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                    cancelToken: cancelTokenSource.token, // Assign the cancel token to the request
                }
            );
            return response;
        },
        {
            onSuccess: (response) => {
                setIsLoading(false);
                console.log("SUCCESS!");
                resetFormFields();
                if (response.data.prescriptionId) {
                    const newPrescriptionId = response.data.prescriptionId;
                    navigate(`/admin/generatepdf/${newPrescriptionId}/${patientId}`);
                }
            },
            onError: (err) => {
                console.log("ERROR!=".err.message);
                setIsLoading(false);
                errorHandling(err);
            },
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const isDataValid = validateForm();
        if (!isDataValid) {
            setIsLoading(false);
            return;
        }
        // console.log("isDataValid=", isDataValid);
        try {
            // const prescriptions = JSON.stringify(medications);
            await addPrescription.mutateAsync({
                doctorId: doctorId,
                patientId: patientId,
                branchId: branchId,
                complaints: complaints,
                temperature: temperature,
                bp: bp,
                pulseRate: pulseRate,
                examination: examination,
                diagnosis: diagnosis,
                advice: advice,
                followUp: followUp,
                investigation: investigation,
                heightf: heightf,
                heighti: heighti,
                headc: headc,
                weight: weight,
                prescriptions: medications,
            });
        } catch (err) {
            errorHandling(err);
        }
    };

    const [medicinesData, setMedicinesData] = useState([]);
    const [isMedicineLoading, setIsMedicineLoading] = useState(true);
    const [medicineDataError, setMedicineDataError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchMedicinesList();
                setMedicinesData(data);
                setIsMedicineLoading(false);
            } catch (error) {
                setMedicineDataError(error);
                setIsMedicineLoading(false);
            }
        };

        fetchData();

    }, []);

    if (isMedicineLoading) {
        return <div>Loading...</div>;
    } else if (medicineDataError) {
        return <div>Error fetching data</div>;
    } else {
        return (
            <Card className="card-user">
                <CardHeader>
                    <CardTitle tag="h5">Add Prescription</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <>
                                <Card className="card-user">
                                    <CardHeader>
                                        <CardTitle tag="h6">Chief Complaint/Examination/Diagnosis/Investigation</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col className="px-1" md="12">
                                                <FormGroup>
                                                    <label className='addPLabel'>Chief Complaint</label>
                                                    <Input
                                                        type="textarea"
                                                        id="complaints"
                                                        name="complaints"
                                                        // placeholder="Enter Patient's Complaints"
                                                        onChange={(e) => handleInputChange(e, setComplaints)}
                                                        value={complaints}
                                                    />
                                                    {errors.complaints && (
                                                        <div className="text-danger">{errors.complaints}</div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-1" md="12">
                                                <FormGroup>
                                                    <label className='addPLabel'>Examination</label>
                                                    <Input
                                                        type="textarea"
                                                        id="examination"
                                                        name="examination"
                                                        // placeholder="Enter your Examination/Investigation details"
                                                        onChange={(e) => handleInputChange(e, setExamination)}
                                                        value={examination}
                                                    />
                                                    {/* {errors.examination && (
                                                        <div className="text-danger">
                                                            {errors.examination}
                                                        </div>
                                                    )} */}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <label className='addPLabel'>Diagnosis</label>
                                                    <Input
                                                        type="textarea"
                                                        id="diagnosis"
                                                        name="diagnosis"
                                                        // placeholder="Enter your diagnosis"
                                                        onChange={(e) => handleInputChange(e, setDiagnosis)}
                                                        value={diagnosis}
                                                    />
                                                    {/* {errors.diagnosis && (
                                                        <div className="text-danger">{errors.diagnosis}</div>
                                                    )} */}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-1" md="12">
                                                <FormGroup>
                                                    <label className='addPLabel'>Investigation details</label>
                                                    <Input
                                                        type="textarea"
                                                        id="investigation"
                                                        name="investigation"
                                                        // placeholder="Enter your investigation"
                                                        onChange={(e) =>
                                                            handleInputChange(e, setInvestigation)
                                                        }
                                                        value={investigation}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter>
                                        <div className="button-container">
                                            <Row>
                                                <Col className="ml-auto" lg="12" md="12" xs="12">
                                                    <p>Click Next to proceed to prescribing Medicines</p>
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
                                        <CardTitle tag="h6">Prescribe Medicines</CardTitle>
                                        <ul className="list-unstyled team-members">
                                            You can prescribe more than 1 medicine following Steps 1 to 3 outlined below.
                                            <li>1. Choose medicine from the "Select Medicine" dropdown.</li>
                                            <li>2. Enter all the data related to the chosen medicine - Dosage, Unit, Frequency, Duration, Custom Dosage Instructions, Medicine Timing (Before/After Food) and Instructions</li>
                                            <li>3. Click on the button "Add Medicine"</li>
                                            <li>The medicine added will be displayed in the section "Prescribed Medicines".</li>
                                        </ul>
                                    </CardHeader>
                                    <CardBody >
                                        <Row style={{ border: "1px solid red" }}>
                                            <Row>
                                                <Col className="px-1" md="12">
                                                    <FormGroup>
                                                        <select
                                                            style={{ width: "100%" }}
                                                            className="relative m-1 p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                            value={medicineName}
                                                            onChange={(e) =>
                                                                handleInputChange(e, setMedicineName)
                                                            }
                                                        >
                                                            <option value="" disabled>
                                                                Select a medicine
                                                            </option>
                                                            {medicinesData.map((medicine) => (
                                                                <option
                                                                    key={medicine.medicine_id}
                                                                    value={medicine.medicine_name}
                                                                >
                                                                    {medicine.medicine_stock > 0
                                                                        ? medicine.medicine_name + "- (In Stock)"
                                                                        : medicine.medicine_name + "- (Out of Stock)"}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.medicineName && (
                                                            <div className="text-danger">{errors.medicineName}</div>
                                                        )}

                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className="px-1" md="3">
                                                    <FormGroup>
                                                        <label className='addPLabel'>Dosage</label>
                                                        <Input
                                                            type="text"
                                                            name="dosageM"
                                                            id="dosageM"
                                                            placeholder=""
                                                            style={{ width: "100%" }}
                                                            className="relative p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                            autoComplete="off"
                                                            value={dosage}
                                                            onChange={(e) =>
                                                                handleInputChange(e, setDosage)
                                                            }
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col className="px-1" md="3">
                                                    <FormGroup>
                                                        <label className='addPLabel'>Unit</label>
                                                        <select
                                                            options={unitOptions}
                                                            style={{ width: "100%" }}
                                                            className="relative p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                            id="dosageA"
                                                            name="dosageA"
                                                            value={units}
                                                            onChange={handleUnitsChange}
                                                        >
                                                            {unitOptions.map((unit) => (
                                                                <option
                                                                    key={unit.label}
                                                                    value={unit.value}
                                                                >
                                                                    {unit.value}
                                                                </option>
                                                            ))}

                                                        </select>
                                                    </FormGroup>
                                                </Col>
                                                <Col className="px-1" md="3">
                                                    <FormGroup>
                                                        <label className='addPLabel'>Frequency</label>
                                                        <select
                                                            options={unitOptions}
                                                            style={{ width: "100%" }}
                                                            className="relative p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                            id="dosageN"
                                                            name="dosageN"
                                                            value={frequency}
                                                            onChange={handleFrequencyChange}
                                                        >
                                                            {frequencyOptions.map((unit) => (
                                                                <option
                                                                    key={unit.label}
                                                                    value={unit.value}
                                                                >
                                                                    {unit.value}
                                                                </option>
                                                            ))}

                                                        </select>
                                                    </FormGroup>
                                                </Col>
                                                <Col className="px-1" md="3">
                                                    <FormGroup>
                                                        <label className='addPLabel'>Duration</label>
                                                        <select
                                                            options={unitOptions}
                                                            style={{ width: "100%" }}
                                                            className="relative p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                            id="duration"
                                                            name="duration"
                                                            value={duration}
                                                            onChange={handleDurationChange}
                                                        >
                                                            {durationOptions.map((unit) => (
                                                                <option
                                                                    key={unit.label}
                                                                    value={unit.value}
                                                                >
                                                                    {unit.value}
                                                                </option>
                                                            ))}

                                                        </select>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label className='addPLabel'>Custom Dosage Instructions</label>
                                                        <Input
                                                            type="textarea"
                                                            id="specialinstructions"
                                                            name="specialinstructions"
                                                            placeholder="Enter dosage instructions (if any)"
                                                            onChange={(e) =>
                                                                handleInputChange(e, setSpecialInstructions)
                                                            }
                                                            value={specialInstructions}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label className='addPLabel'>Medicine Timing (Before/After Food)</label>
                                                        <select
                                                            options={unitOptions}
                                                            style={{ width: "100%" }}
                                                            className="relative p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                            id="foodtiming"
                                                            name="foodtiming"
                                                            value={foodTiming}
                                                            onChange={handleFoodTimingChange}
                                                        >
                                                            {timingOptions.map((unit) => (
                                                                <option
                                                                    key={unit.label}
                                                                    value={unit.value}
                                                                >
                                                                    {unit.value}
                                                                </option>
                                                            ))}

                                                        </select>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label className='addPLabel'>Instructions</label>
                                                        <Input
                                                            type="textarea"
                                                            id="doctorNotes"
                                                            name="doctorNotes"
                                                            placeholder="Enter your notes"
                                                            value={doctorNotes}
                                                            onChange={(e) => handleInputChange(e, setDoctorNotes)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <div className="update ml-auto mr-auto">
                                                    <Button
                                                        className="btn-round"
                                                        color="secondary"
                                                        type="button"
                                                        onClick={addMedication}
                                                    >
                                                        Add Medicine
                                                    </Button>
                                                </div>
                                            </Row>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle tag="h5">Prescribed Medicines</CardTitle>
                                                    </CardHeader>
                                                    <CardBody>
                                                        {medications.length === 0 ? (
                                                            <p>No medications added yet.</p>
                                                        ) : (
                                                            <Table responsive>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Medicine Name</th>
                                                                        <th>Dosage</th>
                                                                        <th>Duration</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {medications.map((medication, index) => (
                                                                        <tr
                                                                            key={index}
                                                                        >
                                                                            <td className={`${cellClass}`}>
                                                                                {medication.medicineName}
                                                                            </td>
                                                                            <td className={`${cellClass}`}>
                                                                                {medication.dosage}
                                                                            </td>
                                                                            <td className={`${cellClass}`}>
                                                                                {medication.duration}
                                                                            </td>
                                                                            <td>
                                                                                <button
                                                                                    className="cursor-pointer rounded-lg border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90"
                                                                                    onClick={() => handleDelete(index)}
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        )}
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>

                                    </CardBody>
                                    <CardFooter>
                                        <div className="button-container">
                                            <Row>
                                                <Col className="ml-auto" lg="12" md="12" xs="12">
                                                    <p>Click Next to proceed to enter Vitals and other info</p>
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
                                        <CardTitle tag="h6">Vitals, Follow Up and Advice</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col md="4">
                                                <Row style={{ border: "0.25px solid gray" }}>
                                                    <label className='addPLabel'>Height</label>
                                                    <Col md="6">
                                                        <FormGroup>
                                                            <Input
                                                                type="number"
                                                                id="heightF"
                                                                name="heightF"
                                                                value={heightf}
                                                                onChange={(e) => handleInputChange(e, setHeightf)}
                                                                placeholder="Feet"
                                                                disabled={isLoading}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                        <FormGroup>
                                                            <Input
                                                                type="number"
                                                                id="heightI"
                                                                name="heightI"
                                                                value={heighti}
                                                                onChange={(e) => handleInputChange(e, setHeighti)}
                                                                placeholder="Inches"
                                                                disabled={isLoading}
                                                            />
                                                        </FormGroup>

                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col className="pl-1" md="4">
                                                <FormGroup>
                                                    <label className='addPLabel'>Weight</label>
                                                    <Input
                                                        type="number"
                                                        id="weight"
                                                        name="weight"
                                                        value={weight}
                                                        onChange={(e) => handleInputChange(e, setWeight)}
                                                        placeholder="Weight (kgs)"
                                                        disabled={isLoading}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="4">
                                                <FormGroup>
                                                    <label className='addPLabel'>Head Circumferance</label>
                                                    <Input
                                                        type="number"
                                                        id="headc"
                                                        name="headc"
                                                        value={headc}
                                                        onChange={(e) => handleInputChange(e, setHeadc)}
                                                        placeholder="Head circumferance (cms)"
                                                        disabled={isLoading}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <label className='addPLabel'>Notes</label>
                                                    <Input
                                                        type="textarea"
                                                        id="advice"
                                                        name="advice"
                                                        placeholder="Enter your advice"
                                                        onChange={(e) => handleInputChange(e, setAdvice)}
                                                        value={advice}
                                                        autoFocus={true}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <label className='addPLabel'>Follow Up</label>
                                                    <Input
                                                        type="textarea"
                                                        id="followup"
                                                        name="followup"
                                                        placeholder="Enter your follow up instructions (if any)"
                                                        onChange={(e) => handleInputChange(e, setFollowUp)}
                                                        value={followUp}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="4">
                                                <FormGroup>
                                                    <label className='addPLabel'>Blood Pressure</label>
                                                    <Input
                                                        type="text"
                                                        id="bloodPressure"
                                                        name="bloodPressure"
                                                        placeholder="Blood Pressure"
                                                        onChange={(e) => handleInputChange(e, setBP)}
                                                        value={bp}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="4">
                                                <FormGroup>
                                                    <label className='addPLabel'>Pulse Rate</label>
                                                    <Input
                                                        type="text"
                                                        id="pulseRate"
                                                        name="pulseRate"
                                                        placeholder="Pulse Rate"
                                                        onChange={(e) => handleInputChange(e, setPulseRate)}
                                                        value={pulseRate}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="4">
                                                <FormGroup>
                                                    <label className='addPLabel'>Temperature</label>
                                                    <Input
                                                        type="number"
                                                        id="temperature"
                                                        name="temperature"
                                                        placeholder="Temperature"
                                                        onChange={(e) => handleInputChange(e, setTemperature)}
                                                        value={temperature}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter>
                                        <div className="button-container">
                                            <Row>
                                                <Col className="ml-auto" lg="12" md="12" xs="12">
                                                    <p>Click Next to review data entered and generate Prescription</p>
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
                                        <CardTitle tag="h6">Please review the Prescription Data</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <p>You can review the data here. If you want to make changes, click on BACK to go to the previous screens. If you are happy with the prescription data entered, click SAVE.</p>
                                        <div>
                                            <CardTitle tag="h5">Prescription Details:</CardTitle>
                                            <p>Complaints: {complaints}</p>
                                            <p>Examination: {examination}</p>
                                            <p>Diagnosis: {diagnosis}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <p>Vitals:</p>
                                                <ul>
                                                    <li>
                                                        Temperature: {temperature} °F
                                                    </li>
                                                    <li>Blood Pressure: {bp} mmHg</li>
                                                    <li>
                                                        Pulse Rate: {pulseRate} BPM
                                                    </li>
                                                </ul>
                                            </div>
                                            <p>Advice: {advice}</p>
                                            <p>Follow-up: {followUp}</p>
                                            <p>Investigations: {investigation}</p>
                                            <div>
                                                <ul>
                                                    {medications.map(
                                                        (medicine, index) => (
                                                            <li key={index}>
                                                                {index + 1}. {medicine.medicineName}
                                                                <ul>
                                                                    <li>Dosage: {medicine.dosage}</li>
                                                                    <li>Units: {medicine.units}</li>
                                                                    <li>Night Dosage: {medicine.frequency}</li>
                                                                    <li>Duration: {medicine.duration}</li>
                                                                    <li>Food Timing: {medicine.foodTiming}</li>
                                                                    <li>Doctor Notes: {medicine.doctorNotes}</li>
                                                                </ul>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>

                                        </div>

                                    </CardBody>
                                    <CardFooter>
                                        <div className="button-container">
                                            <Row>
                                                <Col className="ml-auto" lg="12" md="12" xs="12">
                                                    <p>You can click on BACK (& NEXT) to change any data before clicking on GENERATE PRESCRIPTION.</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <div className="update ml-auto mr-auto">
                                                    <Button
                                                        className="btn-round"
                                                        color="success"
                                                        type="submit"
                                                    >
                                                        {isLoading
                                                            ? "Generating prescription data..."
                                                            : "Generate Prescription"}
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
            </Card>

        )

    }

}

export default AddPrescription
