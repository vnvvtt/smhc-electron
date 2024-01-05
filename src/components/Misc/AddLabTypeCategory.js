import React, { useState, useEffect } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
    Button,
    Row,
    Col,
    FormGroup,
    Form,
    Input,
} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import useAuth from "../../hooks/useAuth";
import "../../views/Test.css"
import { fetchLabTypeCategories } from "../../api/api"
import {
    validateStringData,
    checkForEmptyString,
} from "../Validations";
import { getCurrentDateAndTime } from "../../components/Misc/commonUtils"

const AddLabTypeCategory = () => {
    const { auth } = useAuth();
    const { accessToken, name: userName } = auth;

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [labTypeCategoriesOptions, setLabTypeCategoriesOptions] = useState([]);
    const [islabTypeCategoriesOptionsLoading, setIsLabTypeCategoriesOptionsLoading] = useState(true);
    const [labTypeCategoriesOptionsError, setLabTypeCategoriesOptionsError] = useState(null);

    const [formData, setFormData] = useState({
        testGroupName: "",
        diagnosticLabTypeId: "",
        rate: "",
        doctor_commission_in_percentage: "0.0",
        doctor_commission_in_currency: "0.0",
        createdAt: getCurrentDateAndTime(),
        createdBy: userName,
        updatedAt: getCurrentDateAndTime(),
        updatedBy: userName
    });

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

        // Validate Lab Type Group Name
        const isTestGroupName = checkForEmptyString(formData.testGroupName);
        if (!isTestGroupName) {
            newErrors.testGroupName = validateStringData(
                formData.testGroupName,
                true,
                true,
                100,
                "Invalid data. Please check!"
            );
        }

        if (isTestGroupName) {
            newErrors.testGroupName = "Name is required!";
        }

        // Validate Lab Type Category
        if (checkForEmptyString(formData.diagnosticLabTypeId)) {
            newErrors.diagnosticLabTypeId = "Lab Group Type is required";
        }

        // Validate for Rate
        if (checkForEmptyString(formData.rate)) {
            newErrors.rate = "Enter Rate!";
        } else {
            if ((formData.rate <= 0) || (formData.rate > 10000000)) {
                newErrors.rate = "Enter valid Rate!";
            }
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
        console.log("SAVING CATEGORY DATA");
        console.log("Form Data=", formData);
        // try {
        //     await addNewCategory.mutateAsync(formData);
        // } catch (err) {
        //     setIsLoading(false);
        //     // Handle errors
        //     if (err.response?.status === 409) {
        //         setErrors("Category already exists!");
        //     } else {
        //         console.error("Error adding category:", err.message);
        //     }
        // }
    };

    // const cancelTokenSource = axios.CancelToken.source();
    // const addNewCategory = useMutation(
    //     async (combinedData) => {
    //         const response = await axiosUtils.post(
    //             newBillingAPIUrl,
    //             JSON.stringify(combinedData),
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${accessToken}`,
    //                 },
    //                 withCredentials: true,
    //                 cancelToken: cancelTokenSource.token,
    //             }
    //         );
    //         return response;
    //     },
    //     {
    //         onSuccess: (responseData) => {
    //             const billingId = responseData.data;
    //             navigate(`/admin/generatebill/${billingId}`);
    //         },
    //         onError: (err) => {
    //             setIsLoading(false);
    //             setErrors("No Server Response", err.message);
    //         },
    //     }
    // );

    // Fetch lab type categories from API
    useEffect(() => {

        const fetchLabTypes = async () => {
            try {
                const categories = await fetchLabTypeCategories(accessToken);
                const options = categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                }));
                setLabTypeCategoriesOptions(options);
                setIsLabTypeCategoriesOptionsLoading(false);
                setLabTypeCategoriesOptionsError("");
            } catch (error) {
                setLabTypeCategoriesOptionsError(error);
                setIsLabTypeCategoriesOptionsLoading(false);
                setLabTypeCategoriesOptions([]);
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    console.log("Request canceled:", error.message);
                }
            }
        };

        fetchLabTypes();

    }, [accessToken]);

    if (islabTypeCategoriesOptionsLoading) {
        return <div>Loading...</div>;
    } else if (labTypeCategoriesOptionsError) {
        return <div>Error fetching Lab Categories data</div>;
    } else {
        return (
            <div className='content'>
                <Form id="addLabTypeCategory" onSubmit={handleSubmit}>
                    <Row>
                        <Col md="12">
                            <FormGroup>
                                <label htmlFor='testGroupName' className='addPLabel'>Test Group Name *</label>
                                <Input
                                    type="text"
                                    name="testGroupName"
                                    id="testGroupName"
                                    placeholder="Lab Type Group Name"
                                    autoComplete="off"
                                    value={formData.testGroupName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    maxLength={100}
                                />
                                {errors.testGroupName && (
                                    <div className="text-danger">{errors.testGroupName}</div>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor='diagnosticLabTypeId' className='addPLabel'>Lab Type *</label>
                                <select
                                    style={{ width: "100%" }}
                                    className="relative m-2 p-2 z-20 w-full appearance-none border border-gray-300 rounded-md bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    id="diagnosticLabTypeId"
                                    name="diagnosticLabTypeId"
                                    value={formData.diagnosticLabTypeId}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                >
                                    <option value="">Choose Lab Type</option>
                                    {labTypeCategoriesOptions.map((unit) => (
                                        <option
                                            key={unit.label}
                                            value={unit.value}
                                        >
                                            {unit.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.diagnosticLabTypeId && (
                                    <div className="text-danger">{errors.diagnosticLabTypeId}</div>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor='rate' className='addPLabel'>
                                    Rate *
                                </label>
                                <Input
                                    type="number"
                                    id="rate"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleChange}
                                    placeholder="Lab Test Rate"
                                    disabled={isLoading}
                                />
                                {errors.rate && (
                                    <div className="text-danger">{errors.rate}</div>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor='doctor_commission_in_percentage' className='addPLabel'>
                                    Doctor's Commission (%) *
                                </label>
                                <Input
                                    type="number"
                                    id="doctor_commission_in_percentage"
                                    name="doctor_commission_in_percentage"
                                    value={formData.doctor_commission_in_percentage}
                                    onChange={handleChange}
                                    placeholder="Commission to be paid to Doctor in %"
                                    disabled={isLoading}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor='doctor_commission_in_currency' className='addPLabel'>
                                    Doctor's Commission (Currency) *
                                </label>
                                <Input
                                    type="number"
                                    id="doctor_commission_in_currency"
                                    name="doctor_commission_in_currency"
                                    value={formData.doctor_commission_in_currency}
                                    onChange={handleChange}
                                    placeholder="Commission to be paid to Doctor in currency"
                                    disabled={isLoading}
                                />
                            </FormGroup>
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
                                            "Save"
                                        )}
                                    </Button>
                                    {errors.submitdata && (
                                        <div className="text-danger">{errors.submitdata}</div>
                                    )}
                                </div>
                            </Row>

                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export default AddLabTypeCategory
