/**
 * Scribble Backend API Engine
 * Compliant with DecodeLabs RESTful Design Standards
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'notes.json');

// --- Middleware Configurations ---
app.use(cors()); // Allow cross-origin requests from frontend environment
app.use(express.json()); // Parse incoming JSON payloads

// --- Helper Functions for Data Persistence Layer ---
function readNotesFromFile() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            // Self-healing: Initialize database file if absent
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error("Database Read Exception Error:", error);
        return [];
    }
}

function writeNotesToFile(notes) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), 'utf8');
    } catch (error) {
        console.error("Database Write Exception Error:", error);
    }
}

// --- RESTful Routing Architecture (Resources are Nouns) ---

/**
 * ROUTE 1: GET /api/notes
 * Description: Fetches all notes with support for advanced filtering, search terms, and archival states.
 */
app.get('/api/notes', (req, requireResponse) => {
    let notes = readNotesFromFile();
    const { archived, tag, search } = req.query;

    // 1. Structural Filter: Archival State mapping
    if (archived !== undefined) {
        const isArchivedTarget = archived === 'true';
        notes = notes.filter(n => n.archived === isArchivedTarget);
    }

    // 2. Structural Filter: Specific Tag Identification
    if (tag) {
        const normalizedTag = tag.trim().toLowerCase();
        notes = notes.filter(n => n.tags && n.tags.includes(normalizedTag));
    }

    // 3. Algorithmic Search: Title, Tag, and Text Body Interception
    if (search) {
        const query = search.toLowerCase().trim();
        notes = notes.filter(n => {
            const matchTitle = n.title && n.title.toLowerCase().includes(query);
            const matchContent = n.content && n.content.toLowerCase().includes(query);
            const matchTags = n.tags && n.tags.some(t => t.toLowerCase().includes(query));
            return matchTitle || matchContent || matchTags;
        });
    }

    requireResponse.status(200).json(notes);
});

/**
 * ROUTE 2: POST /api/notes
 * Description: Validates payload data and builds a new note instance.
 */
app.post('/api/notes', (req, res) => {
    const { title, tags, content } = req.body;

    // Server-Side Strict Validation Protocol
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: "Validation Failure: Title field is explicitly required." });
    }

    const notes = readNotesFromFile();
    
    const newNote = {
        id: Date.now().toString(), // Generate predictable unique state tracking ID
        title: title.trim(),
        tags: Array.isArray(tags) ? tags.map(t => t.trim().toLowerCase()) : [],
        content: content || '',
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    notes.unshift(newNote); // Keep newest notes at the front
    writeNotesToFile(notes);

    res.status(201).json(newNote);
});

/**
 * ROUTE 3: PUT /api/notes/:id
 * Description: Updates an existing note payload (Crucial for atomic debounced auto-saves).
 */
app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, tags, content } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: "Validation Failure: Updated title cannot be blank." });
    }

    let notes = readNotesFromFile();
    const noteIndex = notes.findIndex(n => n.id === id);

    if (noteIndex === -1) {
        return res.status(404).json({ error: "Resource Exception: Specified Note ID not found." });
    }

    // Update resource state inline
    notes[noteIndex] = {
        ...notes[noteIndex],
        title: title.trim(),
        tags: Array.isArray(tags) ? tags.map(t => t.trim().toLowerCase()) : [],
        content: content,
        updatedAt: new Date().toISOString()
    };

    writeNotesToFile(notes);
    res.status(200).json(notes[noteIndex]);
});

/**
 * ROUTE 4: PATCH /api/notes/:id/archive
 * Description: Minimal resource state modification to toggle archival status safely.
 */
app.patch('/api/notes/:id/archive', (req, res) => {
    const { id } = req.params;
    let notes = readNotesFromFile();
    const noteIndex = notes.findIndex(n => n.id === id);

    if (noteIndex === -1) {
        return res.status(404).json({ error: "Resource Exception: Specified Note ID not found." });
    }

    // Flip the boolean archive state flag flag
    notes[noteIndex].archived = !notes[noteIndex].archived;
    notes[noteIndex].updatedAt = new Date().toISOString();

    writeNotesToFile(notes);
    res.status(200).json(notes[noteIndex]);
});

/**
 * ROUTE 5: DELETE /api/notes/:id
 * Description: Performs permanent hard deletions on the target data index.
 */
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    let notes = readNotesFromFile();
    const initialLength = notes.length;

    notes = notes.filter(n => n.id !== id);

    if (notes.length === initialLength) {
        return res.status(404).json({ error: "Resource Exception: Specified Note ID not found." });
    }

    writeNotesToFile(notes);
    res.status(200).json({ message: "Resource successfully deleted from persistent volumes." });
});

// --- Server Startup Activation ---
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Scribble API Engine Online: Running on Port ${PORT}`);
    console.log(` Base Endpoint Domain URL: http://localhost:${PORT}`);
    console.log(`====================================================`);
});