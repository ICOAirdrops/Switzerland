import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import fmt from 'string-template';
// import people from '../app/index.js';

const app = express();
app.use(cors());
app.use(compression());

const example = path.resolve('./example/app');
const vendor = path.resolve(process.env.NODE_ENV === 'production' ? './es/production' : './src');

app.get('*', (_, response, next) => {
    response.header('Service-Worker-Allowed', '/');
    next();
});

app.get('/', (_, response) => {
    // console.log(people);
    const html = fs.readFileSync(`${example}/index.html`, 'utf-8');
    response.send(fmt(html, { app: 'x' }));
});

app.use('/vendor', express.static(vendor));
app.use(express.static(example));

app.listen(process.env.PORT ?? 3000);
