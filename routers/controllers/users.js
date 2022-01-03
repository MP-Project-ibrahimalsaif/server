const usersModel = require("./../../db/models/users");
const auctionsModel = require("./../../db/models/auctions");
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
      role: process.env.USER_ROLE,
      auth: "local",
    });

    newUser
      .save()
      .then((result) => {
        transport
          .sendMail({
            from: process.env.EMAIL,
            to: lowerCaseEmail,
            subject: "Please confirm your account",
            html: `<h1>Email Confirmation</h1>
              <h2>Hello ${name}</h2>
              <h4>CODE: ${activeCode}</h4>
              <p>Thank you for registering. Please confirm your email by entring the code on the following link</p>
              <a href="http://localhost:3000/verify_account/${result._id}"> Click here</a>
              </div>`,
          })
          .catch((err) => console.log(err));
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

const logout = async (req, res) => {
  try {
    req.logout();
    res.status(200).json("user logged out");
  } catch (error) {
    res.status(400).json("somthing went wrong");
  }
};

const verifyAccount = async (req, res) => {
  const { id, code } = req.body;

  const user = await usersModel.findOne({ _id: id });

  if (user.activeCode == code) {
    usersModel
      .findByIdAndUpdate(id, { active: true, activeCode: "" }, { new: true })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    res.status(400).json("Wrong Code");
  }
};

const checkEmail = async (req, res) => {
  const { email } = req.body;

  const user = await usersModel.findOne({ email });

  if (user) {
    let passwordCode = "";
    const characters = "0123456789";
    for (let i = 0; i < 4; i++) {
      passwordCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    usersModel
      .findByIdAndUpdate(user._id, { passwordCode }, { new: true })
      .then((result) => {
        transport
          .sendMail({
            from: process.env.EMAIL,
            to: result.email,
            subject: "Reset Your Password",
            html: `<h1>Reset Your Password</h1>
              <h2>Hello ${result.name}</h2>
              <h4>CODE: ${passwordCode}</h4>
              <p>Please enter the code on the following link and reset your password</p>
              <a href="http://localhost:3000/reset_password/${result._id}"> Click here</a>
              </div>`,
          })
          .catch((err) => console.log(err));
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    res.status(400).json("No user with this email");
  }
};

const resetPassword = async (req, res) => {
  const { id, code, password } = req.body;

  const user = await usersModel.findOne({ _id: id });

  if (user.passwordCode == code) {
    const hashedPassword = await bcrypt.hash(password, SALT);

    usersModel
      .findByIdAndUpdate(
        id,
        { password: hashedPassword, passwordCode: "" },
        { new: true }
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    res.status(400).json("Wrong Code");
  }
};

const getProfile = (req, res) => {
  const { id } = req.params;

  usersModel
    .findOne({ _id: id })
    .then(async (result) => {
      if (result) {
        const profileAuctions = await auctionsModel
          .find({ createdBy: id, status: process.env.APPROVED_STATUS })
          .populate("createdBy");
        res.status(200).json({
          id: result._id,
          name: result.name,
          avatar: result.avatar,
          auctions: profileAuctions,
        });
      } else {
        res
          .status(404)
          .json({ message: `there is no user with the ID: ${id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const userWatchList = (req, res) => {
  const { id } = req.params;

  usersModel
    .findOne({ _id: id })
    .populate({
      path: "watchlist",
      populate: {
        path: "createdBy",
      },
    })
    .then((result) => {
      if (result) res.status(200).json(result);
      else
        res.status(404).json({ message: `there is no user with th ID ${id}` });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const editAccount = async (req, res) => {
  const { name, avatar } = req.body;

  const user = await usersModel.findOne({ _id: req.token.id });

  usersModel
    .findByIdAndUpdate(
      req.token.id,
      {
        name: name ? name : user.name,
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

const addToWatchList = (req, res) => {
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
          .json({ message: `There is no auction with this ID: ${id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const deleteFromWatchList = (req, res) => {
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
          .json({ message: `There is no auction with this ID: ${id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const getUsers = (req, res) => {
  usersModel
    .find({})
    .populate("role")
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "there is no users yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const changeRole = (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;

  usersModel
    .findByIdAndUpdate(
      id,
      {
        role: role_id,
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

const blockUser = (req, res) => {
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

const unblockUser = (req, res) => {
  const { id } = req.params;

  usersModel
    .findByIdAndUpdate(
      id,
      {
        blocked: false,
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
  logout,
  verifyAccount,
  checkEmail,
  resetPassword,
  getProfile,
  userWatchList,
  editAccount,
  addToWatchList,
  deleteFromWatchList,
  getUsers,
  changeRole,
  blockUser,
  unblockUser,
};
