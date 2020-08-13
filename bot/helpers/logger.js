const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";

const isTestEnv = process.env.NODE_ENV === 'test';

const logRefreshData = () => !isTestEnv ? console.log(FgBlack,`************************************** \n****        REFRESHING DATA        **** \n***************************************`) : '';

const logInfo = info => !isTestEnv ? console.log(FgYellow,`*****       ${info}       ******`) : '';

const logEndOfInfo = info => !isTestEnv ? console.log(FgYellow,`-----------END OF ${info}-----------\n`) : '';

const logTable = (data, info) => {
    console.log('isTestEnv defined ' + isTestEnv)
    if(!isTestEnv) {
        logInfo(info);
        console.table(FgBlack, data);
        logEndOfInfo(info);
    }
};

const logOrders = (data, type) => !isTestEnv ? console.log(type === 'bid' ? FgGreen : FgRed ,data) : '';

export {
    logRefreshData,
    logTable,
    logOrders,
    logInfo,
    logEndOfInfo
}
