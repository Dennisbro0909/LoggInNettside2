const express = require("express");
const mariadb = require("mariadb");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const pool = mariadb.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "abc12345",
    database: "login_app",
    connectionLimit: 5
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const rows = await pool.query(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password]
        );

        if (rows.length > 0) {
            res.json({ success: true, message: "Login successful!" });
        } else {
            res.json({ success: false, message: "Wrong username or password!" });
        }
    } catch (error) {
        console.error("Login database error:", error);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ success: false, message: "Username and password are required!" });
    }

    try {
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (existingUser.length > 0) {
            return res.json({ success: false, message: "Username already exists!" });
        }

        await pool.query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, password]
        );

        res.json({ success: true, message: "Account created successfully!" });
    } catch (error) {
        console.error("Register database error:", error);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});