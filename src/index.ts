import express from "express";
import cors from 'cors';
import { connect as dbConnect } from './config/dbConnect';
import { router } from "./routes/index";

let cookieParser = require('cookie-parser');

require('dotenv').config();

let app = express();
dbConnect();
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND || "http://localhost:4200",
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(router);

app.listen('8000', () => {
  console.log("server's up");
});



