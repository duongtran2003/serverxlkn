import express from "express";
import cors from 'cors';
let cookieParser = require('cookie-parser');

const dotenv = require('dotenv').config();

let app = express();
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND || "http://localhost:4200",
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.listen('8000', () => {
  console.log("server's up");
});



