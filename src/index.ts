import express from "express";
import cors from 'cors';
import { connect as dbConnect } from './config/dbConnect';
import { router } from "./routes/index.routes";
// import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
// import YAML from 'yaml'


let cookieParser = require('cookie-parser');
// const swaggerDocument = YAML.parse(fs.readFileSync('./api-docs.yaml', 'utf8'))
require('dotenv').config();

let app = express();
dbConnect();
app.use(cookieParser());
let origins: string[] = [];
if (process.env.FRONTEND) {
  origins = process.env.FRONTEND.split(' ');
}
else {
  origins = ["http://localhost:3001"];
}
app.use(cors({
  credentials: true,
  origin: origins,
  methods: "GET, POST, OPTIONS, PUT, DELETE, PATCH",
}));
console.log(origins);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(router);

app.listen('8000', () => {
  console.log(`server's up at` );
});


