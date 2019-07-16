import express from 'express';
import path from 'path';
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

export default (treeData) => {
    app.get('/treeData', (_req, res) => res.json(treeData));
    app.listen(port, () => console.log('Listening on :' + port));
};
