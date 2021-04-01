const express = require('express');
const { io } = require('../../config');

const loggerController = require('../controllers/loggerController');
const fileController = require('../controllers/fileController');

const router = express.Router();

const webSocketMiddleware = (req, res, next) => {
  io.emit('chat message', res.locals.logs);
  next();
};

// route to retrieve all logs
router.get('/logs',
  loggerController.getLogs,
  (req, res) => res.status(200).json(res.locals.logs));

// route to post all types of logs: client, sever, requests
router.post('/logs/:type',
  fileController.getFileSize,
  fileController.splitFile,
  fileController.resetFile,
  loggerController.addLogs,
  loggerController.getLogs,
  webSocketMiddleware,
  (req, res) => res.status(200).json(`Added ${req.params}logs`));

// route to delete current logs in allLogs.json
router.delete('/logs/delete',
  loggerController.deleteLogs,
  (req, res) => res.status(200).json('deleted AllLogs.json'));

// route to detete all old logs
router.delete('/logs/deleteAll',
  fileController.deleteOldLogs,
  (req, res) => res.status(200).json('deleted all old json logs'));

module.exports = router;
