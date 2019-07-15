import express from 'express';
const app = express();
const port = 3000;
app.use(express.static('public'));

export default (treeData) => {
    app.get('/treeData', (_req, res) => res.json(treeData));
    app.listen(port, () => console.log('Listening on :' + port));
};
