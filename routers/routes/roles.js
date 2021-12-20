const express = require("express");

const { getRoles, createRole } = require("../controllers/roles");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const rolesRouter = express.Router();

rolesRouter.get("/roles", authentication, authorization, getRoles);
rolesRouter.post("/roles", authentication, authorization, createRole);

module.exports = rolesRouter;