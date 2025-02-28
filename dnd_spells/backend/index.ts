import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs-extra"; // ✅ Use ES Module import
import { Spell } from "./types"; // ✅ Ensure `Spell` type is correctly defined

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
  const { name, damage } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name field is required" });
  }

  const spells: Spell[] = getSpells();
  const newSpell: Spell = {
    id: spells.length ? spells[spells.length - 1].id + 1 : 1,
    name,
    damage,
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

app.get("/spells", (req: Request, res: Response) => {
  const spells: Spell[] = getSpells();
  res.json(spells);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
