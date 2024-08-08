import express from "express";
import mongoose from "mongoose";
import config from "config";
import cors from "cors";

import { registerValidation, loginValidation } from "./validation.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import * as UserController from "./controllers/UserController.js";

const app = express();
const PORT = config.get('port') ?? 3003;

mongoose.connect(
  config.get('mongoUri')
).then(() => {
  console.log('DB connected!');
}).catch(err => {
  console.log('DB error', err);
});

app.use(express.json());
app.use(cors())

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server started!');
});