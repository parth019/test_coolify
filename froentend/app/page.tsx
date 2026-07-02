"use client";

import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes(): Promise<void> {
    try {
      const res = await fetch("http://localhost:5000/api/notes");
      const data: Note[] = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createNote(): Promise<void> {
    if (!title || !content) return;

    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const newNote: Note = await res.json();

      setNotes([...notes, newNote]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async function updateNote(): Promise<void> {
    if (!editingNote) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${editingNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editingNote.title,
            content,
          }),
        },
      );

      const updated: Note = await res.json();

      setNotes(notes.map((n: Note) => (n.id === updated.id ? updated : n)));

      setEditingNote(null);
      setContent("");
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async function deleteNote(id: number): Promise<void> {
    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
      });

      setNotes(notes.filter((n: Note) => n.id !== id));
    } catch (err) {
      console.error("Error:", err);
    }
  }

  if (loading) return <p>Loading...</p>;

  console.log(notes);

  return (
    <div style={{ padding: "40px", maxWidth: "700px" }}>
      <h1>Notes App</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <h3>{editingNote ? "Edit Note" : "Create Note"}</h3>

        <input
          type="text"
          placeholder="Title"
          value={editingNote ? editingNote.title : title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            editingNote
              ? setEditingNote({
                  ...editingNote,
                  title: e.target.value,
                })
              : setTitle(e.target.value)
          }
          style={{
            display: "block",
            padding: "8px",
            width: "100%",
            marginBottom: "8px",
          }}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
          style={{
            display: "block",
            padding: "8px",
            width: "100%",
            marginBottom: "8px",
          }}
        />

        <button onClick={editingNote ? updateNote : createNote}>
          {editingNote ? "💾 Save" : "➕ Create"}
        </button>

        {editingNote && (
          <button
            onClick={() => {
              setEditingNote(null);
              setContent("");
            }}
            style={{ marginLeft: "8px" }}
          >
            ❌ Cancel
          </button>
        )}
      </div>

      {notes.map((note: Note) => (
        <div
          key={note.id}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <h3>{note.title}</h3>

          <p
            style={{
              color: "#666",
              marginBottom: "12px",
            }}
          >
            {note.content}
          </p>

          <button
            onClick={() => {
              setEditingNote(note);
              setContent(note.content);
            }}
            style={{ marginRight: "8px" }}
          >
            ✏️ Edit
          </button>

          <button onClick={() => deleteNote(note.id)}>🗑️ Delete</button>
        </div>
      ))}
    </div>
  );
}
