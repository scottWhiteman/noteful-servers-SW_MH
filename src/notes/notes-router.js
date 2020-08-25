const path = require('path');
const express = require('express');
const xss = require('xss');
const notesService = require('./notes-services');

const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = note => ({
    id: xss(note.id),
    name: xss(note.name),
    modified: note.modified,
    folder_id: xss(note.folder_id),
    content: xss(note.content)
});

notesRouter
    .route('/')
    .get((req, res, next) => {
        notesService.getAllNotes(req.app.get('notefulDB'))
            .then(notes => {
                res.json(notes.map(serializeNote));
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { name, modified, folder_id, content } = req.body;
        const newNote = { name, folder_id };

        for (const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Requires ${key} in request` }
                });
            }
        }

        newNote.modified = modified;
        newNote.content = content;

        notesService.insertNote(req.app.get('notefulDB'), newNote)
            .then(note => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${note.id}`))
                    .json(serializeNote(note))
            })
            .catch(next);
    });

notesRouter
    .route('/:note_id')
    .all((req, res, next) => {
        notesService.getById(req.app.get('notefulDB'), req.params.note_id)
            .then(note => {
                if (!note) {
                    return res.status(404).json({
                        error: { message: 'Note not found' }
                    });
                }
                res.note = note;
                next()
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeNote(res.note));
    })
    .delete((req, res, next) => {
        notesService.deleteNote(req.app.get('notefulDB'), req.params.note_id)
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = notesRouter;