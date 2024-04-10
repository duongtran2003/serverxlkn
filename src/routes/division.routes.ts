import { Router } from "express";
import { DivisionController } from "../controllers/Division.controller";
import { isAdmin } from "../guards/isAdmin";
import { isAuthenticated } from "../guards/isAuthenticated";

const divisionRouter = Router();
const divisionController = new DivisionController();

divisionRouter.get('/:id?', isAuthenticated, divisionController.index);
divisionRouter.post('/', isAuthenticated, isAdmin, divisionController.create);
divisionRouter.patch('/:id', isAuthenticated, isAdmin, divisionController.update);
divisionRouter.delete('/:id', isAuthenticated, isAdmin, divisionController.delete);

export {
  divisionRouter
}