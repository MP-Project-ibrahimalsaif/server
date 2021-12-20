const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Config .env file
dotenv.config();

// Get SECRET_KEY variable from .env
const SECRET = process.env.SECRET_KEY;

// Check if the token is valid
const authentication = (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(403).json({ message: "Forbidden" });

    const token = req.headers.authorization.split(" ")[1];

    const parsedToken = jwt.verify(token, SECRET);

    req.token = parsedToken;

    next();
  } catch (error) {
    res.status(403).json({ error });
  }
};

module.exports = authentication;
