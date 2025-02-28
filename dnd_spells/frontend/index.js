const express = require("express");
const { engine } = require("express-handlebars");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/spells");
    res.render("home", { title: "DnD Spells", spells: response.data });
  } catch (error) {
    res.render("home", { title: "DnD Spells", spells: [] });
  }
});

app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});
