# Task-2-Ditya
Built the backend for Scribble (Note-taking web app)

# Scribble: Full-Stack Note-Taking Platform (Backend API Engine)

Welcome to the backend infrastructure for **Scribble**, engineered explicitly for **Task 2: Backend API Development** of the DecodeLabs Full-Stack Development Internship. 

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
