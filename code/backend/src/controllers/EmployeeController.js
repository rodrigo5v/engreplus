const connection = require('../database/connection'); // Agora consigo utilizar as configurações do Banco de Dados
const bcrypt = require('bcrypt');

/* TIPOS DE PARÂMETROS:
  * Query Params: Parâmetros nomeados enviados na rota após "?" (Filtros, paginação)
  * Route Params: Parâmetros utilizados para identificar recursos(Tabela no db)
  * Request Body: Corpo da requisição, utilizado para criar ou alterar recursos */

module.exports = {
	// Register employee
	async create(request, response) {
		const { name_employee, password_employee } = request.body; // Pegando dados da requisição

		try {
			// Consultando da tabela e vendo se há um nome igual ao dado digitado pelo User que vem do request.body
			const consult_name = await connection('employees').where('name_employee', name_employee);

			// O valor fica armazenado na array, se não houver nenhum nome igual a array é vazia, se houver nome igual, a array é maior que 0
			if (consult_name.length !== 0) {
				return response.status(400).send('User already existing');
			}

			// Criptografando senha
			const hashPassword = await bcrypt.hash(password_employee, 10);

			// Fazendo a conexão e selecionando o id
			const [ id_employee ] = await connection('employees').insert({
				name_employee,
				password_employee: hashPassword
			});

			return response.json({ id_employee });
		} catch (err) {
			console.log('Error in register employee: ', err);
		}
	},

	// List employee
	async indexSpecific(request, response) {
		try {
			const id_employee = request.headers.authorization;

			const employees = await connection('employees')
				.where('id_employee', id_employee)
				.select('name_employee', 'password_employee')
				.first();

			return response.json(employees);
		} catch (err) {
			console.log('Error in listing employee: ', err);
		}
	},
	async list(request, response) {
		try {
			const employee = await connection('employees').select('*');
			return response.json(employee);
		} catch (err) {
			console.log('Error in listing employee: ', err);
		}
	},

	// Delete employee
	async delete(request, response) {
		try {
			const id_employee = request.headers.authorization; //pelo id no header da requisição procuro o empregado

			//const employee_id = request.id_employee; // Ao invés to ID do employee, passo o token gerado

			// Fazendo a conexão e selecionando o id
			const employee = await connection('employees')
				.where('id_employee', id_employee)
				.select('id_employee')
				.first();

			if (employee.id_employee != id_employee) {
				return response.status(401).json({ error: 'Operation not permited' });
			}

			//caso o id esteja certo, o empregado é deletado
			await connection('employees').where('id_employee', id_employee).delete();

			return response.status(204).json({ valor: 'Operation executed with sucess!' });
		} catch (err) {
			console.log('Error in delete employee: ', err);
		}
	},

	// Update employee
	async change(request, response) {
		try {
			//const id = request.headers.authorization;
			const id = request.id_employee;
			const { name } = request.body;
			const { password } = request.body;

			//procuro o employee no db
			const employee = await connection('employees').where('id_employee', id).first();

			// Criptografando a senha que foi modificada
			const hashPassword = await bcrypt.hash(password, 10);

			if (!employee) {
				return response.status(400).json({ error: 'Not possible change the data, try later.' });
			}

			//faço as alterações
			await connection('employees').where('id_employee', id).update({
				name_employee: `${name}`,
				password_employee: `${hashPassword}`
			});

			//procuro novamente o employee no db, só que com as alterações feitas
			const employee_change = await connection('employees').where('id_employee', id).first();

			return response.json(employee_change);
		} catch (err) {
			console.log('Error in update employee: ', err);
		}
	}
};
