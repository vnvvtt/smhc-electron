import React from "react";
import { useQuery } from "react-query";
import axiosUtil from "../api/axios";

const getAllMedicinesAPIUrl = "/misc/getallmedicines";
const apiKey = process.env.REACT_APP_API_KEY;

export function GetMedicinesData() {
    const fetchMedicinesData = async () => {
        const response = await axiosUtil.get(getAllMedicinesAPIUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        console.log("RESPONSE DATA");
        console.log(response.data);
        return response.data;
    };

    const {
        data: medicinesData,
        error,
        isLoading,
    } = useQuery("getMedicineData", fetchMedicinesData);

    if (isLoading) {
        return null;
    }

    if (error) {
        return <div>Error loading medicines data: {error.message}</div>;
    }

    return medicinesData;
}
