const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let notes = [
  { id: 1, title: "Meeting Notes", content: "Discuss project timeline" },
  { id: 2, title: "Shopping List", content: "Milk, Eggs, Bread" },
  { id: 3, title: "Ideas", content: "Build a todo app" },
];

// GET all notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// POST create note
app.post("/api/notes", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  const newNote = {
    id: Date.now(),
    title,
    content,
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// PUT update note
app.put("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes[noteIndex] = { id, title, content };
  res.json(notes[noteIndex]);
});

// DELETE note
app.delete("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const lengthBefore = notes.length;
  notes = notes.filter((n) => n.id !== id);
  
  if (notes.length === lengthBefore) {
    return res.status(404).json({ message: "Note not found" });
  }
  
  res.json({ message: "Deleted" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});