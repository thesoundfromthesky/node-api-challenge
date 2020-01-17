const express = require("express");
const Projects = require("../data/helpers/projectModel");
const router = express.Router();

// **All these helper methods return a promise. Remember to use .then().catch() or async/await.**

// - `get()`: resolves to an array of all the resources contained in the database. If you pass an `id` to this method it will return the resource with that id if one is found.
// - `insert()`: calling insert passing it a resource object will add it to the database and return the newly created resource.
// - `update()`: accepts two arguments, the first is the `id` of the resource to update, and the second is an object with the `changes` to apply. It returns the updated resource. If a resource with the provided `id` is not found, the method returns `null`.
// - `remove()`: the remove method accepts an `id` as it's first parameter and, upon successfully deleting the resource from the database, returns the number of records deleted.

// The `projectModel.js` helper includes an extra method called `getProjectActions()` that takes a _project id_ as it's only argument and returns a list of all the _actions_ for the _project_.

// We have provided test data for all the resources.

router.get("/", async (req, res) => {
  try {
    const projects = await Projects.get();
    res.status(200).json(projects);
  } catch {
    res.status(500).json({ error: "Internal Error" });
  }
});

router.get("/:id", validateProjectId, async (req, res) => {
  res.status(200).json(req.project);
});

router.post("/", validateProject, async (req, res) => {
  try {
    const project = await Projects.insert(req.body);
    res.status(201).json(project);
  } catch {
    res.status(400).json({ error: "only allowed name and description " });
  }
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
module.exports = router;
