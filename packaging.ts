import * as fs from 'fs';
import { promisify } from 'util';
import csvParse from 'csv-parse';
import { QuestionTitle, ResByAssoc, assocDictByLong } from './globalSymbols';
import analyzeData from './analysis';
import debugFn from 'debug';
import server from './server';

const debug = debugFn('packaging');
const readFileAsync = promisify(fs.readFile);
const csvParseAsync: (a: string) => Promise<any> = promisify(csvParse);


(async() => {
    // Get data
    debug('Loading files');
    const data = await readFileAsync('affcsv.csv', 'utf8');
    const jsonData = await csvParseAsync(data);
    debug('Files loaded and parsed');

    // Categorize data
    const questionTitles: QuestionTitle[] = jsonData[0];
    const surveyResponses = jsonData.slice(3);

    // Arrange data
    const arrangedResponses: Map<QuestionTitle,string>[] = [];
    for (let response of surveyResponses) {
        const arrRes = new Map();
        questionTitles.forEach((title, i) => {
            arrRes.set(title, response[i]);
        });
        arrangedResponses.push(arrRes);
    }
    debug('Data arranged');

    // Filter for only completed surveys
    const compSymbol = questionTitles[5];
    const compArrRes = arrangedResponses.filter(res => res.get(compSymbol) === 'True');
    debug('Responses filtered');

    // Extract buckets
    const resByAssoc: ResByAssoc = {};
    Object.entries(assocDictByLong).forEach(([, assoc]) => { resByAssoc[assoc] = []; });

    const assocSymbol = questionTitles[11];
    for (let res of compArrRes) {
        const assoc = res.get(assocSymbol);
        resByAssoc[assocDictByLong[assoc]].push(res);
    }
    debug('Responses extracted');

    // Analysis
    const outputTree = analyzeData({
        arrangedResponses,
        compArrRes,
        resByAssoc,
        questionTitles
    });
    debug('Analysis complete');

    debug('Starting server');
    server(outputTree);

})();