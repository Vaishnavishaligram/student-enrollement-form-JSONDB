# student-enrollement-form-JSONDB
A lightweight, server-free Student Enrollment Form built with HTML, CSS, JavaScript, and JsonPowerDB as the backend database — part of the JsonPowerDB .

## Table of Contents

- [Title](#student-enrollment-form--jsonpowerdb-micro-project)
- [Description](#description)
- [Benefits of using JsonPowerDB](#benefits-of-using-jsonpowerdb)
- [Release History](#release-history)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Form Behaviour](#form-behaviour)
- [How to Run](#how-to-run)
- [Screenshots](#screenshots)

---

## Description

The **Student Enrollment Form** is a micro project developed as part of the **JsonPowerDB (JPDB) course** on [Login2Explore](http://login2explore.com). It allows school staff to enroll new students and update existing student records using a simple, interactive web form — with **no traditional server or SQL database required**.

The form stores all data in the **STUDENT-TABLE** relation of the **SCHOOL-DB** database powered by JsonPowerDB.

### Key Features

- Enter a **Roll No** (Primary Key) to automatically check if the student exists in the database.
- If **new** → fill in the form and click **Save** to insert the record.
- If **existing** → data is pre-filled; edit and click **Update** to modify the record.
- **Reset** clears the form and returns to the initial state at any time.
- Full **client-side validation** — no empty fields are accepted.
- A **live records table** displays all stored entries below the form.

### Input Fields

| Field             | Description                  |
|-------------------|------------------------------|
| Roll No           | Primary Key — unique student ID |
| Full Name         | Student's complete name      |
| Class             | Grade / class of the student |
| Birth Date        | Date of birth (YYYY-MM-DD)   |
| Address           | Residential address          |
| Enrollment Date   | Date of school enrollment    |

---

## Benefits of using JsonPowerDB

JsonPowerDB (JPDB) is a real-time, high-performance, multi-model database that provides several compelling advantages for developers:

| # | Benefit | Details |
|---|---------|---------|
| 1 | **Simple and Powerful REST API** | All database operations (insert, update, fetch, delete) are performed via straightforward HTTP requests — no complex drivers or ORM setup needed. |
| 2 | **Schema-free / Dynamic** | No need to define a fixed table schema upfront. JSON documents can have any structure, making it ideal for rapid development and changing requirements. |
| 3 | **Multi-mode Database** | Supports Key-Value, Document, Time-Series, Relational (RDBMS), GeoSpatial, and more — all in one product. |
| 4 | **Server-side Nimble Technology** | Inbuilt querying is extremely fast; JPDB is built on top of PowerIndeX, a high-speed in-memory data store. |
| 5 | **Minimal Development Effort** | Reduces the amount of code needed for CRUD operations significantly compared to traditional databases. |
| 6 | **Ready-to-use Web Dev Technology** | Works natively with HTML/JS frontends. No backend language (PHP, Node.js) is required for basic CRUD — the REST API is called directly from JavaScript. |
| 7 | **Reduces Total Cost of Ownership** | Eliminates the need for separate database servers, ORMs, and middleware layers — lowering infrastructure and maintenance costs. |
| 8 | **Real-time Data Processing** | Provides real-time data access with low latency, suitable for live dashboards and interactive forms. |
| 9 | **Free to Use** | JsonPowerDB is available for free for developers and students, making it perfect for academic projects and prototyping. |
| 10 | **Built-in Security** | Every request is authenticated via a token (`connection-token`), providing secure access without complex auth setup. |

---

## Release History

| Version | Date       | Description |
|---------|------------|-------------|
| v0.1.0  | 2025-01-01 | Initial release — Student Enrollment Form with JsonPowerDB integration. Supports Save, Update, and Reset operations on STUDENT-TABLE in SCHOOL-DB. |

> **Note:** Update the date and add new rows here each time you push a new version to GitHub.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript     |
| Database | **JsonPowerDB** (Login2Explore JPDB)|
| API      | JsonPowerDB REST API (HTTP/JSON)    |
| IDE      | NetBeans / VS Code                  |

---

## Project Structure

```
student-enrollment/
├── index.html          ← Main enrollment form (UI + logic)
├── css/
│   └── style.css       ← Stylesheet
├── js/
│   ├── app.js          ← Form state machine + JsonPowerDB API calls
│   └── jpdb-utils.js   ← Helper functions for JPDB REST calls
└── README.md
```

---

## Database Schema

```
Database Name : SCHOOL-DB
Table Name    : STUDENT-TABLE
Primary Key   : roll_no
```

| Column            | Data Type | Constraint   |
|-------------------|-----------|--------------|
| roll_no           | String    | PRIMARY KEY  |
| full_name         | String    | NOT NULL     |
| class             | String    | NOT NULL     |
| birth_date        | String    | NOT NULL     |
| address           | String    | NOT NULL     |
| enrollment_date   | String    | NOT NULL     |

---

## Form Behaviour

The form follows a **3-state machine**:

```
         Page Load / Reset
                │
                ▼
┌─────────────────────────────┐
│           IDLE              │
│  Roll No field active only  │
│  All buttons disabled       │
└────────────┬────────────────┘
             │ User types Roll No
     ┌───────┴────────┐
     │                │
  Not Found        Found in DB
     │                │
     ▼                ▼
┌─────────┐     ┌──────────────┐
│   NEW   │     │   EXISTING   │
│  Save + │     │  Update +    │
│  Reset  │     │  Reset       │
└─────────┘     └──────────────┘
```

- **IDLE** → only Roll No is enabled; cursor starts here on load.
- **NEW** → Roll No not in DB; all fields enabled; click Save to insert.
- **EXISTING** → Roll No found; data pre-filled; Roll No locked; click Update.
- **Reset** at any point returns to IDLE.

---

## How to Run

### Option 1 — Open directly in browser
```
1. Clone / download this repository.
2. Open index.html in Chrome, Firefox, or Edge.
3. No server setup required.
```

### Option 2 — Via NetBeans
```
1. File → Open Project → select the project folder.
2. Right-click index.html → Run File.
```

### JsonPowerDB Connection
Update the `connection-token` in `js/app.js` with your own token from [Login2Explore](http://login2explore.com):
```javascript
const JPDB_TOKEN = 'YOUR-CONNECTION-TOKEN-HERE';
const JPDB_URL   = 'http://api.login2explore.com:5577';
const DB_NAME    = 'SCHOOL-DB';
const TABLE_NAME = 'STUDENT-TABLE';
```



## Acknowledgements

- [JsonPowerDB](http://login2explore.com/jpdb) by Login2Explore
- [JsonPowerDB Documentation](http://login2explore.com/jpdb/docs.html)
- Micro Project specification from the JPDB course curriculum
