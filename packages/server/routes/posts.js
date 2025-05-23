import express from "express";
const postsRouter = express.Router();
import { Post } from "../models";
import { requireAuth } from "../middleware";

postsRouter.get("/", async (req, res) => {
  const populateQuery = [
    { path: "author", select: ["username", "profile_image"] },
    {
      path: "comments",
      populate: { path: "author", select: ["username", "profile_image"] },
    },
  ];
  const posts = await Post.find({})
    .sort({ created: -1 })
    .populate(populateQuery)
    .exec();

  res.json(posts.map((post) => post.toJSON()));
});

postsRouter.post("/", requireAuth, async (req, res, next) => {
  const { text } = req.body;
  const { user } = req;

  const post = new Post({
    text: text,
    author: user._id,
  });

  try {
    const savedPost = await post.save();
    user.posts = user.posts.concat(savedPost._id);

    await user.save();

    res.json(savedPost.toJSON());
  } catch (error) {
    next(error);
  }
});

postsRouter.get("/:id", async (req, res) => {
  const populateQuery = [
    { path: "author", select: ["username", "profile_image"] },
    {
      path: "comments",
      populate: { path: "author", select: ["username", "profile_image"] },
    },
  ];
  const post = await Post.findById(req.params.id)
    .populate(populateQuery)
    .exec();
  if (post) {
    res.json(post.toJSON());
  } else {
    res.status(404).end();
  }
});

postsRouter.delete("/:id", requireAuth, async (req, res, next) => {
  /**
   * Your Code Here
   */
  const { user } = req;

  try {
    await Post.deleteOne({ author: user });
  } catch (error) {
    res.status(404).json("Placeholder response");
    next(error);
  }
});

postsRouter.all("/like/:postId", requireAuth, async (req, res) => {
  const { postId } = req.params;
  const { user } = req;
  const post = await Post.findOne({ _id: postId });

  if (!post) {
    return res.status(422).json({ error: "Cannot find post" });
  }
  try {
    if (post.likes.includes(user.id)) {
      const result = await post.updateOne({
        $pull: { likes: user.id },
      });

      res.json(result);
    } else {
      const result = await post.updateOne({
        $push: { likes: user.id },
      });

      res.json(result);
    }
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});

postsRouter.put("/comments", async (req, res, next) => {
  const { text, userId, postId } = req.body;
  const comment = {
    text: text,
    author: userId,
  };
  const populateQuery = [
    { path: "comments.author", select: ["username", "profile_image"] },
  ];
  Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate(populateQuery)
    .exec((err, result) => {
      if (err) {
        next(err);
      } else {
        res.json(result);
      }
    });
});

module.exports = postsRouter;
