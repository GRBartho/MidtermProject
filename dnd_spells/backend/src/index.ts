import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs-extra";
import { Spell } from "./types";

const app = express();
const PORT = process.env.PORT || 8080;
const SPELLS_FILE = "spells.json";

app.use(cors());
app.use(express.json());

const getSpells = (): Spell[] => {
  return fs.readJsonSync(SPELLS_FILE, { throws: false }) || [];
};

const saveSpells = (spells: Spell[]): void => {
  fs.writeJsonSync(SPELLS_FILE, spells, { spaces: 2 });
};

app.post("/spells", ((req: Request, res: Response) => {
  const { name, damage, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name field is required" });
  }

  const spells: Spell[] = getSpells();
  const newSpell: Spell = {
    id: spells.length ? spells[spells.length - 1].id + 1 : 1,
    name,
    damage,
    description,
  };

  spells.push(newSpell);
  saveSpells(spells);

  res.status(201).json(newSpell);
}) as express.RequestHandler);

app.delete("/spells/:id", ((req: Request, res: Response) => {
  const { id } = req.params;
  const spells: Spell[] = getSpells();
  const filteredSpells = spells.filter((spell) => spell.id !== parseInt(id));

  if (spells.length === filteredSpells.length) {
    return res.status(404).json({ error: "Spell not found" });
  }

  saveSpells(filteredSpells);
  res.json({ message: "Spell deleted successfully" });
}) as express.RequestHandler);

app.put("/spells/:id", ((req: Request, res: Response) => {
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
}) as express.RequestHandler);

app.get("/spells", (req: Request, res: Response) => {
  const spells: Spell[] = getSpells();
  res.json(spells);
});

app.get("/spells/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const spells: Spell[] = getSpells();
  const filteredSpells = spells.filter((spell) => spell.id === parseInt(id));
  res.json(filteredSpells[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//npm run dev to start
