import mongoose from "mongoose";

async function connect() {
  await mongoose.connect(process.env.DATABASE_CONNECTION || "")
  .then(() => {
    console.log("db connected")
  })
  .catch((err) => {
    console.log(err);
  });
}

export {
  connect
}