const express = require("express");
const Router = express.Router;

const MasterTableController = require("../controller/masterTable");

const masterTableRouter = Router();
const masterTableController = new MasterTableController();

masterTableRouter.get('/blood_group', masterTableController.getBloodGroup)
masterTableRouter.get('/community', masterTableController.getCommunity)
masterTableRouter.get('/caste', masterTableController.getCaste)
masterTableRouter.get('/religion', masterTableController.getReligion)
masterTableRouter.get('/nationality', masterTableController.getNationality)

masterTableRouter.get('/city', masterTableController.getCity)
masterTableRouter.get('/district', masterTableController.getDistrict)
masterTableRouter.get('/state', masterTableController.getState)
masterTableRouter.get('/country', masterTableController.getCountry)

module.exports = masterTableRouter;