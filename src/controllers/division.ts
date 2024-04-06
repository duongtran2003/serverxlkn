import { Request, Response } from "express";
import { Division } from "../models/division";

class DivisionController {
  async create(req: Request, res: Response) {
    const { divisionName, description } = req.body;

    if (!divisionName || !description) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }
    
    const newDivision = {
      divisionName,
      description
    }
    
    Division.create(newDivision)
    .then((division) => {
      return res.status(201).json(division);
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });
    });
  }
  
  async index(req: Request, res: Response) {
    //todo: either get all divisions with their members, one specific division and its members by id or name
  }
  
  async update(req: Request, res: Response) {
    const divisionId = req.params.id;

    if (!divisionId) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }
    
    const { divisionName, description } = req.body;
    const division = {
      divisionName, 
      description
    }
    
    Division.findByIdAndUpdate(divisionId, division, { new: true })
    .then((newDivision) => {
      return res.status(200).json(newDivision);
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });
    });
  }
  
  async delete(req: Request, res: Response) {
    const divisionId = req.params.id;

    if (!divisionId) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }
    
    //todo: check if this division has any member
  }
}

export {
  DivisionController
}