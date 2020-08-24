const express = require('express');
const foldersService = require('./folders-services');
const path = require('path');

const foldersRouter = express.Router();
const jsonParser = express.json();

foldersRouter
    .route('/')
    .get((req, res, next) => {
        foldersService.getAllFolders(req.app.get('notefulDB'))
            .then(folders => {
                res.json(folders);
            })
            .catch(next);
    });

foldersRouter
    .route('/:folder_id')
    .get((req, res, next) => {
        foldersService.getById(req.app.get('notefulDB'), req.params.folder_id)
            .then(folder => {
                if (!folder) {
                    return res.status(404).json({
                        error: { message: `Folder not found` }
                    });
                }
                res.folder = folder;
                res.json({
                    id: res.folder.id,
                    name: res.folder.name
                });
                next();
            });
    });

module.exports = foldersRouter