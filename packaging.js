const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
(async() => {
    const data = await readFileAsync('affcsv.csv', 'utf8');
    console.log(data);
})();