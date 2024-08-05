import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { registerValidation } from "./validation/validation.js";
import UserModel from "./models/User.js";

const KEY = "secretKeyforUser";
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

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const pass = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(pass, salt);

    const document = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: passHash,
    });

    const user = await document.save();

    const token = jwt.sign({
      id: user._id
    }, KEY, { expiresIn: '30d' });

    const { password, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не удалось зарегистрироваться!' });
  }
})

app.listen(3003, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server started!');
});