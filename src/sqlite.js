import SQL from "sql.js";
import fs from "fs";
import path from "path";

let db = null;
const dbPath = path.join(__dirname, "offline.db"); // Path to the SQLite database file

// Initialize database
export const initDB = () => {
  if (fs.existsSync(dbPath)) {
    // Load the existing database from the file
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    // Create a new SQLite database if not found
    db = new SQL.Database();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
      );
    `;
    db.run(createTableQuery);
  }
};

// Save the database to file
export const saveDB = () => {
  const data = db.export(); // Export the database to binary (Uint8Array)
  fs.writeFileSync(dbPath, Buffer.from(data)); // Save the database to the file
};

// Add a user
export const addUser = (name, email) => {
  const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  stmt.run([name, email]);
  stmt.free();
  saveDB();
};

// Get all users
export const getUsers = () => {
  const stmt = db.prepare("SELECT * FROM users");
  const users = [];
  while (stmt.step()) {
    const user = stmt.getAsObject();
    users.push(user);
  }
  stmt.free();
  return users;
};

// Remove a user
export const removeUser = (id) => {
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");
  stmt.run([id]);
  stmt.free();
  saveDB();
};
