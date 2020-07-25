// Método "up" é sempre responsável pela criação da tabela
exports.up = function(knex) {
	return knex.schema.createTable('works', function(table) {
		table.increments('id_work');
		table.string('client_work').notNullable();
		table.string('description_work').notNullable();
		table.decimal('value_work').notNullable();
		table.string('date_work').notNullable();
		table.decimal('dayPayment_work').notNullable();

		table.integer('employee_id').unsigned().notNullable(); // Fazendo relação

		table.foreign('employee_id').references('id_employee').inTable('employees'); // Estrangeira
	});
};

// Método "down" caso deu algum problema, posso desfazer o que eu fiz pelo "down"
exports.down = function(knex) {
	knex.schema.dropTable('works');
};
