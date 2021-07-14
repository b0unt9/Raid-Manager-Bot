const mongoose = require('mongoose');

let databaseSchema = new mongoose.Schema({
    serverid: [String], //레이드 진행 Guild ID
    raidid: String, //레이드 고유 ID
    raidtype: Number, //레이드 종류 (1: 칠흑 2: 철마 3: 칠흑&철마)
    raidmaster: String, //레이드 공대장
    raidmember: [String], //레이드 공대원 리스트
    raiddetail: String, //레이드 세부정보
    channelid: [String], //최근 레이드 안내 메세지 채널 ID
    textid: [String], //최근 레이드 안내 메세지 ID
    starttime: Date //레이드 시작 예정 시각
});

module.exports = mongoose.model('raid', databaseSchema);