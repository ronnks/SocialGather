import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models";
import { requireAuth } from "../middleware";

const userRouter = express.Router();
////not completed
userRouter
  .route("/:username")
  .get()
  /**
   * Your GET route here
   */
  .get(async (req, res) => {
    const { password } = req.body;
    const { username } = req.params;

    const hashedpassword = await bcrypt.hash(password, 12);

    try {
      const userUpdate = await User.findOneAndUpdate(
        {
          username,
        },
        {
          passwordHash: hashedpassword,
        },
        {
          new: true,
        }
      );

      res.json(userUpdate.toJSON());
    } catch (error) {
      res.status(404).end();
    }
  })
  .put(async (req, res) => {
    const { password } = req.body;
    const { username } = req.params;

    const hashedpassword = await bcrypt.hash(password, 12);

    try {
      const userUpdate = await User.findOneAndUpdate(
        {
          username,
        },
        {
          passwordHash: hashedpassword,
        },
        {
          new: true,
        }
      );

      res.json(userUpdate.toJSON());
    } catch (error) {
      res.status(404).end();
    }
  });

userRouter.route("/:username/avatar").put(requireAuth, async (req, res) => {
  const { username } = req.params;
  const { profile_image } = req.body;

  if (!req.user.username.toLowerCase() === username.toLowerCase()) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  user.profile_image = profile_image;
  await user.save();
  res.json(user.toJSON());
});

module.exports = userRouter;
