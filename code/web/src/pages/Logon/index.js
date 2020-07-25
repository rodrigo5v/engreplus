import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/LOGO1.png';
import visible from '../../assets/visible.svg';
import notVisible from '../../assets/not-visible.svg';

import api from '../../services/api';
import Modal from '../../components/Modal';

export default function Logon(props) {
	document.title = 'EngrePlus';
	//devido a imutabilidade do state é preciso duas variaveis
	const [ name, setName ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ isModalVisible, setIsModalVisible ] = useState(false); // O estado está como "falso"

	const history = useHistory();

	// Função que faz aparecer o modal
	function appearModal() {
		setIsModalVisible(!isModalVisible); // Aqui modificamos ele para "true", ou seja, abre o modal
	}

	/* Essa função recebeos dados da props callbackFromParent passados 
	   do componente filho (Modal) para este atual componente */
	const myCallBack = (dataFromChild) => {
		/* Como ao clicar pela primeira vez no botão de "entrar"
		   a variável isModalVisible fica 'true', recebo os dados do componente filho (no caso 'false')
		   e modifico o isModalVisible para 'false' assim fazendo a modal desaparecer por completo */
		setIsModalVisible(dataFromChild);
	};

	function exitModal() {
		window.location.reload();
	}

	async function acessAdmin() {
		const nameCaptured = name;
		const passwordCaptured = password;

		const nameValue = nameCaptured.valueOf();
		const passwordValue = passwordCaptured.valueOf();

		// Caso entrar no Administrador seta dois itens que são o 'isAdmin' e 'tokenFake'
		if (nameValue === 'admin' && passwordValue === 'admin') {
			history.push('/admin');
			localStorage.setItem('isAdmin', true);
			localStorage.setItem('tokenFake', true);
		}
	}

	async function handleLogon(e) {
		//evito que a página fique recarregando desnecessáriamente
		e.preventDefault();
		acessAdmin();
		//reuno os dados necessários, para depois manda-lo pelo api
		try {
			const response = await api.post('/sessions', { name, password });

			// Caso logar, seta os itens no qual um deles é o token
			localStorage.setItem('name_employee', name); //salvo o nome para usar na tela de profile
			localStorage.setItem('isEmployee', true);
			//localStorage.setItem('employee_id', response.data.employee.id_employee); // Na rota login pedimos para retorna o id do employee, e aqui estamos pegando ele
			localStorage.setItem('token', response.data.token); // Enviando o nosso token lá do backend

			//levo o usuário até a página de profile
			history.push('/profile');
		} catch (err) {
			appearModal();
		}
	}

	function ShowPassword() {
		const inputElement = document.querySelector('#inputPassword');
		const type = inputElement.getAttribute('type');
		const imgElement = document.querySelector('#eye');

		if (type === 'password') {
			//revelo a senha
			inputElement.setAttribute('type', 'text');
			imgElement.src = notVisible;
		} else {
			//escondo a senha
			inputElement.setAttribute('type', 'password');
			imgElement.src = visible;
		}
	}

	return (
		<body className="bodyNotLogged">
			<div className="logon-container">
				<div className="divLogo">
					<img className="imgLogo" src={logo} alt="EngrePlus" />
				</div>
				<section className="form">
					<div className="App">
						{isModalVisible ? ( // condição ? Valor se for "true" : se for "false"
							<Modal
								modalVisible={isModalVisible} // Passando uma prop que levará a informação sobre seu estado para o componente filho (logon)
								callbackFromParent={myCallBack} // props que veio com o estado definido do Modal
								tittle="Falha ao logar!"
								content="Verifique os dados e tente novamente."
								exit={exitModal}
							/>
						) : null}
					</div>

					<form onSubmit={handleLogon} name="formLogon">
						<p className="classP">Nome</p>
						<input
							name="formName"
							id="inputName"
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>

						<p>Senha</p>
						<div className="eye">
							<input
								name="forPassword"
								type="password"
								id="inputPassword"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<img id="eye" alt="eye" src={visible} onClick={ShowPassword} />
						</div>
						<button className="button" type="submit">
							ACESSAR
						</button>
					</form>
				</section>
			</div>
		</body>
	);
}
