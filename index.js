import express from "express";
import mongoose from "mongoose";
// import cors from "cors";

import { registerValidation, loginValidation } from "./validation.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import * as UserController from "./controllers/UserController.js";

const DB = 'mongodb+srv://admin:admin@cluster1.jflpjkq.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster1'

mongoose.connect(
  DB
).then(() => {
  console.log('DB connected!');
}).catch(err => {
  console.log('DB error', err);
});

const app = express();
app.use(express.json());

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(3003, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server started!');
});