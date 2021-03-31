// const fs = require('fs');
// const path = require('path');

// let fileTracker = 100;

// const stats = fs.statSync(path.resolve(__dirname, '../data/allLogs.json'));

// console.log(stats.size);

// if (stats.size > 5000) {
// eslint-disable-next-line max-len
//   fs.rename(path.resolve(__dirname, '../data/allLogs.json'), path.resolve(__dirname, `../data/allLogs${fileTracker}.json`), () => {
//     console.log('new file created');
//   });
//   fs.writeFileSync(path.resolve(__dirname, '../data/allLogs.json'), JSON.stringify([]), 'utf8');
//   fileTracker++;
// }
