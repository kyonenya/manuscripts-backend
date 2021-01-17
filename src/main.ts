import express from 'express';
import helmet from 'helmet';
import router from './router';

const app = express();
app.use(helmet());

app.use('/', router);


const port = 3000;
app.listen(port, () => console.log(`listening... port: ${port}`));
