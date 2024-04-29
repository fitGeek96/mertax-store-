import bcrypt from "bcryptjs";

const users = [
  {
    username: "admin",
    password: bcrypt.hashSync("123456", 10),
    email: "admin@gmail.com",
    isAdmin: true,
  },
  {
    username: "user",
    password: bcrypt.hashSync("123456", 10),
    email: "user@gmail.com",
    isAdmin: false,
  },
];

export default users;
