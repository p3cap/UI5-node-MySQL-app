const request = require("supertest");
const { app, pool } = require("../server");

beforeAll(async () => {
	const conn = await pool.getConnection();
	conn.release();
});

beforeEach(async () => {
	await pool.query("DELETE FROM users");
	await pool.query(
		"INSERT INTO users (user_name, phone_number) VALUES (?, ?), (?, ?)",
		["Kovacs Janos", "+36301234567", "Nagy Anna", "+36701111111"]
	);
});

afterAll(async () => {
	await pool.query("DELETE FROM users");
	await pool.end();
});


test("odata res shape test", async () => {
	const res = await request(app).get("/odata/Users");
	expect(res.status).toBe(200);
	expect(Array.isArray(res.body.d.results)).toBe(true);
	expect(res.body.d.results).toHaveLength(2);
});

test("users filter test", async () => {
	const filter = encodeURIComponent("substringof('Kovacs',user_name) eq true");
	const res = await request(app).get(`/odata/Users?$filter=${filter}`);
	expect(res.status).toBe(200);
	expect(res.body.d.results).toHaveLength(1);
	expect(res.body.d.results[0].user_name).toBe("Kovacs Janos");
});

test("user creation", async () => {
	const res = await request(app)
		.post("/odata/Users")
		.send({ user_name: "Test User", phone_number: "+36209999999" });
	expect(res.status).toBe(201);
	expect(res.body.d.user_name).toBe("Test User");
});

test("valid phone number test", async () => {
	const res = await request(app)
		.post("/validate/phone")
		.send({ phone: "+36301234567" });
	expect(res.body.valid).toBe(true);
});

test("invalid phone number test", async () => {
	const res = await request(app)
		.post("/validate/phone")
		.send({ phone: "asdfghjk" });
	expect(res.body.valid).toBe(false);
});
