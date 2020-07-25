const connection = require('../database/connection'); // Agora consigo utilizar as configurações do Banco de Dados
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = 'secret-value'; // Chave de segurança

module.exports = {
	// Login employee
	async session(request, response) {
		try {
			// Pegando resposta do corpo
			const { name } = request.body;
			const { password } = request.body;

			const employee = await connection('employees').where('name_employee', name).first();

			if (!employee) {
				return response.status(400).json({ error: 'Check the data entered.' }); // Verificando os dados inseridos
			}

			// No Bcrypt existe uma função que "por baixo dos panos" descriptografa a senha, com isso nós conseguimos logar com a senha original do user.
			const comparePassword = await bcrypt.compare(password, employee.password_employee); // Realizando a comparação, se a senha digitada é igual a senha do banco

			if (!comparePassword) {
				return response.status(400).send('Password are wrong');
			}

			const { id_employee } = employee; // O id que o user logar eu atribuo para a const id_employee (que está desestruturada)

			let token = jsonwebtoken.sign({ id_employee }, secret, {
				expiresIn: 300 // 5min para token expirar
			});

			response.json({ employee, token, auth: true }); // O JSON recebe só um objeto, por isso fiz a desestruturação
		} catch (err) {
			console.log('Employee login error: ', err);
		}
	},

	// Método que vai retornar os works específicos de um employee
	async index(request, response) {
		try {
			//const employee_id = request.headers.authorization; // Especificando o trabalhador
			const employee_id = request.id_employee;

			const works = await connection('works') // Fazendo a conexão com a tabela no banco
				.where('employee_id', employee_id) // Pegando o valor da chave estrangeira
				.select('*');

			return response.json(works);
		} catch (err) {
			console.log('Error in listing works ', err);
		}
	}
};
