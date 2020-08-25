const express = require('express');
const xss = require('xss');
const foldersService = require('./folders-services');
const path = require('path');

const foldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
    id: xss(folder.id),
    name: xss(folder.name)
});

foldersRouter
    .route('/')
    .get((req, res, next) => {
        foldersService.getAllFolders(req.app.get('notefulDB'))
            .then(folders => {
                res.json(folders.map(serializeFolder));
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body;
        const newFolder = { name };

        if (newFolder.name == null) {
            return res.status(400).json({
                error: { message: 'Folder is missing name' }
            });
        }

        foldersService.insertFolder(req.app.get('notefulDB'), newFolder)
            .then(folder => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(serializeFolder(folder));
            })
            .catch(next);
    });

foldersRouter
    .route('/:folder_id')
    .all((req, res, next) => {
        foldersService.getById(
            req.app.get('notefulDB'),
            req.params.folder_id
        )
            .then(folder => {
                if(!folder) {
                    return res.status(404).json({
                        error: { message: `Folder not found` }
                    });
                }
                res.folder = folder;
                next();
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeFolder(res.folder));
    })
    .delete((req, res, next) => {
        foldersService.deleteFolder(
            req.app.get('notefulDB'),
            req.params.folder_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next);
    });

module.exports = foldersRouter