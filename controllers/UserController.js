import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "config";
import UserModel from "../models/User.js";

const KEY = config.get("secretKey");

export const register = async (req, res) => {
  try {
    const { email, password: pass } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Пользователь с такой почтой уже есть!" })
    }

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(pass, salt);

    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: passHash,
    });

    const token = jwt.sign({
      id: user._id
    }, KEY, { expiresIn: '30d' });

    const { password, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не удалось зарегистрироваться!' });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден!' });
    }

    if (user) {
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Неверный логин или пароль!' });
      }

      const token = jwt.sign({
        id: user._id
      }, KEY, { expiresIn: '30d' });

      const { password, ...userData } = user._doc;

      res.json({ ...userData, token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не удалось авторизоваться!' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userID);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден!'
      });
    }

    const { password, ...userData } = user._doc;

    res.json(userData);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Нет доступа!' });
  }
};