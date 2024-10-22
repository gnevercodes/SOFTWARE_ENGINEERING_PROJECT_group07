const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Path to your server.js

// beforeAll(async () => {
//   // Connect to the test database before running the tests
//   await mongoose.connect("mongodb://localhost:27017/test_db", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// });

// afterAll(async () => {
//   // Clean up and close the database connection after all tests
//   await mongoose.connection.dropDatabase(); // Optional: Drop test DB after tests
//   await mongoose.connection.close();
// });

describe("POST /api/signup", () => {
  test("should successfully register a new user", async () => {
    const response = await request(app).post("/api/signup").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "TestPassword123",
      phone: "1234567890",
      birthDate: "1990-01-01",
      bloodGroup: "O+",
      street: "123 Main St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      emergencyName: "Emergency Contact",
      emergencyPhone: "0987654321",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User registered successfully!");
  });

  test("should fail to register if the email is already in use", async () => {
    const response = await request(app).post("/api/signup").send({
      name: "Test User",
      email: "testuser@example.com", // Same email to simulate duplicate
      password: "TestPassword123",
      phone: "1234567890",
      birthDate: "1990-01-01",
      bloodGroup: "O+",
      street: "123 Main St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      emergencyName: "Emergency Contact",
      emergencyPhone: "0987654321",
    });
    expect(response.statusCode).toBe(500); // You may expect a different status code if you've customized it
    expect(response.body.error).toBe("Signup failed.");
  });
});

describe("POST /api/login", () => {
  test("should successfully log in a user with correct credentials", async () => {
    const response = await request(app).post("/api/login").send({
      email: "testuser@example.com",
      password: "TestPassword123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successful");
  });

  test("should fail to log in a user with incorrect password", async () => {
    const response = await request(app).post("/api/login").send({
      email: "testuser@example.com",
      password: "WrongPassword123", // Incorrect password
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid email or password.");
  });

  test("should fail to log in a user with non-existing email", async () => {
    const response = await request(app).post("/api/login").send({
      email: "nonexistentuser@example.com", // Non-existing email
      password: "SomePassword123",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid email or password.");
  });
});
