const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

const users = [];

app.get("/", (req, res) => {
  res.send("Root page");
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    newuser = {
      name: req.body.name,
      password: hashedPassword,
    };
    users.push(newuser);
    res.status(201).send("User added : " + JSON.stringify(newuser));
  } catch (error) {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => req.body.name == user.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  console.log(user.name + " exists");
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Invalid password')
    }
  } catch {
    res.status(500).send()
  }
});

app.listen(3000, () => console.log("Listening on port 3000"));
