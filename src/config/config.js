import dotenv from "dotenv";
dotenv.config();

const config = {
	DB_NAME: process.env.DB_NAME,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,
	DB_URL: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@codercluster.tgft5r9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
	SESSION_SECRET: process.env.SESSION_SECRET,
	githubAuth: {
		CLIENT_ID: process.env.CLIENT_ID,
		CLIENT_SECRET: process.env.CLIENT_SECRET,
		CALLBACK_URL: process.env.CALLBACK_URL,
	},
	ENV: process.env.NODE_ENV,
	nodemailer: {
		service: process.env.NM_SERVICE,
		port: process.env.NM_PORT,
		user: process.env.NM_USER,
		password: process.env.NM_PASSWORD,
	},
	jwt: {
		cookieName: process.env.JWT_COOKIE_NAME,
		secret: process.env.JWT_SECRET,
	},
};

export default config;
