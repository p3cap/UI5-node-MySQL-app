require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const fs       = require("fs");
const path     = require("path");
const mysql    = require("mysql2/promise");
const { isValidPhoneNumber, getCountries, getCountryCallingCode } = require("libphonenumber-js");

const app  = express();
const pool = mysql.createPool({
	host:     process.env.DB_HOST,
	port:     Number(process.env.DB_PORT),
	user:     process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});
app.use(cors());
app.use(express.json());

const edmxMetadata = fs.readFileSync(path.join(__dirname, "db", "EDMX_metadata.xml"), "utf8");

const ALLOWED_FIELDS = new Set(["user_name", "phone_number"]);

// Parses substringof('value', field) into a SQL WHERE clause + parameterised values
function parseFilter(filter) {
	if (!filter) return { where: "", values: [] };
	const m = /substringof\('([^']*)',\s*(\w+)\)/i.exec(filter);
	if (!m || !ALLOWED_FIELDS.has(m[2])) return { where: "", values: [] };
	return { where: `WHERE \`${m[2]}\` LIKE ?`, values: [`%${m[1]}%`] };
}

// Wraps a DB row in OData v2 __metadata
function toODataUser(u) {
	const uri = `http://localhost:3000/odata/Users(${u.id})`;
	return {
		__metadata: { id: uri, uri, type: "App.User" },
		id:           u.id,
		user_name:    u.user_name,
		phone_number: u.phone_number
	};
}

// --- Endpoints ---

// entity data model metadata for OData
app.get("/odata/$metadata", (req, res) => {
	res.type("application/xml");
	res.send(edmxMetadata);
});

// service doc
app.get(["/odata", "/odata/"], (req, res) => {
	res.json({ d: { EntitySets: ["Users"] } });
});

// row count
app.get("/odata/Users/$count", async (req, res) => {
	try {
		const { where, values } = parseFilter(req.query.$filter);
		const [[{ count }]] = await pool.query(`SELECT COUNT(*) AS count FROM users ${where}`, values);
		res.type("text/plain").send(String(count));
	} catch (err) {
		res.status(500).json({ error: { message: err.message } });
	}
});

// get users (with/without filtering)
app.get("/odata/Users", async (req, res) => {
	try {
		const { where, values } = parseFilter(req.query.$filter);
		const [rows] = await pool.query(`SELECT * FROM users ${where}`, values);
		const results = rows.map(toODataUser);
		const body    = { results };
		if (req.query.$inlinecount === "allpages") body.__count = String(rows.length);
		res.json({ d: body });
	} catch (err) {
		res.status(500).json({ error: { message: err.message } });
	}
});

// create user
app.post("/odata/Users", async (req, res) => {
	try {
		const { user_name, phone_number } = req.body;
		const [result] = await pool.query(
			"INSERT INTO users (user_name, phone_number) VALUES (?, ?)",
			[user_name, phone_number]
		);
		res.status(201).json({ d: toODataUser({ id: result.insertId, user_name, phone_number }) });
	} catch (err) {
		res.status(500).json({ error: { message: err.message } });
	}
});

// country codes for phone number input dropdown
app.get("/countries", (req, res) => {
	const seen = new Set();
	const list = getCountries()
		.reduce((acc, iso) => {
			const prefix = "+" + getCountryCallingCode(iso);
			if (!seen.has(prefix)) {
				seen.add(prefix);
				acc.push({ key: prefix, text: prefix + " " + iso });
			}
			return acc;
		}, [])
		.sort((a, b) => Number(a.key.slice(1)) - Number(b.key.slice(1)));
	res.json(list);
});

// phone number validation
app.post("/validate/phone", (req, res) => {
	try {
		res.json({ valid: isValidPhoneNumber(req.body.phone) });
	} catch {
		res.json({ valid: false });
	}
});

// start server
if (require.main === module) {
	pool.getConnection()
		.then(conn => { conn.release(); console.log("MySQL connected"); })
		.then(() => app.listen(3000, () => console.log("Backend is running: http://localhost:3000")))
		.catch(console.error);
}

module.exports = { app, pool };
