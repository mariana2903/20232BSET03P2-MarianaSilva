const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE cats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, votes INT)"
  );
  db.run(
    "CREATE TABLE dogs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, votes INT)"
  );
});

app.post("/cats", (req, res) => {
  const name = req.body.name;

  if (!name) {
    res.status(400).send("O nome do animal (campo name) é obrigatório");
    return;
  }

  db.run(
    `INSERT INTO cats (name, votes) VALUES ('${name}', 0)`,
    function (err) {
      if (err) {
        res.status(500).send("Erro ao inserir no banco de dados");
      } else {
        res.status(201).json({ id: this.lastID, name, votes: 0 });
      }
    }
  );
});

app.post("/dogs", (req, res) => {
  const name = req.body.name;

  if (!name) {
    res.status(400).send("O nome do animal (campo name) é obrigatório");
    return;
  }

  db.run(
    `INSERT INTO dogs (name, votes) VALUES ('${name}', 0)`,
    function (err) {
      if (err) {
        res.status(500).send("Erro ao inserir no banco de dados");
      } else {
        res.status(201).json({ id: this.lastID, name, votes: 0 });
      }
    }
  );
});

app.post("/vote/:animalType/:id", (req, res) => {
  const animalType = req.params.animalType;
  const id = req.params.id;

  if (animalType !== "cats" && animalType !== "dogs") {
    return res.status(400).send("Tipo de animal inválido.");
  }

  // Lógica que verifica se id existe antes de adicionar o voto, e se existir o voto é computado
  const query = `SELECT * FROM ${animalType} WHERE id = ?`;
  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else if (row) {
      const updateQuery = `UPDATE ${animalType} SET votes = votes + 1 WHERE id = ?`;
      db.run(updateQuery, [id], function (updateErr) {
        if (updateErr) {
          res.status(500).send("Erro ao atualizar o banco de dados");
        } else {
          res.status(200).send("Voto computado com sucesso.");
        }
      });
    } else {
      res.status(404).send("Id fornecido não existe");
    }
  });
});

app.get("/cats", (req, res) => {
  db.all("SELECT * FROM cats", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});

app.get("/dogs", (req, res) => {
  db.all("SELECT * FROM dogs", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ocorreu um erro!");
});

app.listen(port, () => {
  console.log(`Cats and Dogs Vote app listening at http://localhost:${port}`);
});
