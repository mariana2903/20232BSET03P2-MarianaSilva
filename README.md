# 20232BSET03P2
Inteli - Engenharia de Software | Avaliação 2023-2B P2

## Vulnerabilidades e problemas encontradas com suas respectivas correções 

### Id como primary key
- Inicialmente o id estava como int e deveria ser adicionado um número inteiro, foi feita a correção para que o id fosse adicionado ao banco de forma automatica com 'INTEGER PRIMARY KEY AUTOINCREMENT'
  Anteriormente:
  
```sql
CREATE TABLE cats (id INT, name TEXT, votes INT)
```
  Alterado para:
  
```sql
CREATE TABLE cats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, votes INT)
```

### Nome do animal 
- O nome do animal não estava sendo obrigátorio na hora da realização do post /cats ou /dogs e a lógica foi corrigida com o código a seguir

```sql
 if (!name) {
    res.status(400).send("O nome do animal (campo name) é obrigatório");
    return;
  }
```
  
### Endpoint post '/dogs'
- Estava sem a lógica do post, então foi adicionado a lógica da mesma forma como estava feita com o endpoint post '/cats'

```sql
app.post("/dogs", (req, res) => {
  const name = req.body.name;
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
```
  
### Post "/vote/:animalType/:id"
- Foi acrescentado a lógica de que o voto não seria computado antes sa verificação se o id daquele animal que seria votado existia no banco de dados, e se não existisse o voto não seria computado, assim como a verificação se o tipo de animal que estava sendo votado era uma das opções, cats ou dogs

```sql
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
```

### Lógica endpoint get /dogs
- Também era faltante a lógica do endpoint get para o /dogs, que foi adicionada com o mesmo padrão do get /cats
  
```sql
app.get("/dogs", (req, res) => {
  db.all("SELECT * FROM dogs", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});
```
