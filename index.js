const axios = require('axios');
const moment = require('moment');

const cookie = "cta_clientId=8cf303e6-0950-47e6-b120-e9585e52a964; _ga=GA1.2.234275099.1631730088; hubspotutk=eada51d24cd349791646c57a02755a9d; cta_sessionId=13e12e17-c06e-4d2e-af76-b9c432fe939f; cta_referrer=https://www.google.com/; _gid=GA1.2.893984698.1644429530; _gcl_au=1.1.1034085831.1644429530; _hjSessionUser_1911498=eyJpZCI6ImQ1N2IzNzkwLTY2OGUtNTYwYi05Njg5LTZhZjhiNGJlZWRlOCIsImNyZWF0ZWQiOjE2NDQ0Mjk1MzA4ODAsImV4aXN0aW5nIjpmYWxzZX0=; _hjFirstSeen=1; _hjSession_1911498=eyJpZCI6ImIzOWRiNzAwLTA4YzQtNDgyYy04YTlhLTU3ZjI2NmI0YWI2MCIsImNyZWF0ZWQiOjE2NDQ0Mjk1MzA5OTAsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; outbrain_cid_fetch=true; __hstc=191357685.eada51d24cd349791646c57a02755a9d.1631730097271.1631730097271.1644429542808.2; __hssrc=1; intercom-id-pkucd0o6=b4f478db-774d-45f5-ab89-1609b501b228; intercom-session-pkucd0o6=; session=2|1:0|10:1644429565|7:session|48:NDQ1NGNmODgtOGYzZS00MmYyLWFjN2QtOTU2MGM2MzIxMzc5|56ce36b3d312e352fed2f1a0c6795c7ff29f4a2d7de1573641f20064077cc486; _spirit=4908f58c-587e-4e39-9aa6-277c20674938; _uetsid=f3b32a5089d111ec89f783096188dc08; _uetvid=bee99200165111ec85a30743f7b3cc7f; __hssc=191357685.2.1644429542808";
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
