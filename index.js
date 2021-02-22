require('dotenv').config();
const env = process.env;
process.env['WEB_APP_PORT'] = 3000;
console.log(process.env['WEB_APP_PORT']);