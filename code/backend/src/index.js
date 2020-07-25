const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const routes = require('./routes');

const app = express();

// O helmet serve para ocultar o header, ou seja, ele oculta se estamos usando o express(isso evita informações para invasores)
app.use(helmet());
// O compression comprimi nossa informações como um zip, com isso fica muito mais perfomatico e veloz a api.
app.use(compression());
app.use(cors());
app.use(express.json()); // Falando para antes de todas as requisições, para converter o JSON e transformar em um objeto JS
app.use(routes);

app.listen(3333); // Mandando a aplicação escutar e abrir no navegador com a rota 3333

/* MÉTODOS HTTP:
  * GET: Buscar/listar uma informação do back-end
  * POST: Cria uma informação no back-end
  * PUT: Alterar uma informação no back-end
  * DELETE: Deletar uma informação no back-end

TIPOS DE PARÂMETROS:
  * Query Params: Parâmetros nomeados enviados na rota após "?" (Filtros, paginação)
  * Route Params: Parâmetros utilizados para identificar recursos(Tabela no db)
  * Request Body: Corpo da requisição, utilizado para criar ou alterar recursos

SQL:
  * Driver: SELECT * FROM users
  * Query Builder: table('users).select('*').where()

props.children: É uma propriedade que renderiza todo o conteúdo

  */
