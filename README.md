# 20232BSET03P2
Inteli - Engenharia de Software | Avaliação 2023-2B P2

## Vulnarabilidades encontradas e correções 

- Inicialmente o id estava como int e deveria ser adicionado um número inteiro, foi feita a correção para que o id fosse adicionado ao banco de forma automatica com 'INTEGER PRIMARY KEY AUTOINCREMENT'
- 
- O endpoint post '/dogs' estava sem a lógica do post, então foi adicionado a lógica da mesma forma como estava feita com o endpoint post '/cats'
- 
- No post "/vote/:animalType/:id" foi acrescentado a lógica de que o voto não seria computado antes sa verificação se o id daquele animal que seria votado existia no banco de dados, e se não existisse o voto não seria computado, assim como a verificação se o tipo de animal que estava sendo votado era uma das opções, cats ou dogs

- Também era faltante a lógica do endpoint get para o /dogs, que foi adicionada com o mesmo padrão do get /cats 

