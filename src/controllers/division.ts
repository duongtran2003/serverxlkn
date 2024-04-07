import { Request, Response } from "express";
import { Division } from "../models/division";
import { PeopleDivision } from "../models/peopleDivision";

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
      division.$set({
        __v: undefined
      });
      return res.status(201).json(division);
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });
    });
  }
  
  async index(req: Request, res: Response) {
    const divisionId = req.params.id;

    if (!divisionId) {
      const divisions = await Division.find({}).select("-__v");
      return res.status(200).json(divisions);
    }
    
    const division = await Division.findById(divisionId).select("-__v");
    if (!division) {
      return res.status(404).json({
        "message": "khong tim thay division",
      });
    }
    const divisionDetailed: any = division.toObject();
    const divisionMembers: any = [];
    const members = await PeopleDivision.find({ divisionId: divisionId });
    for (const member of members) {
      divisionMembers.push(member.peopleId);
    }
    divisionDetailed.members = divisionMembers;
    return res.status(200).json(divisionDetailed);
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
      newDivision?.$set({
        __v: undefined
      });
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