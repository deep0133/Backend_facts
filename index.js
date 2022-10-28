const express = require("express");
const db = require("./db");
const cors = require("cors");
const app = express();
const port = 3005;

// config:
app.use(cors());
app.use(express.json());

app.use(`/api/admin/`, require("./routes/admin"));
app.use(`/api/user`, require("./routes/user"));

//  connecting with database and listing the server on port:3005
const dbCannect = async () => {
  await db();

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

dbCannect();
