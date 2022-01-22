const express = require("express");
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser"); //Importing the "fetchuser" middleware
const { body, validationResult } = require("express-validator"); //Importing the "express-validator" middleware

const router = express.Router();

//EndPoint for fetching a user's notes
//This is the route that will be called when we make a get request to /api/notes/fetchallnotes -> Here we willall thee notes of an user.
//Login Required
//Route->#1: "/api/notes/fetchallnotes"
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//
//
//Endpoint for adding a user's note
//This is the route that will be called when we make a post request to /api/notes/addnote -> Here we will add a note to an user.
//Login Required
//Route->#2: "/api/notes/addnote"
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Total  letters in title must be >= 3").isLength({
      min: 3,
    }),
    body("description", "Total  letters in description must be >= 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();

      res.json(saveNote);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//Endpoint for updating a user's note
//This is the route that will be called when we make a put request to /api/notes/updatenote/:id -> Here we will update a note of an user.
//Route->#3: "/api/notes/updatenote/:id"
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};

    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Endpoint for deleting a user's note
//This is the route that will be called when we make a delete request to /api/notes/deletenote/:id -> Here we will delete a note of an user.
//Login Required
//  Route->#4: "/api/notes/deletenote/:id"
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json({ Success: "Note Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
