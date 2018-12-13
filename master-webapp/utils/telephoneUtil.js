function hindPhoneNumber(phoneNumber) {
    return phoneNumber.substr(0, 3) + '****' + phoneNumber.substr(7);
}

export default {hindPhoneNumber}