const express = require("express");
const Actions = require("../data/helpers/actionModel");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch {
    res.status(500).json({ error: "Internal Error" });
  }
});

router.get("/:id", validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.put("/:id", validateAction, validateActionId, async (req, res) => {
  try {
    const action = await Actions.update(req.action.id, req.body);
    res.status(200).json(action);
  } catch {
    res.status(400).json({ error: "only allowed notes and description " });
  }
});

router.delete("/:id", validateActionId, async (req, res) => {
  try {
    const action = await Actions.remove(req.action.id);
    res.sendStatus(204);
  } catch {
    res.status(500).json({ error: "Internal Error" });
  }
});

async function validateActionId(req, res, next) {
  try {
    const id = req.params.id;
    const action = await Actions.get(id);
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(403).json({ error: "Action not found" });
    }
  } catch {
    res.status(500).json({ error: "Internal Error" });
  }
}

function validateAction(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing description and notes" });
  } else if (!req.body.description || !req.body.notes) {
    res.status(400).json({ error: "Missing description or notes" });
  } else {
    next();
  }
}

module.exports = { router, validateAction };
