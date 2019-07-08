const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
// const writeFileAsync = promisify(fs.writeFile);
const csvParse = require('csv-parse');
const csvParseAsync = promisify(csvParse);
const { assocDictByLong } = require('./globalSymbols');
const analyzeData = require('./analysis');

(async() => {
    // Get data
    const data = await readFileAsync('affcsv.csv', 'utf8');
    const jsonData = await csvParseAsync(data);
    
    // Categorize data
    const questionTitles = jsonData[0];
    // const questionTexts = jsonData[1];
    // const importIDs = jsonData[2]; // what even are these??
    const surveyResponses = jsonData.slice(3);

    // Arrange data
    const arrangedResponses = [];
    for (let response of surveyResponses) {
        const arrRes = new Map();
        questionTitles.forEach((title, i) => {
            arrRes.set(title, response[i]);
        });
        arrangedResponses.push(arrRes);
    }
    // const titlesToTexts = questionTitles.reduce((obj, title, i) => { obj[title] = questionTexts[i]; return obj; }, {});

    // Filter for only completed surveys
    const compSymbol = questionTitles[5];
    const compArrRes = arrangedResponses.filter(res => res.get(compSymbol) === 'True');

    // Extract buckets
    
    const resByAssoc = {};
    Object.entries(assocDictByLong).forEach(([, assoc]) => { resByAssoc[assoc] = []; });
    
    const assocSymbol = questionTitles[11];
    for (let res of compArrRes) {
        const assoc = res.get(assocSymbol);
        resByAssoc[assocDictByLong[assoc]].push(res);
    }

    // Analysis
    analyzeData({
        arrangedResponses,
        compArrRes,
        resByAssoc,
        questionTitles
    });

    // Print graph of something

    /*
    const screen = blessed.screen(),
          graph = blessedContrib.bar({
              label: 'Test graph',
              barWidth: 4,
              barSpacing: 6,
              xOffset: 0,
              maxHeight: 9
          });
    screen.append(graph);
    graph.setData({
        titles: ['bar 1', 'bar 2'],
        data: [5, 10]
    });
    setInterval( () => { screen.render() }, 1000);
    */

})();