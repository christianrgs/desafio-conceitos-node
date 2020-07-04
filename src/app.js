const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { 
    body: {
      title,
      url,
      techs
    }
  } = request;

  const id = uuid();

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { 
    body,
    params: { id },
  } = request;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  const changedRepository = {
    ...body,
    id,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = changedRepository;

  return response.json(changedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const {
    params: { id },
  } = request;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {
    params: { id },
  } = request;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  const changedRepository = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1,
  };

  repositories[repositoryIndex] = changedRepository;

  return response.json(changedRepository);
});

module.exports = app;
