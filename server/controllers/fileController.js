const fs = require('fs');
const path = require('path');

const headFile = 100;
let fileTracker = headFile;

// set the current file limit to split
const fileLimit = 500000; // 500kB for now

const fileController = {};

// middleware to get size of the allLogs.json file
fileController.getFileSize = (req, res, next) => {
  // get the current size of the file and save in res.locals.stats
  res.locals.stats = fs.statSync(path.resolve(__dirname, '../data/allLogs.json'));

  // go to next middleware
  return next();
};

// middlware to rename allLogs.json file to allLogs{fileTracker} format
fileController.splitFile = (req, res, next) => {
  // if the current file size is bigger than fileLimit value
  if (res.locals.stats.size > fileLimit) {
    // set the res.locals.fileFlag to true
    res.locals.fileFlag = true;

    // rename the current allLogs.json file to allLogs{fileTracker} format
    fs.rename(path.resolve(__dirname, '../data/allLogs.json'), path.resolve(__dirname, `../data/allLogs${fileTracker}.json`), () => {
      console.log('new file created');
    });

    // go to next middleware
    return next();
  }

  // go to next middleware
  return next();
};

// middleware to reset the value of allLogs.json to empty array
fileController.resetFile = (req, res, next) => {
  // if the res.locals.fileFlag value is true
  if (res.locals.fileFlag) {
    // overwirte the value of allLogs.json file to empty array
    fs.writeFileSync(path.resolve(__dirname, '../data/allLogs.json'), JSON.stringify([]), 'utf8');

    // increment the fileTracker by one
    fileTracker++;

    // go to next middleware
    return next();
  }

  // go to next middleware
  return next();
};

fileController.deleteOldLogs = (req, res, next) => {
  for (let i = headFile; i < fileTracker; i++) {
    try {
      fs.unlinkSync(path.resolve(__dirname, `../data/allLogs${i}.json`));
    } catch (e) {
      console.log(e);
    }
  }
  return next();
};

module.exports = fileController;
