function isInteger(inputString) {
    const regex = /^[+-]?\d+$/;
    return regex.test(inputString);
}

export const GeneratePatientID = (name) => {
    // Remove non-alphabetic characters and convert to uppercase
    const cleanedName = name.replace(/[^A-Za-z]/g, "").toUpperCase();

    // Initialize a variable to store the continuous substring
    let continuousSubstring = "";

    // Find the first substring of at least 4 continuous characters
    for (let i = 0; i < cleanedName.length - 3; i++) {
        const substring = cleanedName.slice(i, i + 4);
        if (/^[A-Z]+$/.test(substring)) {
            continuousSubstring = substring;
            break;
        }
    }

    // Generate a random number between 0 and 999
    const randomNum = Math.floor(Math.random() * 1000);

    // Create the patient ID by combining the continuous substring and random number
    const patientID = continuousSubstring + randomNum;

    return patientID;
};

export const checkForEmptyString = (textData) => {
    if (!textData || textData.length === 0) {
        return true;
    }
    return false;
};

export const checkForStringLength = (textData, count) => {
    if (textData.trim().length > count) {
        return false;
    }
    return true;
};

export const checkForStringMinLengthLimit = (textData, minCount) => {
    if (textData.trim().length < minCount) {
        return true;
    }
    return false;
};

export const validateDate = (inputDate) => {
    // Regular expression for "yyyy-MM-dd" format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateRegex.test(inputDate)) {
        const parts = inputDate.split("-");
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);

        // Check if it's a valid date (e.g., no February 30)
        const isValidDate = new Date(year, month - 1, day).getDate() === day;

        return isValidDate;
    } else {
        return false;
    }
}

function validatePhoneNumber(phoneNo) {
    const phoneNumberPattern = /^[0-9]{10}$/;
    const isValidNumber = phoneNumberPattern.test(phoneNo);
    return isValidNumber;
}

export const validateStringData = (
    inputStr,
    emptyStringCheck,
    stringLengthCheck,
    maxStringLength,
    errorMsg
) => {
    if (emptyStringCheck) {
        if (checkForEmptyString(inputStr)) {
            return errorMsg;
        }
    }
    if (stringLengthCheck) {
        if (!checkForStringLength(inputStr, maxStringLength)) {
            return errorMsg;
        }
    }
    return "";
};

export const validateFNLN = (firstName, lastName) => {
    let fName = "";
    let lName = "";
    if (checkForEmptyString(firstName) || checkForEmptyString(lastName)) {
        if (checkForEmptyString(firstName)) {
            if (!checkForStringLength(firstName, 100)) {
                return "Error - First Name exceeds 100 characters!";
            }
            fName = firstName.trim();
        }
        if (checkForEmptyString(lastName)) {
            if (!checkForStringLength(firstName, 100)) {
                return "Error - Last Name exceeds 100 characters!";
            }
            lName = lastName.trim();
        }
    }
    const text1 = "SMHC";
    const text2 = `${fName}`;
    const text3 = `${lName}`;
    const text4 = `${Math.floor(Math.random() * 1000)}`;
    const patientId = text1.concat(text2).concat(text3).concat(text4);

    return patientId;
};

export const validateFirstName = (firstName) => {
    if (checkForEmptyString(firstName)) {
        return "First Name is required!";
    }
    if (!checkForStringLength(firstName, 100)) {
        return "First Name exceeds 100 characters!";
    }
    // if (!checkForValidName(firstName)) {
    //   return "First Name is invalid!";
    // }
    return "";
};

export const validateLastName = (lastName) => {
    if (checkForEmptyString(lastName)) {
        return "Last Name is required!";
    }
    if (!checkForStringLength(lastName, 100)) {
        return "Last Name exceeds 100 characters!";
    }
    // if (!checkForValidName(lastName)) {
    //   return "Last Name is invalid!";
    // }
    return "";
};

export const validateMiddleName = (middleName) => {
    if (middleName) {
        if (!checkForStringLength(middleName, 100)) {
            return "Middle Name exceeds 100 characters!";
        }
        // if (!checkForValidName(middleName)) {
        //   return "Last Name is invalid!";
        // }
    }
    return "";
};

export const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (checkForEmptyString(email)) {
        if (!emailPattern.test(email)) {
            return "Invalid email address";
        }
    }
    return "";
};

export const validateEmailId = (email) => {
    var re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
    if (!validatePhoneNumber(phone)) {
        return "Invalid phone number (required 10 digits)";
    }
    return "";
};

export const validateCellPhone = (cellPhone) => {
    if (checkForEmptyString(cellPhone)) {
        if (!validatePhoneNumber(cellPhone)) {
            return "Invalid cell phone number (10 digits)";
        }
    }
    return "";
};

export const validateWorkPhone = (workPhone) => {
    if (checkForEmptyString(workPhone)) {
        if (!validatePhoneNumber(workPhone)) {
            return "Invalid work phone number (10 digits)";
        }
    }
    return "";
};

export const validateRegion = (region) => {
    if (region) {
        if (!checkForStringLength(region, 50)) {
            return "Region exceeds 50 characters!";
        }
        // if (!checkForValidName(region)) {
        //   return "Region is invalid!";
        // }
    }
    return "";
};

// Validation logic for City
export const validateCity = (city) => {
    if (city) {
        if (!checkForStringLength(city, 50)) {
            return "City exceeds 50 characters!";
        }
        // if (!checkForValidName(city)) {
        //   return "City is invalid!";
        // }
    }
    return "";
};

// Validation logic for Address
export const validateAddress = (address) => {
    if (address) {
        if (!checkForStringLength(address, 250)) {
            return "Address exceeds 250 characters!";
        }
    }
    return "";
};

export const validateState = (state) => {
    if (state) {
        if (!checkForStringLength(state, 50)) {
            return "State exceeds 50 characters!";
        }
        // if (!checkForValidName(state)) {
        //   return "State is invalid!";
        // }
    }
    return "";
};

export const validateCountry = (country) => {
    if (country) {
        if (!checkForStringLength(country, 50)) {
            return "Country exceeds 50 characters!";
        }
        // if (!checkForValidName(country)) {
        //   return "Country is invalid!";
        // }
    }
    return "";
};

export const validateDateOfBirth = (dateOfBirth) => {
    if (!validateDate(dateOfBirth)) {
        return "Invalid Date of Birth!";
    }
    return "";
};

export const validateAge = (age) => {
    if (!checkForEmptyString(age)) {
        const intCheck = isInteger(age);
        if (!intCheck) {
            return "Invalid age entered!";
        }
    } else {
        return "Age is required!";
    }
    return "";
};

export const validateSex = (sex) => {
    if (checkForEmptyString(sex)) {
        return "Gender is required!";
    }
    return "";
};

export const validateDoctors = (doctor) => {
    if (checkForEmptyString(doctor)) {
        return "Referral Doctor is required!";
    }
    return "";
};

export const validateHospitals = (hospital) => {
    if (checkForEmptyString(hospital)) {
        return "Referral Hospital is required!";
    }
    return "";
};

export const validateMaritalStatus = (maritalStatus) => {
    if (checkForEmptyString(maritalStatus)) {
        return "Marital Status is required!";
    }
    return "";
};

export const validateEmergencyContact = (emergencyContact) => {
    if (!validatePhoneNumber(emergencyContact)) {
        return "Invalid emergency contact number (10 digits)";
    }
    return "";
};

export const validateAllergies = (allergies) => {
    if (allergies) {
        if (!checkForStringLength(allergies, 2500)) {
            return "Allergies exceeds maximum characters allowed!";
        }
    }
    return "";
};

export const validatePreExistingConditions = (preExistingConditions) => {
    if (preExistingConditions) {
        if (!checkForStringLength(preExistingConditions, 2500)) {
            return "Pre existing conditions exceeds maximum characters allowed!";
        }
    }
    return "";
};

//add more validations here
export const checkLoginData = (email, pwd) => {
    let isEmailDataValid = true;
    let isPasswordDataValid = true;
    // Check if Email entered is valid
    if (!email || !validateEmailId(email) || checkForEmptyString(email)) {
        isEmailDataValid = false;
    }

    // Check if Password entered is valid
    if (
        !pwd ||
        checkForEmptyString(pwd) ||
        checkForStringMinLengthLimit(pwd, 8)
    ) {
        isPasswordDataValid = false;
    }

    if (!isEmailDataValid && isPasswordDataValid) {
        return "Please enter valid Email address";
    } else if (isEmailDataValid && !isPasswordDataValid) {
        return "Please enter valid Password";
    } else if (!isEmailDataValid && !isPasswordDataValid) {
        return "Please enter valid Email address & Password";
    } else {
        return "";
    }
};

export const validateEmptyData = (inputData) => {
    if (checkForEmptyString(inputData)) {
        return "Data is required!";
    }
    return "";
};
