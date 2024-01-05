import axios from "axios";

import axiosUtil from "./axios";

const CancelToken = axios.CancelToken;
const apiKey = process.env.REACT_APP_API_KEY;

export const fetchPatientsList = async ({ doctorId, accessToken, allFlag = 1 }) => {
    let docId = doctorId;
    if (allFlag === 0) {
        docId = 0;
    }
    const patientListApiUrl = "/patients/patientlist";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(patientListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            params: {
                doctorId: docId,
            },
            cancelToken: cancelTokenSource.token,
        });
        return response.data;

    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching Patients List data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchMedicinesList = async () => {
    const getAllMedicinesAPIUrl = "/misc/getallmedicines";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(getAllMedicinesAPIUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching medicines data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchPatientData = async ({ doctorId, patientId, accessToken }) => {
    const patientDataApiUrl = "/patients/patientdata";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(patientDataApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            params: {
                patientId: patientId,
                doctorId: doctorId,
            },
            cancelToken: cancelTokenSource.token,
        });
        return response.data;

    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching Patient's data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchDoctorsList = async (orgId) => {
    const getAllDoctorsAPIUrl = "/misc/getAllDoctors";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(getAllDoctorsAPIUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            params: {
                orgId: orgId
            },
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching medicines data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchAppointmentsList = async (doctorId, accessToken, allFlag = 1) => {
    let docId = doctorId;
    if (allFlag === 0) {
        docId = 0;
    }
    const appointmentListApiUrl = "/patients/appointments";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(appointmentListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            params: {
                doctorId: docId,
            },
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching appointments data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchDoctorsTopFiveBillls = async (accessToken) => {
    const billListApiUrl = "/billing/billscountbydoctor";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(billListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching bills data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchHospitalsTopFiveBillls = async (accessToken) => {
    const billListApiUrl = "/billing/billscountbyhospital";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(billListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching bills data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchAllBills = async (accessToken) => {
    const billListApiUrl = "/billing";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(billListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching bills data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}


export const fetchLabTypeBreakUps = async (accessToken) => {
    // const billListApiUrl = "/billing/labtypebreakup";
    const billListApiUrl = "/billing/categorytypebreakup";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(billListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching bills data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchMonthlyRevenue = async (accessToken, currentYear) => {
    const billListApiUrl = "/billing/billmonthlyrevenue";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(billListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching bills data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchLabTypeCategories = async (accessToken) => {
    const billListApiUrl = "/billing/labtypecategories";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(billListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching bills data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchBillDataForPDFGeneration = async (accessToken, billid) => {
    const billListApiUrl = "/billing/billdataforpdf";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(billListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            params: {
                billid: billid,
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching bills data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchPatientDataByPhone = async (phoneNumber, accessToken) => {
    const patientDataApiUrl = "/patients/patientdatabyphone";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(patientDataApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            params: {
                phoneNumber: phoneNumber,
            },
            cancelToken: cancelTokenSource.token,
        });
        return response.data;

    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching Patient's data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchListOfDoctors = async (accessToken) => {
    const doctorsListApiUrl = "/billing/doctorlist";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(doctorsListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;

    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching Doctors data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchListOfHospitals = async (accessToken) => {
    const patientDataApiUrl = "/billing/hospitallist";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(patientDataApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;

    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching Hospitals data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchAllExpenses = async (accessToken) => {
    const expenseListApiUrl = "/expense";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(expenseListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching expenses data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchExpenseCategories = async () => {
    const getECategoriesAPIUrl = "/misc/getExpenseCategories";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(getECategoriesAPIUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching expense categories data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchModesOfPayment = async () => {
    const getModesOfPaymentAPIUrl = "/misc/getModesOfPayment";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(getModesOfPaymentAPIUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching modes of payment data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchBillingSummaryForAPeriodFromAPI = async (accessToken, startDate, endDate) => {
    const billingListApiUrl = "/billing/periodbillingSummary";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(billingListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            params: {
                startDate: startDate,
                endDate: endDate,
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching billing summary data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchExpenseSummaryForAPeriodFromAPI = async (accessToken, startDate, endDate) => {
    const expenseListApiUrl = "/expense/periodexpensesummary";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(expenseListApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            params: {
                startDate: startDate,
                endDate: endDate,
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching expense summary data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}

export const fetchAnalyticsDataFromAPI = async (accessToken) => {
    const analyticsDataApiUrl = "/billing/getallanalytics";
    const cancelTokenSource = CancelToken.source();
    try {
        const response = await axiosUtil.get(analyticsDataApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: cancelTokenSource.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
        } else {
            console.error("Error fetching expenses data:", error);
            throw error;
        }
    } finally {
        // Cleanup the cancel token source
        cancelTokenSource.cancel("Request canceled by user");
    }
}
