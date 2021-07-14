const moment = require('moment');
require('moment-timezone');
moment.locale('ko');

module.exports = function timeCheck(args, cb) {
    let date, now = moment();
    if (!args[0]) {
        return cb(null, null);
    } else if (args[0] == '내일') {
        if (!args[1]) {
            return cb("**시작 시간을 입력해주세요**", null);
        }
        if (moment(args[1], "HH시mm분").isValid()) {
            let min, time = String(args[1]).split(/시|분/);
            if (args[2]) {
                if (moment(args[2], "mm분").isValid()) {
                    min = args[2].replace("분", "");
                } else {
                    return cb("**시간 형식이 맞지 않습니다**", null);
                }
            }
            return cb(null, moment().hours(time[0]).minutes(time[1] | min).seconds('0').milliseconds('0').add("1", "d"));
        } else {
            return cb("**시간 형식이 맞지 않습니다**", null);
        }
    } else {
        if (moment(args[0], "HH시mm분").isValid()) {
            let min, time = String(args[0]).split(/시|분/);
            if (args[1]) {
                if (moment(args[1], "mm분").isValid()) {
                    min = args[1].replace("분", "");
                } else {
                    return cb("**시간 형식이 맞지 않습니다**", null);
                }
            }
            date = moment().hours(time[0]).minutes(time[1] | min).seconds('0').milliseconds('0');
            if (moment(date).diff(now, "minutes") <= 0) {
                if (time[0] > 12) {
                    return cb(null, moment(date).add("24", "hours"));
                }
                if (moment(date).diff(moment(now).subtract("721", "m"), "m") > 0) {
                    return cb(null, moment(date).add("12", "hours"));
                } else {
                    return cb(null, moment(date).add("24", "hours"));
                }
            } else {
                return cb(null, date)
            }
        } else {
            return cb("**시간 형식이 맞지 않습니다**", null);
        }
    }
}