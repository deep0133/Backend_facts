const express = require("express");
const router = express.Router();
const Admin = require("../Models/admin");
const Fact = require("../Models/Fact");
const multer = require("multer");
const fs = require("fs");

// ROUTE : 1 ?  check the server
router.get("/", (req, res) => {
  res.send("Hello World!");
});

// ROUTE : 2 ?  verify admin
router.post("/verify", async (req, res) => {
  try {
    const userName = req.body.name;
    const password = req.body.password;

    const admin = await Admin.findOne({ name: userName, password: password });

    if (!admin) {
      return res.send({
        status: false,
        msg: "Sorry ! you are not authorized for this",
      });
    }
    return res.send({
      status: true,
      id: admin._id,
      msg: "you can proceed forword",
    });
  } catch (err) {
    return res.send({ error: err });
  }
});

// ROUTE : 2 ?  get all facts
router.get("/getfact", async (req, res) => {
  try {
    const id = await req.params.id;
    const adminId = await Admin.find();
    if (!adminId) {
      return res.send({
        status: false,
        msg: "Sorry! You need to authorized first.",
      });
    }

    let data = await Fact.find();
    if (data == null) {
      return res.status(400).json({
        success: false,
        error: [
          {
            msg: "sorry facts are not added yet to show you:",
          },
        ],
      });
    }

    return res.send(data);
  } catch (err) {
    res.send({ status: false, msgCatch: "error" });
  }
});

// SET STORAGE FOR IMAGE:   STORE IMAGE IN FOLDER
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

// ROUTE : 3 ?   add facts    :: id = admin_id
router.post(
  "/addfact/:id",
  upload.single("uploaded_file"),
  async (req, res) => {
    try {
      const id = await req.params.id;

      if (id == null || id === undefined) {
        return res.send({
          status: false,
          params: "id",
          msg: "Sorry! You need to authorized first.",
        });
      }

      const author = req.body.author;
      const category = req.body.category;
      const title = req.body.title;
      const description = req.body.desc;

      const adminId = await Admin.find({ _id: id });
      if (!adminId) {
        return res.send({
          status: false,
          msg: "Sorry Sorry ! You need to authorized first.",
        });
      }

      var img = await fs.readFileSync("uploads/" + req.file.filename);
      var encode_img = img.toString("base64");
      var final_img = {
        contentType: req.file.mimetype,
        data: new Buffer(encode_img, "base64"),
      };

      let data = await Fact.create({
        author: author,
        category: category,
        title: title,
        imageUrl: final_img,
        desc: description,
      });

      if (data) {
        return res.json({
          status: true,
          msg: "new fact added successfully",
          datat: data,
        });
      } else {
        return res
          .status(400)
          .send({ error: "fact not added try again", status: false });
      }
    } catch (err) {
      res.send({ status: false, msgCatch: "error", err });
    }
  }
);

// ROUTE : 3 ?   update facts  ::  id = fact_id    :: body-contain  =>  id = admin_id
router.post(
  "/updatefact/:id",
  upload.single("uploaded_file"),
  async (req, res) => {
    try {
      const factId = req.params.id;
      const adminId = req.body.id;

      if (!adminId) {
        return res.send({
          status: false,
          params: "id",
          msg: "Sorry! You need to authorized first.",
        });
      }

      if (!factId) {
        return res.send({
          status: false,
          msg: "Click on update button to update a fact.",
        });
      }

      const factData = await Fact.findById(factId);
      if (factData == null) {
        return res.send({
          status: false,
          msg: "Sorry! You fact is not exist.",
        });
      }

      const author = req.body.author ? req.body.author : factData.author;
      const category = req.body.category
        ? req.body.category
        : factData.category;
      const title = req.body.title ? req.body.title : factData.title;
      const description = req.body.desc ? req.body.desc : factData.desc;

      var img = await fs.readFileSync("uploads/" + req.file.filename);
      var encode_img = img.toString("base64");
      var final_img = {
        contentType: req.file.mimetype,
        data: new Buffer(encode_img, "base64"),
      };

      let data = await Fact.findByIdAndUpdate(factId, {
        author: author,
        category: category,
        title: title,
        imageUrl: final_img,
        desc: description,
      });

      if (data) {
        return res.send({
          status: true,
          msg: "Fact updated successfully",
          res: data,
        });
      } else {
        return res.send({
          error: "sorry not updated yet: please try agian",
          status: false,
        });
      }
    } catch (err) {
      return res.send({ status: false, error: "try again", err_msg: err });
    }
  }
);

// ROUTE : 4 ?   delete facts  ::  id = fact_id    :: body-contain  => id = admin_id
router.delete("/deletefact/:id", async (req, res) => {
  try {
    const id = await req.params.id;
    const adminId = await req.body.id;
    if (adminId == null || adminId == "") {
      return res.send({
        status: false,
        params: "id",
        msg: "Sorry! You need to authorized first.",
      });
    }

    if (id == null) {
      return res.send({
        status: false,
        params: "id",
        msg: "Sorry! Click on delete button to delete a fact.",
      });
    }
    const deletedFact = await Fact.deleteOne({ _id: id });

    if (deletedFact == null) {
      return res.send({
        status: false,
        params: "del",
        msg: "Sorry! fact already deleted.",
      });
    }

    return res.send({ status: true, msg: "deleted successfully" });
  } catch (err) {
    res.send({ status: false, msgCatch: "error" });
  }
});

module.exports = router;
