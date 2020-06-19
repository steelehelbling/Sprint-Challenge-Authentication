const router = require("express").Router();
const bcrypt = require("bcryptjs");
const secrets = require("../secrets");
const jwt = require("jsonwebtoken");
const Users = require("../users-model");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then((saved) => {
      const token = maketoken(saved);
      res.status(201).json({ created_user: saved, token: token });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = maketoken(user);
        res.status(200).json({ username: user.username, token: token });
      } else {
        res.status(401).json({ message: "login did not work" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

function maketoken(user) {
  const payload = {
    userid: user.id,
    username: user.username,
  };

  const options = { expiresIn: "1h" };
  const token = jwt.sign(payload, secrets.jwtSecret, options);

  return token;
}

module.exports = router;
