const express = require("express");
const router = express.Router();
const Fact = require("../Models/Fact");

// ROUTE : 1 ?  check the server
router.get("/check", (req, res) => {
  return res.json({ status: true, msg: "Server is running" });
});

// ROUTE : 2 ?  get all facts
router.get("/getfacts/:catg", async (req, res) => {
  try {
    const cat = req.params.catg;
    let data;
    if (cat == "general") {
      data = await Fact.find();
    } else {
      data = await Fact.find({ category: cat });
    }
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
    return res.send({ status: false, msg: "Try Again", error: err });
  }
});

module.exports = router;
