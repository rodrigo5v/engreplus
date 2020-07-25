import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/LOGO1.png';

import './styles.css';

export default function NotFound() {
	document.title = 'Ops! Não encontramos';
	return (
		<div className="wrapper-404">
			<header className="headerNotFound">
				<nav />
				<div className="broken">
					<p className="upper">Oops! 404 - Not found.</p>
					<img src={logo} alt="logo broken" />
					<p className="lower">Não conseguimos encontrar a página que você está solicitando.</p>
					<Link to="/" className="btnHome">
						Voltar a página inicial
					</Link>
				</div>
			</header>
		</div>
	);
}
