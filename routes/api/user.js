const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../service/schemas/user");
require("dotenv").config();
const secret = process.env.SECRET;

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.post("/registration", async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
   if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ username, email });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
       user: {
         email, subscription:"starter",
      },
      data: {
        message: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
});

router.get("/logout", async (req, res, next) => {
   try {
      
      const user = await User.findOne({ _id: req.body.id });
      console.log(user)
      if (!user) return res.status(401).json({ message: " Not authorized" });
      await User.findByIdAndUpdate(user.id, { token: null });
      res.sendStatus(204);
   }catch (error) {
   next(error);
}  
})
router.get("/current", async (req, res, next) => {
   try {
      const user = await User.findOne({ _token: req.body.token });
      console.log(user)
      if (!user) return res.status(401).json({ message: "Not Authorizaed" });
      res.status(200)
         .json({ email: user.email, subscription: user.subscription });
   } catch(error){next(error)}

})

router.get("/", async (req, res, next) => {
   try {
      const result = await User.find();
      res.status(200).json(result);
   } catch (error) {
      console.log(error.message); next(error);
   }
})

router.patch("/", auth, async (req, res, next) => {
   try {
      const { subscription } = req.body;
      const user = await User.findOne({ _token: req.body.token });
      if (!user) return res.status(401).json({ message: "Not Authorized" });
      const newUser = await User.findByIdAndUpdate(user.id, { subscription });
      res.status(200)
      .json({email: newUser.email, subscription:newUser.subscription})
   } catch (error) {
      next(error);
   }
})

module.exports = router;