const express = require("express");
const Router = express.Router;

const MasterTableController = require("../controller/masterTable");

const masterTableRouter = Router();
const masterTableController = new MasterTableController();

masterTableRouter.get('/:option', masterTableController.getOptions)
masterTableRouter.get('/:option/:id', masterTableController.getValue)

module.exports = masterTableRouter;