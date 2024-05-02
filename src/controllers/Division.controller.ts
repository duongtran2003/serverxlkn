import { Request, Response } from "express";
import { Division } from "../models/division";
import { PeopleDivision } from "../models/peopleDivision";
import { HTTP_STATUS } from "../constants/HttpStatus";
import { DIVISION_MESSAGES } from "../constants/messages";

class DivisionController {
  async create(req: Request, res: Response) {
    const { divisionName, description } = req.body;

    if (!divisionName || !description) {
      return res.json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: DIVISION_MESSAGES.THIEU_THONG_TIN
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
      return res.json({
        status: HTTP_STATUS.CREATED,
        message: DIVISION_MESSAGES.TAO_DIVISION_THANH_CONG,
        data: division,
      });
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
      return res.json({
        status: HTTP_STATUS.OK,
        message: DIVISION_MESSAGES.LAY_RA_TOAN_BO_DIVISION_THANH_CONG,
        data: divisions
      })
    }
    
    const division = await Division.findById(divisionId).select("-__v");
    if (!division) {
      return res.json({
        status: HTTP_STATUS.NOT_FOUND,
        message: DIVISION_MESSAGES.KHONG_TIM_THAY_DIVISION,
      });
    }
    const divisionDetailed: any = division.toObject();
    const divisionMembers: any = [];
    const members = await PeopleDivision.find({ divisionId: divisionId });
    for (const member of members) {
      divisionMembers.push({
        peopleId: member.peopleId,
        actionId: member.actionId
      });
    }
    divisionDetailed.members = divisionMembers;
    return res.json(
      {
        status: HTTP_STATUS.OK,
        message: DIVISION_MESSAGES.LAY_RA_DIVISION_THEO_ID_THANH_CONG,
        data: divisionDetailed
      }
    );
  }
  
  async update(req: Request, res: Response) {
    const divisionId = req.params.id;

    if (!divisionId) {
      return res.json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: DIVISION_MESSAGES.THIEU_THONG_TIN,
      });
    }
    
    const { divisionName, description } = req.body;
    const division = {
      divisionName, 
      description
    }
    
    Division.findByIdAndUpdate(divisionId, division, { new: true })
    .then((newDivision) => {
      if (!newDivision) {
        return res.json({
          status: HTTP_STATUS.NOT_FOUND,
          message: DIVISION_MESSAGES.KHONG_TIM_THAY_DIVISION,
        });
      }
      newDivision?.$set({
        __v: undefined
      });
      return res.json({
        status: HTTP_STATUS.OK,
        message: DIVISION_MESSAGES.UPDATE_DIVISION_THANH_CONG,
        data: newDivision
      
      });
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
      return res.json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: DIVISION_MESSAGES.THIEU_THONG_TIN,
      });
    }
    
    const members = await PeopleDivision.find({ divisionId: divisionId });
    if (members.length) {
      return res.json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: DIVISION_MESSAGES.DIVISION_CON_THANH_VIEN,
      });
    }
    
    Division.findByIdAndDelete(divisionId)
    .then(() => {
      return res.json({
        status: HTTP_STATUS.OK,
        message: DIVISION_MESSAGES.DELETE_DIVISION_THANH_CONG,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });
    });
  }
}

export {
  DivisionController
}