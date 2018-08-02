module.exports = class Logger {
    constructor(scriptName) {
        this.scriptName = scriptName;
    }
    
    d(msg) {
        let date = new Date();
        console.log(date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds() + date.getMilliseconds() + '|' + this.scriptName + ': ' + msg);
    }
    
    i(msg) {
        console.log(this.scriptName + ': ' + msg);
    }
    
    c(msg) {
        console.log(msg);
    }
    
    n(msg) {
        electron_log.info(this.scriptName + ' | ' + msg);
    }
    
    ln(msg) {
        this.d(msg);
        this.n(msg);
    }
};