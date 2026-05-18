const request = require("supertest");
const { app, pool } = require("../server");

afterAll(async () => {
	await pool.end();
});

// XML response check
test("GET /odata/$metadata returns XML", async () => {
	const res = await request(app).get("/odata/$metadata");
	expect(res.status).toBe(200);
	expect(res.headers["content-type"]).toMatch(/xml/);
});

// service document check
test("GET /odata returns service document", async () => {
	const res = await request(app).get("/odata");
	expect(res.status).toBe(200);
	expect(res.body.d.EntitySets).toContain("Users");
});
