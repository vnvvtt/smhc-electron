import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from 'reactstrap';

const BarChartData = ({ data, options }) => {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

    const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 767);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const adjustedOptions = {
        ...options,
        maintainAspectRatio: false,
        aspectRatio: 1,
    };

    const adjustedData = isSmallScreen
        ? {
            ...data,
            datasets: data.datasets.map((dataset) => ({
                ...dataset,
                barThickness: 20, // Adjust the bar width for small screens
                barPercentage: 0.5, // Adjust the bar percentage for small screens
            })),
        }
        : data;
    return (
        <div style={{ height: '250px' }}>
            <Bar data={adjustedData} options={adjustedOptions} />
        </div>
    );
};

export default BarChartData;