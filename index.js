// index.js (backend API + legacy EJS)
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import session from "express-session";
import crypto from "crypto";
import cors from "cors";

const app = express();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blogdb",
  password: "CS312DB",
  port: 5433,
});
await db.connect();

// JSON + CORS for React
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Legacy EJS setup remains so old pages still work
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "super-secret-session-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Expose current user to all EJS views as `user`
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: "Not signed in" });
  next();
}

// Session
app.get("/api/session", (req, res) => {
  res.json({ user: req.session.user || null });
});

// Auth – signup/signin/logout
app.post("/api/signup", async (req, res) => {
  const { user_id, password, name } = req.body;
  try {
    const exists = await db.query("SELECT 1 FROM users WHERE user_id = $1", [user_id]);
    if (exists.rowCount > 0) return res.status(400).json({ error: "User ID already taken" });

    await db.query("INSERT INTO users (user_id, password_hash, name) VALUES ($1, $2, $3)", [
      user_id,
      md5(password),
      name,
    ]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error during signup" });
  }
});

app.post("/api/signin", async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const result = await db.query(
      "SELECT user_id, name FROM users WHERE user_id = $1 AND password_hash = $2",
      [user_id, md5(password)]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    req.session.user = { user_id: user.user_id, name: user.name };
    res.json({ user: req.session.user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error during signin" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// Blogs – list/create/update/delete
app.get("/api/blogs", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT blog_id, creator_user_id, creator_name, title, body, date_created FROM blogs ORDER BY date_created DESC"
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/blogs", requireAuth, async (req, res) => {
  const { title, body } = req.body;
  const { user_id, name } = req.session.user;
  try {
    const r = await db.query(
      "INSERT INTO blogs (creator_user_id, creator_name, title, body) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, name, title, body]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/blogs/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const userId = req.session.user.user_id;
  try {
    const r = await db.query(
      "UPDATE blogs SET title=$1, body=$2, updated_at=NOW() WHERE blog_id=$3 AND creator_user_id=$4 RETURNING *",
      [title, body, id, userId]
    );
    if (r.rowCount === 0) return res.status(403).json({ error: "You can only edit your own posts" });
    res.json(r.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/blogs/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.user_id;
  try {
    const r = await db.query("DELETE FROM blogs WHERE blog_id=$1 AND creator_user_id=$2", [id, userId]);
    if (r.rowCount === 0) return res.status(403).json({ error: "You can only delete your own posts" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Start API on 8000 so React dev server can run at 5173
app.listen(8000, () => {
  console.log("API running at http://localhost:8000");
});