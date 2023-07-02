import express from "express";
import handlebars from "express-handlebars";
import database from "./db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import passport from "passport";
import initializePassport from "./config/passport.js";
import socket from "./socket.js";
import routerAPI from "./routes/routes.js";
import __dirname from "./utils.js";
import config from "./config/config.js";
import { addLogger } from "./middlewares/logger.js";
import { logger } from "./utils.js";
import cookieParser from "cookie-parser";

// Initialization
const { DB_USER, DB_PASS, DB_NAME, DB_URL, SESSION_SECRET } = config;
const app = express();
const PORT = 3000;

// Settings
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Instance handlebars for registering a helper
const hbs = handlebars.create({});

//Register handlebars helper for number formatting
hbs.handlebars.registerHelper("formatNumber", function (number) {
	return new Intl.NumberFormat("es-AR").format(number);
});

// MiddleWares
app.use(cookieParser());
app.use(
	express.json({
		type: ["application/json", "text/plain"],
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: DB_URL,
			ttl: 60 * 5,
		}),
		resave: true,
		saveUninitialized: false,
		secret: SESSION_SECRET,
	})
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use("/", express.static(`${__dirname}/public`));
// app.use(morgan("dev"));
app.use(addLogger);

// Database connection
database.connect();

// Routes
routerAPI(app);
app.get("/loggerTest", (req, res) => {
	logger.debug("This is a debug log");
	logger.http("This is an HTTP log");
	logger.info("This is an info log");
	logger.warning("This is a warning log");
	logger.error("This is an error log");
	logger.fatal("This is a fatal log");

	res.send("Logger test completed");
});

const httpServer = app.listen(PORT, (req, res) => {
	console.log(`Server listening on port ${PORT}`);
});

// Websocket Server
socket.connect(httpServer);
