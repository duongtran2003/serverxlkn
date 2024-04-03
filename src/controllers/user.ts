import { Request, Response } from "express";
import { Validator } from "../helpers/validator";
import { People } from "../models/people";
import bcrypt from 'bcrypt';

class UserController {
  async register(req: Request, res: Response) {
    const { fullname, username, email, password } = req.body;
    const validator = new Validator();
    if (!validator.isEmail(email) || !validator.isUsername(username) || !validator.isPassword(password)) {
      return res.status(400).json({
        "message": "bad request",
      });
    }
    let user = await People.findOne({ username: username });
    if (user) {
      return res.status(409).json({
        "message": "username da ton tai",
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = {
      fullname,
      username,
      email,
      hashedPassword,
    }
    
    People.create(newUser)
    .then((user) => {
      let newUser = {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
      }
      return res.status(201).json(newUser);
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });
    })
  }
  
  async index(req: Request, res: Response) {
    const username = req.query.username;
    const email = req.query.email;
    const fullname = req.query.fullname;
    const id = req.query.id;
   
    let options = [];
    if (username) {
      options.push({ username: { $regex: '.*' + username + '.*' }});
    }
    if (email) {
      options.push({ email: { $regex: '.*' + email + '.*' }});
    }
    if (fullname) {
      options.push({ fullname: { $regex: '.*' + fullname + '.*' }});
    }
    if (id) {
      options.push({ _id: id});
    }

    let users = await People.find({ $or: options }, { password: 0 });
    return res.status(200).json(users);
  }
}

export {
  UserController
}