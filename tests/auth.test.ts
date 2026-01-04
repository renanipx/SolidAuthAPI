import request from "supertest";
import { app } from "../src/server";

describe("Auth - Login", () => {
    it("should not login with invalid credentials", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "wrong@email.com",
                password: "wrongpassword",
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid credentials");
    });

    it("should login with valid credentials and return a token", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "admin@admin.com",
                password: "admin123",
            });

        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
    });

    it("should not access protected route without token", async () => {
        const response = await request(app)
            .get("/users/me");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    });

    it("should not access protected route with invalid token", async () => {
        const response = await request(app)
            .get("/users/me")
            .set("Authorization", "Bearer invalid.token.here");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid or expired token");
    });

});
