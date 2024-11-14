const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");
const postModel = require("./models/post");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { render } = require("ejs");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("start");
});

app.get("/login", (req, res) => {
  res.render("login");
});

const finduser = async (email) => {
  try {
    return await userModel.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }
};

app.get("/postshow/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postModel.findOne({ _id: id });
    if (post) {
      res.render("postshow", { post: post });
    } else {
      res.status(400).send("No Such Post Exists");
    }
  } catch (err) {
    res.status(400).send("Error in server");
  }
});

app.get("/EditPost/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postModel.findOne({ _id: id });
    if (post) {
      res.render("editpost", { post: post });
    } else {
      res.status(400).send("No Such Post Exists");
    }
  } catch (err) {
    res.status(400).send("Error in server");
  }
});

const isLoggedOut = (req, res, next) => {
  if (req.cookies.token) {
    return res
      .status(403)
      .send("You are already logged in. Log out to create a new account.");
  }
  next();
};

app.post("/register", isLoggedOut, async (req, res) => {
  const { email, password, username, name, age } = req.body;
  try {
    let user = await finduser(email);
    if (user) {
      return res.status(409).send("User already registered");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user = await userModel.create({
        username,
        name,
        email,
        password: hash,
        age,
      });
      let token = jwt.sign({ email: email, userid: user._id }, "shhhhh");
      res.cookie("token", token);
      res.redirect("feed");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await finduser(email);
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).send("Server error");
      }
      if (result) {
        let token = jwt.sign({ email: email, userid: user._id }, "shhhhh");
        res.cookie("token", token);
        res.redirect("feed");
      } else {
        res.redirect("/login");
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

const isLoggedIn = (req, res, next) => {
  if (!req.cookies.token) {
    return res.status(401).send("Unauthorized");
  }
  try {
    let data = jwt.verify(req.cookies.token, "shhhhh");
    req.user = data;
    next();
  } catch (err) {
    return res.status(403).send("Invalid Token");
  }
};

app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    // Find the user by _id and populate their associated posts
    const user = await userModel
      .findOne({ _id: req.user.userid })
      .populate("post");

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Render the profile view with the user's posts
    res.render("profile", { posts: user.post || [] });
  } catch (err) {
    // Log the error and send a server error response
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  try {
    const post = await postModel.findOne({ _id: id });
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const userIndex = post.likes.indexOf(user.userid);
    if (userIndex > -1) {
      post.likes.splice(userIndex, 1); // Unlike the post
    } else {
      post.likes.push(user.userid); // Like the post
    }
    await post.save();
    res.redirect("/feed");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.get("/feed", isLoggedIn, async (req, res) => {
  try {
    const posts = await postModel
      .find({})
      .populate("user")
      .sort({ date: -1 })
      .exec(); // no callback is needed now

    res.render("feed", { posts: posts });
  } catch (err) {
    res.status(500).send("Error fetching posts");
  }
});

app.post("/editpost/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Update the post with new title and content
    await postModel.updateOne(
      { _id: id },
      {
        title: req.body.title,
        content: req.body.content,
      }
    );

    // Redirect the user to the profile page or feed after editing
    res.redirect("/profile");
  } catch (err) {
    // Log the error and send a server error response
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/CreatePost", isLoggedIn, (req, res) => {
  res.render("post");
});
app.post("/submit-post", isLoggedIn, async (req, res) => {
  const { title, content } = req.body;

  try {
    let user = await finduser(req.user.email);
    if (!user) {
      return res.status(404).send("User not found");
    }

    let post = await postModel.create({
      title: title,
      content: content,
      user: user._id,
    });

    user.post.push(post._id);
    await user.save();

    res.redirect("/feed");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.get("/sign-in", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
