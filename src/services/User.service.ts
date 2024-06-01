import { People } from "../models/people"
import bcrypt from 'bcrypt';
import { PeopleDivision } from "../models/peopleDivision";

class UserService {
  async getUserByUsername(username: string) {
    const user = await People.findOne({ username: username });
    return user;
  }

  async createNewUser(fullname: string, username: string, email: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      fullname: fullname,
      username: username,
      email: email,
      password: hashedPassword,
    }

    const user = await People.create(newUser);
    user.$set({
      password: undefined,
      __v: undefined,
    });
    return user;
  }

  async getAllUsers() {
    const users = await People.find({}, { password: 0, __v: 0, isAdmin: 0 });
    return users;
  }

  async getUsersWithOptions(options: any[]) {
    const users = await People.find({ $and: options }, { password: 0, __v: 0, isAdmin: 0 });
    return users;
  }

  async getUserById(id: any) {
    const user = await People.findById(id);
    return user;
  }

  async updateUser(id: any, username: string, fullname: string, email: string, password: string, oldPassword: string) {
    const user = {
      username: username,
      fullname: fullname,
      email: email,
      password: password,
      oldPassword: oldPassword
    }

    const updatedUser = await People.findByIdAndUpdate(id, user, { new: true });
    if (updatedUser) {
      updatedUser.$set({
        password: undefined,
        __v: undefined,
      })
    }

    return updatedUser;
  }

  async deleteUser(id: string) {
    await People.findByIdAndDelete(id);
    return;
  }

  async assignDivision(peopleId: string, actionId: string, divisionId: string) {
    const peopleDivision = await PeopleDivision.create({ peopleId, actionId, divisionId });
    peopleDivision.$set({
      __v: undefined,
    })
    return peopleDivision;
  }

  async removeFromDivision(peopleId: string, divisionId: string) {
    await PeopleDivision.deleteOne({ peopleId: peopleId, divisionId: divisionId });
    return;
  }
}

export {
  UserService
}
