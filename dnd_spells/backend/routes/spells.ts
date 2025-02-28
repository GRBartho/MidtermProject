import { Router } from "express";

export const spellsRouter = Router();

spellsRouter.get("/", (req, res) => {
  res.json({ spells: ["Fireball", "Magic Missile", "Healing Word"] });
});
