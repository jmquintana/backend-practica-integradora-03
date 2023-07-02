import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import winston from "winston";
import config from "./config/config.js";
// faker.locale = "es";

export const generateUser = () => {
	let numProducts = parseInt(faker.helpers.randomize([1, 2, 3, 4]));
	let products = [];
	for (let i = 0; i < numProducts; i++) {
		products.push(generateProduct());
	}
	return {
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		email: faker.internet.email(),
		age: faker.number.int({ max: 100 }),
		password: faker.internet.password(),
		role: faker.helpers.enumValue(["user", "admin"]),
		cart: { products },
	};
};

export const generateProduct = () => {
	let stock = faker.number.int(100);
	const status = () => !!stock;
	return {
		id: faker.database.mongodbObjectId(),
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		category: faker.commerce.productDescription(),
		code: `${faker.string
			.alpha({ length: 3 })
			.toUpperCase()}${faker.string.numeric({
			length: 4,
		})}`,
		price: faker.commerce.price(),
		thumbnails: [faker.image.url()],
		stock: stock,
		status: status(),
	};
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `${__dirname}/public/images`);
	},
	filename: function (req, file, cb) {
		cb(null, `${file.originalname}`); //${Date.now().getFullYear}-
	},
});

export const createHash = (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
	bcrypt.compareSync(password, user.password);

export const uploader = multer({ storage });

// Logger
const customLevelOptions = {
	levels: {
		fatal: 0,
		error: 1,
		warning: 2,
		info: 3,
		http: 4,
		debug: 5,
	},
	colors: {
		debug: "blue",
		http: "green",
		info: "cyan",
		warning: "yellow",
		error: "red",
		fatal: "magenta",
	},
};

const devLogger = winston.createLogger({
	levels: customLevelOptions.levels,
	format: winston.format.json(),
	transports: [
		new winston.transports.Console({
			level: "debug",
			format: winston.format.combine(
				winston.format.colorize({
					colors: customLevelOptions.colors,
				}),
				winston.format.simple()
			),
		}),
	],
});

const prodLogger = winston.createLogger({
	levels: customLevelOptions.levels,
	format: winston.format.json(),
	transports: [
		new winston.transports.Console({
			level: "info",
			format: winston.format.combine(
				winston.format.colorize({
					colors: customLevelOptions.colors,
				}),
				winston.format.simple()
			),
		}),
		new winston.transports.File({
			filename: "logs/errors.log",
			level: "error",
			format: winston.format.simple(),
		}),
	],
});

export const logger = config.ENV === "development" ? devLogger : prodLogger;

export default __dirname;
