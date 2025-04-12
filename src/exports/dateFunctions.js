//This solution to mysql dates was found at: https://stackoverflow.com/a/65558183
//This saves me the time of writing these functions myself...
//I hate formatting dates!
module.exports.formatDate = (date) => {
    const _date = new Date(date);
    const day = _date.getDate();
    const month = _date.getMonth() + 1;
    const year = _date.getFullYear();
    return `${year}-${month}-${day}`;
}

module.exports.formatTime = (date) => {
    const _date = new Date(date);
    const hours = _date.getHours()
    const minutes = _date.getMinutes();
    let seconds = _date.getSeconds();
    if(seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}

module.exports.toDateTimestamp = (date) => {
    const dateStamp = this.formatDate(date);
    const timeStamp = this.formatTime(date);
    return `${dateStamp} ${timeStamp}`
}