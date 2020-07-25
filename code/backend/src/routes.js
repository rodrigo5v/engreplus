const express = require('express');

const EmployeeController = require('./controllers/EmployeeController');
const WorkController = require('./controllers/WorkController');
const ProfileController = require('./controllers/ProfileController');
const verifyJWT = require('./utils/verifyJWT');

const routes = express.Router(); // Desaclopando o modo de Rotas no express em uma nova variável

/*************************** EMPLOYEE  ***************************/

// Register employee
routes.post('/employee', EmployeeController.create);

// Listar employee
routes.get('/employee', EmployeeController.indexSpecific);
routes.get('/employees', EmployeeController.list);

// Delete employee
routes.delete('/employee', EmployeeController.delete);

// Update employee
routes.put('/employee', verifyJWT, EmployeeController.change);

/*************************** WORKS  ***************************/

// Register work
routes.post('/works', verifyJWT, WorkController.create);

// List work
routes.get('/works', WorkController.index);

// List specific work
routes.get('/works/:id_work', WorkController.indexSpecific);

// Delete work
routes.delete('/works/:id_work', verifyJWT, WorkController.delete);

// Update work
routes.put('/works/change/:id_work', verifyJWT, WorkController.changes);

/*************************** PROFILE  ***************************/

// Listing works specific
routes.get('/profile', verifyJWT, ProfileController.index);

// Login employee
routes.post('/sessions', ProfileController.session);

module.exports = routes; // Exportar para outros arquivos
