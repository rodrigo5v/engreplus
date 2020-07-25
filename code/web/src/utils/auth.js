import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isAuthenticated = () => {
	// Pege esses itens, se eles chegarem o token é verdadeiro
	if (localStorage.getItem('token') && localStorage.getItem('isEmployee')) {
		return true; // Se gerou o token é verdadeiro
	} else {
		// Caso não limpa o localStorage e return false para o usuário não acessar
		localStorage.clear();
		return false;
	}
};

const isAdmin = () => {
	// Pege esses itens, se eles chegarem o token é verdadeiro
	if (localStorage.getItem('tokenFake') && localStorage.getItem('isAdmin')) {
		return true;
	}
	// Caso não limpa o localStorage e return false para o usuário não acessar
	localStorage.clear();
	return false;
};

// Lembrando que o sistema está configurado para gerar o token apenas quando o usuário logar

const PrivateRoutes = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			isAuthenticated() ? (
				<Component {...props} />
			) : (
				<Redirect to={{ pathname: '/', state: { from: props.location } }} />
			)}
	/>
);

const PrivateAdmin = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			isAdmin() ? (
				<Component {...props} />
			) : (
				<Redirect to={{ pathname: '/', state: { from: props.location } }} />
			)}
	/>
);

export { PrivateRoutes, PrivateAdmin };
