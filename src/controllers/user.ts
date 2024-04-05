import { Request, Response } from "express";
import { Validator } from "../helpers/validator";
import { People } from "../models/people";
import bcrypt from 'bcrypt';

class UserController {
  async create(req: Request, res: Response) {
    const { fullname, username, email, password } = req.body;
    if (!fullname || !username || !email || !password) {
      return res.status(400).json({
        "message": "thieu thong tin",
      });
    }
    const validator = new Validator();
    if (!validator.isEmail(email) || !validator.isUsername(username) || !validator.isPassword(password)) {
      return res.status(400).json({
        "message": "thong tin khong hop le",
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
      fullname: fullname,
      username: username,
      email: email,
      password: hashedPassword,
    }
    
    People.create(newUser)
    .then((user) => {
      user.$set({ password: undefined });
      user.$set({ __v: undefined });
      return res.status(201).json(user);
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
    
    let users: any = [];

    if (options.length) {
      users = await People.find({ $or: options }, { password: 0, __v: 0 });
    }
    else {
      users = await People.find({}, { password: 0, __v: 0 });
    }
    return res.status(200).json(users);
  }
  
  async update(req: Request, res: Response) {
    const validator = new Validator();
    const { username, fullname, email, password, oldPassword } = req.body;
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        "message": "thieu user id",
      })
    }
    let updatedUser: {
      fullname: string | undefined,
      username: string | undefined,
      email: string | undefined,
      password: string | undefined,
    } = {
      fullname: undefined,
      username: undefined,
      email: undefined,
      password: undefined
    }
    if (username) {
      if (!validator.isUsername(username)) {
        return res.status(400).json({
          "message": "thong tin khong hop le",
        });
      }
      const user = await People.findOne({ username: username });
      if (user) {
        return res.status(409).json({
          "message": "username da ton tai",
        });
      }
      updatedUser.username = username;
    }

    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          "message": "thong tin khong hop le",
        });
      }      
      updatedUser.email = email;
    }
    
    if (fullname) {
      updatedUser.fullname = fullname;
    }
    
    if (password) {
      if (!oldPassword) {
        return res.status(400).json({
          "message": "thieu mat khau cu",
        });
      }
      if (!validator.isPassword(password)) {
        return res.status(400).json({
          "message": "thong tin khong hop le",
        });
      }
      let user = await People.findById(userId);
      if (!user) {
        return res.status(400).json({
          "message": "sai user id",
        });
      }
      const result = await bcrypt.compare(oldPassword, user.password);
      if (result) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updatedUser.password = hashedPassword;
      }
      else {
        return res.status(400).json({
          "message": "mat khau khong trung khop",
        });
      }
    }
    People.findByIdAndUpdate(userId, updatedUser, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(400).json({
          "message": "sai user id",
        });
      }
      updatedUser?.$set({ password: undefined });
      updatedUser?.$set({ __v: undefined });
      return res.status(200).json(updatedUser);
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error: " + err.message,
      });
    });
  }
  
  async delete(req: Request, res: Response) {
    const userId = req.params.id;
    People.findByIdAndDelete(userId)
    .then(() => {
      return res.status(200).json({
        "message": "success",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        "message": "server error" + err.message,
      });
    });
  }
}

export {
  UserController
}