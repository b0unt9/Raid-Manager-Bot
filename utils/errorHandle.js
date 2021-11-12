module.exports = async (err) => {
    let errMsg;
    switch (err) {
        case "notExist":
            errMsg = "존재하지 않는 레이드입니다";
            break;
        case "fullMember":
            errMsg = "모집이 마감된 레이드입니다";
            break;
        case "alreadyJoin":
            errMsg = "이미 참여한 레이드입니다";
            break;
        case "raidMaster":
            errMsg = "레이드 공대장은 레이드에서 나올 수 없습니다. 다른 공대원에게 공대장을 위임한 뒤 시도하십시오";
            break;
        case "notMember":
            errMsg = "해당 레이드의 공대원이 아닙니다";
            break;
        case "wrongTime":
            errMsg = "잘못된 시간 형식입니다";
            break;
        case "emptyRaidID":
            errMsg = "레이드 ID를 입력해주세요";
            break;
        case "wrongRaidID":
            errMsg = "올바르지 않은 레이드 ID 입니다";
            break;
        default:
            errMsg = err;
            break;
    }

    errMsg = "**⚠ " + errMsg + "**";

    return errMsg;
};