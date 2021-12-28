const express = require("express");
const socket = require("socket.io");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("./db");
require("./config/passport");

// Config .env file
dotenv.config();

// Initiating the app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Roles Router
const rolesRouter = require("./routers/routes/roles");
app.use(rolesRouter);

// Status Router
const statusRouter = require("./routers/routes/status");
app.use(statusRouter);

// Users Router
const usersRouter = require("./routers/routes/users");
app.use(usersRouter);

// Auctions Router
const auctionsRouter = require("./routers/routes/auctions");
app.use(auctionsRouter);

// Bids Router
const bidsRouter = require("./routers/routes/bids");
app.use(bidsRouter);

// Reports Router
const reportsRouter = require("./routers/routes/reports");
app.use(reportsRouter);

// Get PORT variable from .env
const PORT = process.env.PORT || 5000;

// Start the app
const server = app.listen(PORT, () => {
  console.log(`SERVER ON PORT ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  socket.on("auction_room", (data) => {
    socket.join(data.room);
    console.log(`user has entered the room number ${data.room}`);
  });

  socket.on("make_bid", (data) => {
    socket.to(data.room).emit("recieve_bid", {
      bid: data.bid,
    });
  });
});
