const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");

const app = express();
const PORT = process.env.PORT || 8080;
const SPELLS_FILE = "spells.json"; // Path to your spells JSON file

app.use(cors());
app.use(express.json());
app.set("view engine", "hbs"); // Make sure Handlebars is set as the view engine

// Helper functions for reading and writing spells to a JSON file
const getSpells = () => {
  // Reading the JSON file where spells are stored
  return fs.readJsonSync(SPELLS_FILE, { throws: false }) || [];
};

const saveSpells = (spells) => {
  // Saving the updated spells list to the JSON file
  fs.writeJsonSync(SPELLS_FILE, spells, { spaces: 2 });
};

// GET route for the home page
app.get("/", (req, res) => {
  const spells = getSpells(); // Fetching spells from the file
  res.render("home", { title: "DnD Spells", spells });
});

// POST route to add a new spell
app.post("/spells", (req, res) => {
  const { name, damage, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name field is required" });
  }

  const spells = getSpells();
  const newSpell = {
    id: spells.length ? spells[spells.length - 1].id + 1 : 1, // Auto-incrementing the ID
    name,
    damage,
    description,
  };

  spells.push(newSpell);
  saveSpells(spells);

  res.status(201).json(newSpell);
});

// PUT route to update a spell by ID
app.put("/spells/:id", (req, res) => {
  const { id } = req.params;
  const { name, damage, description } = req.body;

  let spells = getSpells();
  const spellIndex = spells.findIndex((spell) => spell.id === parseInt(id));

  if (spellIndex === -1) {
    return res.status(404).json({ error: "Spell not found" });
  }

  spells[spellIndex] = { id: parseInt(id), name, damage, description };

  saveSpells(spells);

  res.json(spells[spellIndex]);
});

// DELETE route to delete a spell by ID
app.delete("/spells/:id", (req, res) => {
  const { id } = req.params;
  const spells = getSpells();
  const filteredSpells = spells.filter((spell) => spell.id !== parseInt(id));

  if (spells.length === filteredSpells.length) {
    return res.status(404).json({ error: "Spell not found" });
  }

  saveSpells(filteredSpells);
  res.json({ message: "Spell deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
