const connection = require('../database/connection'); // Agora consigo utilizar as configurações do Banco de Dados

module.exports = {
	// Register work
	async create(request, response) {
		try {
			const { client_work, description_work, value_work, date_work, dayPayment_work } = request.body; // Pegando dados da requisição
			//const employee_id = request.headers.authorization; // "request.headers" guarda informações do contexto da nossa requisição, dados do usuário, dados da localização etc.. AUTENTICAÇÃO
			const employee_id = request.id_employee;

			console.log(employee_id);

			const [ id_work ] = await connection('works').insert({
				client_work,
				description_work,
				value_work,
				date_work,
				dayPayment_work,
				employee_id
			});

			return response.json({ id_work });
		} catch (err) {
			console.log('Error in register work: ', err);
		}
	},

	// Listing all work
	async index(request, response) {
		try {
			// Indo de 5 em 5 works por página
			const { page = 1 } = request.query; // "query" são os Query Params que nós podemos enviar usando "?"

			// Contando quantos works foram criados
			const [ count ] = await connection('works').count(); // "[count]" --> para pegar a primeira posição do array

			response.header('X-Total-Count', count['count(*)']);

			const works = await connection('works')
				.join('employees', 'employees.id_employee', '=', 'works.employee_id') // Relacionando com a tabela employees, trazendo todos os dados dos funcionários que cadastraram os trabalhos
				.limit(5) // Esquema de páginação, limite para listar works é 5
				.offset((page - 1) * 5) // "offset" = deslocamento, vai começar do 0 e pegar os próximos 5 registros
				.select([ 'works.*', 'employees.name_employee', 'employees.password_employee' ]);

			return response.json(works);
		} catch (err) {
			console.log('Error in listing all works: ', err);
		}
	},

	// Listing work specific
	async indexSpecific(request, response) {
		try {
			const { id_work } = request.params;
			//const employee_id = request.headers.authorization;
			const employee_id = request.id_employee;

			const works = await connection('works')
				.where('id_work', id_work)
				.select('client_work', 'description_work', 'value_work', 'date_work', 'dayPayment_work')
				.first();

			return response.json(works);
		} catch (err) {
			console.log('Error in listing specific work: ', err);
		}
	},

	// Delete work
	async delete(request, response) {
		try {
			const { id_work } = request.params;
			//const employee_id = request.headers.authorization;
			const employee_id = request.id_employee;

			const works = await connection('works')
				.where('id_work', id_work) // Buscar um incidente onde o ID for o do caso criado
				.select('employee_id')
				.first(); // Retorna apenas um resultado

			if (works.employee_id != employee_id) {
				return response.status(401).json({ err: 'Operation not permited' });
			}

			await connection('works').where('id_work', id_work).delete();

			return response.send('Operation executed with sucess!').status(204);
		} catch (err) {
			console.log('Error in delete work: ', err);
		}
	},

	//Upadte work
	async changes(request, response) {
		try {
			const { id_work } = request.params;
			//const employee_id = request.headers.authorization;
			const employee_id = request.id_employee;

			//dados que podem ser alterados no banco
			const { client_work } = request.body;
			const { description_work } = request.body;
			const { value_work } = request.body;
			const { date_work } = request.body;
			const { dayPayment_work } = request.body;

			const work = await connection('works')
				.where('id_work', id_work) // Buscar um incidente onde o ID for o do caso criado
				.select('employee_id')
				.first(); // Retorna apenas um resultado

			if (work.employee_id != employee_id) {
				return response.status(401).json({ err: 'Operation not permited' });
			}

			//mudança no banco
			await connection('works').where('id_work', id_work).update({
				client_work: `${client_work}`,
				description_work: `${description_work}`,
				value_work: `${value_work}`,
				date_work: `${date_work}`,
				dayPayment_work: `${dayPayment_work}`
			});

			return response.json(work);
		} catch (err) {
			console.log('Error in update employee: ', err);
		}
	}
};
