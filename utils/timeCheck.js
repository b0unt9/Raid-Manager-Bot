const moment = require('moment-timezone');
moment.locale('ko');

module.exports = async (args) => {
    if (args.length === 0) return null;

    let now = moment();
    let date, result;

    if (moment(args, "HH시 mm분").isValid()) {
        if (args[0] === '내일') {
            date = String(args[1]).split(/시|분/);
            if (args[2]) date[1] = args[2].replace("분", "");
        } else {
            date = String(args[0]).split(/시|분/);
            if (args[1]) date[1] = args[1].replace("분", "");
        }

        result = moment().tz("Asia/Seoul").hours(date[0]).minutes(date[1]).seconds(0).milliseconds(0);

        if (args[0] === '내일') result.tz("Asia/Seoul").add("1", "d");

        if (moment(result).diff(now, "minutes") <= 0) {
            if (date[0] > 12 || !(moment(result).diff(moment(now).subtract("721", "m"), "m") > 0)) {
                result.add("1", "d");
            }
            else result.add("12", "hours");
        }

        return result;
    } else {
        throw 'wrongTime';
    }
};