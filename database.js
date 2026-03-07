import sqlite3 from "sqlite3"

const db = new sqlite3.Database("./database.sqlite")

// USERS
db.run(`CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE,
password TEXT
)`)

// COURSES
db.run(`CREATE TABLE IF NOT EXISTS courses(
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT
)`)

// LESSONS
db.run(`CREATE TABLE IF NOT EXISTS lessons(
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT,
video TEXT,
course_id INTEGER
)`)

export default db

db.run(`CREATE TABLE IF NOT EXISTS progress(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
lesson_id INTEGER
)`)
