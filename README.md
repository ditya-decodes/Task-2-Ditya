# Task-2-Ditya
Built the backend for Scribble (Note-taking web app)

# Scribble: Note-Taking Web App(Backend API Engine)

The backend infrastructure for **Scribble**, engineered explicitly for **Task 02: Backend API Development** of the DecodeLabs Full-Stack Development Internship. 

This system moves Scribble from localized client-only state storage to a resilient, stateless RESTful API powered by Node.js, Express, and native local file persistence (`notes.json`). 
It strictly respects the structural architecture guideline: **"Resources are Nouns. Methods are Verbs."**

---
## 📂Project Architecture Blueprint

To run the unified stack seamlessly within VS Code, organize your workspace directory as follows:

```text
scribble-workspace/
│
├── backend/
│   ├── data/
│   │   └── notes.json         # Auto-generated flat-file database volume
│   ├── package.json           # Backend dependency configuration
│   └── server.js              # Core Express API router and validation engine
│
└── frontend/
    ├── index.html             # Semantic layout landmarks
    ├── style.css              # 2D Grid layouts & 2026 color design tokens
    └── app.js                 # Unified state dispatcher (updated for API connectivity)
```
## 🛠️Installation & Execution Setup

1. **Initialize Runtime Environment:** Open your integrated VS Code terminal (`Ctrl + ``), navigate into your backend directory, and install the verified lightweight ecosystem modules:
   ```bash
   cd backend
   npm install
2. **Launch the Engine:** Boot up the stateless server listener:
   ```bash
   npm start
   
  Upon a successful boot sequence, your terminal will confirm:
  ```text
====================================================
 Scribble API Engine Online: Running on Port 5000
 Base Endpoint Domain URL: http://localhost:5000
====================================================
```
3. **Boot the Engine:** Start the API server:
   ```bash
   npm start

## 📡RESTful API Contract Documentation
The Scribble backend relies on explicit semantic HTTP methods, clean resource mappings, and accurate status codes.

| HTTP Verb | Resource Target Endpoint | Operation Description | Success Status | Error Code
| :--- | :--- | :--- | :--- | :--- | 
| `GET`| `/api/notes` | Retrieves array list of notes | `200 OK` | `500 Internal`
| `POST` | `/api/notes` | Commits a new note record | `201 Created` | `400 Bad Request`
| `PUT` | `/api/notes/:id` | Full overwrite updates on a note | `200 OK` | `404 Not Found`
| `PATCH`| `/api/notes/:id/archive` | Toggles note archival state binary | `200 OK` | `404 Not Found`
| `DELETE`| `/api/notes/:id` | Permanently deletes a note | `200 OK` | `404 Not Found`

## 🎯Verification Checklist
1. **Statelessness:** Verify that closing or restarting the Node server keeps all created data secure inside `notes.json.`
2. **Cross-Origin Compliance:** Ensure that running the frontend via a separate localhost server (e.g., Live Server) doesn't cause CORS errors, thanks to the integrated backend `cors()` middleware layer.
3. **Error Isolation:** Send an empty JSON object `{}` using a REST client tool (like Postman or Thunder Client) to `POST /api/notes`. Verify that the system handles this safely by returning an HTTP code `400` instead of crashing.

---
Developed for the 2026 Full Stack Summer Internship | Backend Development Milestone Completed
