const fs = require('fs');
const path = require('path');

const loggerController = {};

// middleware to get all type of logs
loggerController.getLogs = (req, res, next) => {
  // read all logs from saved files
  const clientLogs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/clientLogs.json'), 'UTF-8'));
  const serverLogs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/serverLogs.json'), 'UTF-8'));
  const requests = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/request.json'), 'UTF-8'));

  if (!clientLogs || !serverLogs) {
    return next({
      log: 'loggerController.getLogs:  ERROR: Error getting logs data from clientLogs.json and/or serverLog.json file',
      message: { err: 'Error occurred in loggerController.getLogs. Check server logs for more details.' },
    });
  }

  res.locals.logs = [];

  clientLogs.filter((el) => res.locals.logs.push({
    class: 'Client',
    type: el.type,
    timestamp: el.timestamp,
    log: el.arguments[0],
  }));

  serverLogs.filter((el) => res.locals.logs.push({
    class: 'Server',
    type: el.type,
    timestamp: el.timestamp,
    log: el.arguments[0],
  }));

  requests.filter((el) => res.locals.logs.push({
    class: 'Request',
    timestamp: el.timestamp,
    method: el.method,
    originalUri: el.originalUri,
    uri: el.uri,
    requestData: el.requestData,
    referer: el.referer,
  }));

  requests.filter((el) => res.locals.logs.push({
    class: 'Response',
    timestamp: el.timestamp,
    fromIP: el.fromIP,
    responseData: el.responseData,
    responseStatus: el.responseStatus,
  }));

  return next();
};

// middleware to get spefic type of log
loggerController.getSpecificLog = (req, res, next) => {
  const { type } = req.params;
  let logFile = {};
  res.locals.logs = [];
  switch (type) {
    // if type is client or server
    case ('client' || 'server'):
      // read log file and assigned to logFile
      logFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/${type}Logs.json`), 'UTF-8'));

      // error handling
      if (!logFile) {
        return next({
          log: `loggerController.getLogs:  ERROR: Error getting logs data from ${type}Logs.json and/or serverLog.json file`,
          message: { err: 'Error occurred in loggerController.getSpecificLog. Check server logs for more details.' },
        });
      }

      // for client/server , filter logs for each key/values pair and push into the res.locals.log
      logFile.filter((el) => res.locals.logs.push({
        class: `${type}`,
        type: el.type,
        timestamp: el.timestamp,
        log: el.arguments[0],
      }));

      break;

    // if type is request or respond
    case ('request' || 'respond'):

      // read log file and assigned to logFile
      logFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/request.json`), 'UTF-8'));

      // error handling
      if (!logFile) {
        return next({
          log: `loggerController.getLogs:  ERROR: Error getting logs data from ${type}Logs.json and/or serverLog.json file`,
          message: { err: 'Error occurred in loggerController.getSpecificLog. Check server logs for more details.' },
        });
      }

      if (type === 'request') {
        // for request type, filter logs for each key/values pair and push into the res.locals.log
        logFile.filter((el) => res.locals.logs.push({
          class: `${type}`,
          timestamp: el.timestamp,
          method: el.method,
          originalUri: el.originalUri,
          uri: el.uri,
          requestData: el.requestData,
          referer: el.referer,
        }));
      } else {
        // for response type, filter logs for each key/values pair and push into the res.locals.log
        logFile.filter((el) => res.locals.logs.push({
          class: `${type}`,
          timestamp: el.timestamp,
          fromIP: el.fromIP,
          responseData: el.responseData,
          responseStatus: el.responseStatus,
        }));
      }
      break;

    default: break;
  }

  return next();
};

// middleware to add client and server console log to files
loggerController.addLogs = (req, res, next) => {
  const { type } = req.params;
  const logs = req.body;
  let obj = {
    table: [],
  };
  if (!logs) {
    return next({
      log: 'loggerController.addSeverLogs:  ERROR: Error receiving severLogs data from Application',
      message: { err: 'Error occurred in loggerController.addSeverLogs. Check server logs for more details.' },
    });
  }

  // check if ther file already exist
  fs.readFile(path.resolve(__dirname, `../data/${type}Logs.json`), 'utf8', (error, data) => {
    if (error) {
      fs.writeFile(path.resolve(__dirname, `../data/${type}Logs.json`), '[]', (err) => {
        if (err) {
          return next({
            log: 'loggerController.addSeverLogs:  ERROR: Error receiving severLogs data from Application',
            message: { err: 'Error occurred in loggerController.addSeverLogs. Check server logs for more details.' },
          });
        }
      });
    }
    obj = JSON.parse(data);
    obj.push(logs);
    fs.writeFileSync(path.resolve(__dirname, `../data/${type}Logs.json`), JSON.stringify(obj), 'UTF-8');
    return next();
  });
  return next();
};

// middleware to add request/respond logs to file
loggerController.addRequests = (req, res, next) => {
  // assign incoming req.body to request variable
  const requests = req.body;

  // create an emtpy object to hold all the existing json elements
  let obj = {
    table: [],
  };

  // if incoming request body is null value, return an error
  if (!requests) {
    return next({
      log: 'loggerController.addRequests: ERROR: Error receiving Requests data from Application',
      message: { err: 'Error occurred in loggerController.addRequests. Check server logs for more details.' },
    });
  }

  // read the existing request_respose json file
  fs.readFile(path.resolve(__dirname, '../data/request.json'), 'utf8', (err, data) => {
    if (err) {
      return next({
        log: 'loggerController.addSeverLogs: ERROR: Error reading existing severLogs data from serverLogs.json file',
        message: { err: 'Error occurred in loggerController.addSeverLogs. Check server logs for more details.' },
      });
    }

    // save all the existing data to exmpty obj
    obj = JSON.parse(data);

    // push the new incoming request data to obj
    obj.push(requests);

    // write object obj that hold all existing data and new requests to request_response json file
    fs.writeFileSync(path.resolve(__dirname, '../data/request.json'), JSON.stringify(obj), 'UTF-8');
    return next();
  });
  return next();
};
module.exports = loggerController;
