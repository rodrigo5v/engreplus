const jsonwebtoken = require('jsonwebtoken');
const secret = 'secret-value';

module.exports = function verifyJWT(request, response, next) {
	let token = request.headers.authorization; // Pegando o token

	if (!token) {
		return response.status(401).send({
			auth: false,
			message: 'Token não informado'
		});
	}

	jsonwebtoken.verify(token, secret, (err, decoded) => {
		if (err) {
			return response.status(500).send({
				auth: false,
				message: 'Token inválido'
			});
		}

		// Houve uma descriptografia que só vem o id dele e o valor é atribuido ao request.id_employee
		request.id_employee = decoded.id_employee;

		//console.log("User Id: " + decoded.id_employee);
		next();
	});
};
