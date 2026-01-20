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

    it("should access protected route with valid token", async () => {
        const login = await request(app)
            .post("/auth/login")
            .send({
                email: "admin@admin.com",
                password: "admin123",
            });

        expect(login.status).toBe(200);
        const token = login.body.accessToken;
        expect(token).toBeDefined();

        const meResp = await request(app)
            .get("/users/me")
            .set("Authorization", `Bearer ${token}`);

        expect(meResp.status).toBe(200);
        expect(meResp.body).toHaveProperty("email", "admin@admin.com");
        expect(meResp.body).toHaveProperty("role");
    });

    it("should not access protected route with invalid token", async () => {
        const response = await request(app)
            .get("/users/me")
            .set("Authorization", "Bearer invalid.token.here");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid or expired token");
    });

    it("should refresh tokens with a valid refresh token", async () => {
        const login = await request(app)
            .post("/auth/login")
            .send({
                email: "admin@admin.com",
                password: "admin123",
            });

        expect(login.status).toBe(200);
        const oldRefreshToken = login.body.refreshToken;
        expect(oldRefreshToken).toBeDefined();

        const refreshResp = await request(app)
            .post("/auth/refresh")
            .send({ refreshToken: oldRefreshToken });

        expect(refreshResp.status).toBe(200);
        expect(refreshResp.body.accessToken).toBeDefined();
        expect(refreshResp.body.refreshToken).toBeDefined();
        expect(refreshResp.body.refreshToken).not.toEqual(oldRefreshToken);
    });

    it("should not refresh tokens without refreshToken", async () => {
        const resp = await request(app)
            .post("/auth/refresh")
            .send({});

        expect(resp.status).toBe(400);
        expect(resp.body.message).toBe("Refresh token is required");
    });

    it("should not refresh tokens with invalid refresh token", async () => {
        const resp = await request(app)
            .post("/auth/refresh")
            .send({ refreshToken: "invalid.token" });

        expect(resp.status).toBe(401);
        expect(resp.body.message).toBe("Invalid refresh token");
    });
});
