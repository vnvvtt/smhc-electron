export const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

export const getMonthFromDate = (dateString) => {
    const options = { month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

export const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Function to calculate the total revenue based on today's bills
export const getTotalBasedOnTodaysExpenses = (apiResponse) => {
    const today = new Date().toISOString().split('T')[0];
    const todayBills = apiResponse.filter(bill => bill.expenseDate.split('T')[0] === today);
    return todayBills.reduce((total, bill) => total + (bill.expenseAmount || 0), 0);
}

// Function to calculate the total number of bills
export const getTotalExpensesCount = (apiResponse) => {
    return apiResponse.length;
}

export const getTotalExpenses = (apiResponse) => {

    let total = 0.0;
    apiResponse.forEach((bill, index) => {
        const netAmount = parseFloat(bill.expenseAmount);
        if (!isNaN(netAmount)) {
            total += netAmount;
        }
    });
    return total;
}

// Function to calculate the total number of bills for today
export const getTotalBillsCountForToday = (apiResponse) => {
    const today = new Date().toISOString().split('T')[0];
    const todayBills = apiResponse.filter(bill => bill.billdate.split('T')[0] === today);
    const todayCount = todayBills.length;
    return todayCount;
}

// Calculates Bill count for the current month
export const getBillsCountForCurrentMonth = (apiResponse) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Months are zero-based, so add 1
    const currentYear = today.getFullYear();

    const currentMonthBills = apiResponse.filter(bill => {
        const billDate = new Date(bill.billdate);
        return billDate.getMonth() + 1 === currentMonth && billDate.getFullYear() === currentYear;
    });

    return currentMonthBills.length;
}

// Function to calculate the total revenue based on today's bills
export const getTotalRevenueBasedOnTodaysBills = (apiResponse) => {
    const today = new Date().toISOString().split('T')[0];
    const todayBills = apiResponse.filter(bill => bill.billdate.split('T')[0] === today);
    return todayBills.reduce((total, bill) => total + (bill.net_amount || 0), 0);
}

export const getTotalRevenueBasedOnCurrentMonth = (apiResponse) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Months are zero-based, so add 1
    const currentYear = today.getFullYear();

    const currentMonthBills = apiResponse.filter(bill => {
        const billDate = new Date(bill.billdate);
        return billDate.getMonth() + 1 === currentMonth && billDate.getFullYear() === currentYear;
    });

    return currentMonthBills.reduce((total, bill) => total + (bill.net_amount || 0), 0);
}

export const getTotalExpensesBasedOnCurrentMonth = (apiResponse) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1

    // Filter expenses for the current month
    const currentMonthExpenses = apiResponse.filter(expense => {
        const expenseDate = new Date(expense.expenseDate);
        return expenseDate.getMonth() + 1 === currentMonth;
    });

    // Calculate the total monthly expenses
    const totalMonthlyExpenses = currentMonthExpenses.reduce((total, expense) => total + expense.expenseAmount, 0);

    return totalMonthlyExpenses;
}

const moment = require('moment-timezone');

export const getCurrentDateAndTime = () => {
    const indianTimeZone = 'Asia/Kolkata';
    return moment().tz(indianTimeZone).format('LLL');
};

// Function to format a UTC string to IST
export const formatToIST = (utcString) => {
    const indianTimeZone = 'Asia/Kolkata';
    return moment(utcString).tz(indianTimeZone).format('LLL'); // 'LLL' format includes date and time
};

// Function to format a date and time to UTC string
export const formatToUTCString = (dateString) => {
    return new Date(dateString).toISOString();
};

export const formatDateAndTime = (dateString) => {
    const indianTimeZone = 'Asia/Kolkata';
    // const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: indianTimeZone };
    return moment(dateString).tz(indianTimeZone).format('LLL'); // 'LLL' format includes date and time
};
