const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const  User = require("../../service/schemas/user");
require("dotenv").config();
const secret = process.env.SECRET;
const { auth } = require("../../config/passport");
const { upload, storeImage } = require("../../config/upload");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const { editorPic } = require("../../config/edit");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../../service/sendMail");

//////////Registration//////////
router.post("/registration", async (req, res, next) => {
   const { email, password } = req.body;
   
   const user = await User.findOne({ email });
   if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
   }
   const idToken = uuidv4();
   try {
      const fileName = gravatar.url(email, { s: "250", d: "mp" });
      const newUser = new User({ email, fileName, verificationToken:idToken });
    newUser.setPassword(password);
      await newUser.save();
      await sendEmail(email, idToken);
    res.status(201).json({
      status: "success",
       user: {
         email, subscription:"starter",
       },data: {
        message: 'Registration successful',
      },       
    });
  } catch (error) {
    next(error);
  }
});
//////////Login//////////
router.post("/login", async (req, res, next) => {
   try {
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
         id: user._id,
         email: user.email,
      };

         const token = jwt.sign(payload, secret, { expiresIn:"1h" });
         await User.findByIdAndUpdate(user.id, { token });
      res.status(200).json({
         status: "success",
            token,
            user:{email, subscription: user.subscription}
      });
   } catch (error) {
      next(error)
   }
});
//////////Logout//////////
router.get("/logout",async (req, res, next) => {
   try {
      const user = await User.findOne({ _id: req.body.id });
      console.log(user.token)
      if (!user) return res.status(401).json({ message: " Not authorized" });
      await User.findByIdAndUpdate(user.id, { token: null });
      res.json({
         status: "success",
         message: "you have been logout ",
      });
   }catch (error) {
   next(error);
}  
})
//////////Current//////////
router.get("/current", auth, async (req, res, next) => {
   const user = await User.findOne({token: req.user.token})
   try {
      //const user = await User.findOne({_token: user.token});
      
      if (!user) return res.status(401).json({ message: "Not Authorized" });
      res.status(200)
         .json({ email: user.email, subscription: user.subscription });
      console.log("ok get it")
   } catch (error) { next(error) }

});
//////////Get//////////
router.get("/", async (req, res, next) => {
   try {
      const result = await User.find();
      res.status(200).json(result);
   } catch (error) {
      console.log(error.message); next(error);
   }
})
//////////Patch//////////
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

router.patch("/avatars", upload.single("avatar"),auth,  async(req, res, next) => {
   
   try {
      const { path: temporaryName, originalname } = req.file;
      const fileName = path.join(storeImage, originalname);
      editorPic(temporaryName, fileName);

      await fs.unlink(temporaryName);

      const user = await User.findOne({ _token: req.body.token });
      if (!user) return res.status(401).json({ message: "Not authorized" });
      const newUser = await User.findByIdAndUpdate(user.id, { fileName });
      res.status(200).json({ fileName: newUser.fileName})
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }

})

router.get("/verify/:verificationToken", async (req, res, next) => {
   const { verificationToken } = req.params;
   const user = await User.findOne({ verificationToken });
   try {
      if (!user) return res.statusMessage(404).json({message: "User not found"});
      await User.findByIdAndUpdate(
         user.id, { verify: true, verificationToken: null }
      );
res.status(200).json({ message: "Verification successfull" });
   } catch (error) {
      next(error);
   }
});

router.post("/verify", async (req, res, next) => {
   const { email } = req.body;
   const user = await User.findOne({ email });
   try {
      if (!email || !user) return res.status(400).json({ message: "missing required field email" })
      await sendEmail(email, user.verificationToken);
      res.status(200).json({ message: "Verification email sent" });
   } catch (error) {
      next(error);
   }

})


module.exports = router;