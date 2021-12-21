const usersModel = require("./../../db/models/users");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Config .env file
dotenv.config();

// Get SALT variable from .env
const SALT = Number(process.env.SALT);

// Get SECRET_KEY variable from .env
const SECRET = process.env.SECRET_KEY;

// Email transport
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const signup = async (req, res) => {
  const { email, name, password } = req.body;

  const lowerCaseEmail = email.toLowerCase();

  const userExists = await usersModel.findOne({ email: lowerCaseEmail });

  if (!userExists) {
    const hashedPassword = await bcrypt.hash(password, SALT);

    let activeCode = "";
    const characters = "0123456789";
    for (let i = 0; i < 4; i++) {
      activeCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const newUser = new usersModel({
      email: lowerCaseEmail,
      name,
      password: hashedPassword,
      activeCode,
      passwordCode: "",
      role: process.env.ADMIN_ROLE,
    });

    newUser
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.json({
      message: "Email is already taken!!",
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  const lowerCaseEmail = email.toLowerCase();

  usersModel
    .findOne({ email: lowerCaseEmail })
    .populate("role")
    .then(async (result) => {
      if (result) {
        if (result.email == lowerCaseEmail) {
          if (result.password) {
            const matchedPassword = await bcrypt.compare(
              password,
              result.password
            );

            if (matchedPassword) {
              const payload = {
                id: result._id,
                email: result.email,
                name: result.name,
                role: result.role.role,
              };

              const options = {
                expiresIn: "10h",
              };

              const token = jwt.sign(payload, SECRET, options);

              if (result.blocked) {
                res.status(404).json({
                  message: "This user is not allowed to use the site!!",
                });
              }
              if (!result.active) {
                res.status(404).json({
                  message:
                    "Your account is not activated please check your email!!",
                });
              }

              res.status(200).json({ result, token });
            } else {
              res.status(400).json({ message: "Invalid email or password!!" });
            }
          } else {
            res.status(400).json({ message: "Invalid email or password!!" });
          }
        } else {
          res.status(400).json({ message: "Invalid email or password!!" });
        }
      } else {
        res.status(404).json({ message: "Invalid email or password!!" });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const getProfile = (req, res) => {
  const { id } = req.params;

  usersModel
    .findOne({ _id: id })
    .then((result) => {
      if (result)
        res
          .status(200)
          .json({ id: result._id, name: result.name, avatar: result.avatar });
      else
        res
          .status(404)
          .json({ message: `there is no user with the ID: ${id}` });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const editAccount = async (req, res) => {
  const { name, password, avatar } = req.body;
  let hashedPassword;

  if (password) {
    hashedPassword = await bcrypt.hash(password, SALT);
  }

  const user = await usersModel.findOne({ _id: req.token.id });

  usersModel
    .findByIdAndUpdate(
      req.token.id,
      {
        name: name ? name : user.name,
        password: password ? hashedPassword : user.password,
        avatar: avatar ? avatar : user.avatar,
      },
      { new: true }
    )
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: `There is no user with this ID: ${req.token.id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const addToWatchList = async (req, res) => {
  const { id } = req.params;

  usersModel
    .findByIdAndUpdate(
      req.token.id,
      { $push: { watchlist: id } },
      { new: true }
    )
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: `There is no user with this ID: ${id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const deleteFromWatchList = async (req, res) => {
  const { id } = req.params;

  usersModel
    .findByIdAndUpdate(
      req.token.id,
      { $pull: { watchlist: id } },
      { new: true }
    )
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: `There is no user with this ID: ${id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const getUsers = (req, res) => {
  usersModel
    .find({})
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "there is no users yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const changeRole = async (req, res) => {
  const { id } = req.params;

  usersModel
    .findByIdAndUpdate(
      id,
      {
        role: process.env.ADMIN_ROLE,
      },
      { new: true }
    )
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: `There is no user with this ID: ${id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const blockUser = async (req, res) => {
  const { id } = req.params;

  usersModel
    .findByIdAndUpdate(
      id,
      {
        blocked: true,
      },
      { new: true }
    )
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: `There is no user with this ID: ${id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = {
  signup,
  login,
  getProfile,
  editAccount,
  addToWatchList,
  deleteFromWatchList,
  getUsers,
  changeRole,
  blockUser,
};
