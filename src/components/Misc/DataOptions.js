export const barChartOptions = {
    responsive: true,
    indexAxis: 'x', // This option sets the horizontal axis
    scales: {
        x: {
            beginAtZero: true,
        },
    },
    elements: {
        bar: {
            barPercentage: 0.5, // Adjust the bar width as needed
        },
    },
    plugins: {
        legend: {
            display: false,
        }
    },
};

export const pieChartOptions = {
    responsive: true,
    animation: {
        animateRotate: false,
        animateScale: true,
    },
    plugins: {
        legend: {
            position: "right",
        },
        title: {
            display: false,
            text: "Current Allocations",
        },
    }
};

export const genderOptions = [
    { value: '', label: 'Choose Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
]

export const salutationOptions = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Sri', label: 'Sri' },
    { value: 'Smt', label: 'Smt' },
    { value: 'Master', label: 'Master' },
    { value: 'Kumari', label: 'Kumari' },
    { value: 'Dr', label: 'Doctor' },
    { value: 'Miss', label: 'Miss' }
]

export const lTypeOptions = [
    { value: '', label: 'Choose Lab Type' },
    { value: 'Cytology', label: 'Cytology' },
    { value: 'Histopathology', label: 'Histopathology' }
]

export const stackedBarChartOptions = {
    responsive: true,
    scales: {
        yAxis: [
            {
                type: 'linear',
                position: 'left',
                id: 'billCountYAxis',
            },
            {
                type: 'linear',
                position: 'right',
                id: 'totalRevenueYAxis',
            },
        ],
    },
};

