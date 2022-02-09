const axios = require('axios');
const moment = require('moment');

const cookie = "";
const start_date = moment('07-12-2021', "DD-MM-YYYY");
const end_date = moment();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomChecks = () => {
    const checkInHour = getRandomInt(0, 15);
    const checkInMinutes = getRandomInt(0, 59);
    const checkOutHour = getRandomInt(checkInHour + 2, checkInHour + 8);
    const checkOutMinute = getRandomInt(0, 59);
    return {
        checkInHour,
        checkInMinutes,
        checkOutHour,
        checkOutMinute
    }
}

const submitShift = async (date) => {
    try {
        const shiftTime = generateRandomChecks()
        const timeIn = moment(date, "DD-MM-YYYY")
            .set({
                hours: shiftTime.checkInHour,
                minutes: shiftTime.checkInMinutes
            })
            .unix();

        const timeOut = moment(date, "DD-MM-YYYY")
            .set({
                hours: shiftTime.checkOutHour,
                minutes: shiftTime.checkOutMinute
            })
            .unix();

        const req = await axios.post(
            'https://app.connecteam.com/api/UserDashboard/PunchClock/ShiftRequest/',
            {
                "tagId": "default3",
                "punchInTime": timeIn,
                "punchOutTime": timeOut,
                "shiftAttachments": [
                    {
                        "id": "65cbb88e-6c3a-41b1-8822-975caed50def",
                        "type": "freeText",
                        "freeText": ""
                    },
                    {
                        "id": "8c013420-5071-4803-b1b5-1920dfbc6018",
                        "type": "dropdownList",
                        "itemId": ""
                    },
                    {
                        "id": "68de5de0-db73-401f-8fad-3376560e5a8f",
                        "type": "number",
                        "number": null
                    }
                ],
                "note": "",
                "approvalNote": "",
                "objectId": 947656,
                "timezone": "Africa/Cairo",
                "_spirit": "4908f58c-587e-4e39-9aa6-277c20674938"
            },
            {
                headers: {
                    cookie,
                    origin: 'https://app.connecteam.com',
                }
            }
        );
        console.log(req)
    } catch (error) {
        console.log(error.toJSON())
    }
}

const dates = [];

const createDates = (initial_date) => {
    const new_date = initial_date.add(1, "day");
    const day = moment(new_date).format('dddd');
    const isWeekend = day === 'Sunday' || day === 'Saturday';
    if (new_date.isBefore(end_date)) {
        if (!isWeekend) {
            dates.push(new_date.format('DD-MM-YYYY'));
            createDates(new_date);
        } else {
            createDates(new_date);
        }
    }
}

createDates(start_date);

dates.forEach(async (date) => {
    await submitShift(date);
});
