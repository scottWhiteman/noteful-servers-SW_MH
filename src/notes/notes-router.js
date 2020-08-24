const express = require('express');
const notesService = require('./notes-services');

const notesRouter = express.Router();

notesRouter
    .route('/')
    .get((req, res, next) => {
        notesService.getAllNotes(req.app.get('notefulDB'))
            .then(notes => {
                res.json(notes);
            })
            .catch(next);
    });

notesRouter
    .route('/:note_id')
    .get((req, res, next) => {
        notesService.getById(req.app.get('notefulDB'), req.params.note_id)
            .then(note => {
                if (!note) {
                    return res.status(404).json({
                        error: { message: 'Note not found' }
                    })
                }
                res.note = note;
                res.json({
                    id: res.note.id,
                    name: res.note.name,
                    modified: res.note.modified,
                    folder_id: res.note.folder_id,
                    content: res.note.content
                })
                next();
            })
    });

module.exports = notesRouter;