// Check if the user have the admin role
const authorization = (req, res, next) => {
  try {
    if (req.token.role == "admin") {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    res.status(403).json({ error });
  }
};

module.exports = authorization;
