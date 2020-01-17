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

router.put("/:id", validateProject, validateProjectId, async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Projects.update(id, req.body);
    res.status(200).json(project);
  } catch {
    res.status(400).json({ error: "only allowed name and description " });
  }
});

router.delete("/:id", validateProjectId, async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Projects.remove(id);
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

async function validateProjectId(req, res, next) {
  try {
    const id = req.params.id;
    const project = await Projects.get(id);
    if (project) {
      req.project = project;
      next();
    } else {
      res.status(403).json({ error: "Project not found" });
    }
  } catch {
    res.status(500).json({ error: "Internal Error" });
  }
}

function validateProject(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing name and description" });
  } else if (!req.body.name || !req.body.description) {
    res.status(400).json({ error: "Missing name or description" });
  } else {
    next();
  }
}

module.exports = { router, validateAction };
