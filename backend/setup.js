
// MySQL db creation from db/init.sql

require("dotenv").config(); // env varibles
const mysql = require("mysql2/promise");
const fs    = require("fs");
const path  = require("path");

const { host, port, username, password } = {
	host:     process.env.DB_HOST,
	port:     Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD
};

async function setup() {
	const conn = await mysql.createConnection({
		host,
		port,
		user: username,
		password,
		multipleStatements: true
	});

	console.log("MySQL created");

	const sql = fs.readFileSync(path.join(__dirname, "db", "init.sql"), "utf8");
	await conn.query(sql);
	await conn.end();

	console.log("setup completed");
}

// error handling
setup().catch(err => {
	console.error("setup failed:", err.message);
	process.exit(1);
});
