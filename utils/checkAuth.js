import jwt from "jsonwebtoken";

const KEY = "secretKeyforUser";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").split(" ")[1];

  if (!token) return res.status(403).json({ message: "Нет доступа!" });

  try {
    const decoded = jwt.verify(token, KEY);
    req.userID = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: "Нет доступа!" });
  }
}