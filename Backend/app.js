if (process.env.NODE_ENV !== "production") {
      require("dotenv").config();
}

const express = require("express");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const User = require("./models/user");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const Post = require("./models/posts");

const PORT = 8080;
const cors = require('cors');
app.use(cors({ origin: 'https://talk-project-v7j5.vercel.app', credentials: true, }));

// Routers
const user = require('./routes/user');
const talk = require('./routes/talk');

// Database connection
const dbUrl = process.env.ATLASDB_URL;
mongoose
      .connect(dbUrl)
      .then(() => console.log("Connected to DB"))
      .catch((err) => console.error("Database connection error:", err));

// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

// Session store configuration
const store = MongoStore.create({
      mongoUrl: dbUrl,
      crypto: { secret: "secretKey" },
      touchAfter: 24 * 60 * 60,
});
store.on("error", (err) => console.error("Session Store Error:", err));

// Session options
const sessionOptions = {
      store,
      secret: process.env.SECRET || "secretKey",
      resave: false,
      saveUninitialized: false,
      cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
      },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport.js setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages available in views
app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currUser = req.user || null;
      // console.log(res.locals.currUser);
      next();
});
app.get('/currUser', (req, res) => {
      if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
      }
      res.json(req.user);
});
// Routers
app.use('/', user);
app.use('/talk', talk);

app.get("/", (req, res) => {
      res.redirect("/talk");
});
// Error handler middleware
app.use((err, req, res, next) => {
      console.error(err.stack);
      const { status = 500, message = "Something went wrong!" } = err;
      res.status(status).render("error", { err });
});

// Starting the server
app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
});