import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';

import './styles.css';

import api from '../../services/api';
import Modal from '../../components/Modal';
import Arrow from '../../components/Arrow';

import visible from '../../assets/visible.svg';
import notVisible from '../../assets/not-visible.svg';

export default function Administrator() {
	document.title = 'Administrador';
	const [ employees, setEmployees ] = useState([]);

	//devido a imutabilidade do state é preciso duas variaveis
	const [ name_employee, setName ] = useState('');
	const [ password_employee, setPassword ] = useState('');
	const [ isModalVisible, setIsModalVisible ] = useState(false);
	const [ isModalVisibleB, setIsModalVisibleB ] = useState(false);
	const [ isModalVisibleC, setIsModalVisibleC ] = useState(false);
	const [ isModalVisibleD, setIsModalVisibleD ] = useState(false);

	const history = useHistory();

	useEffect(() => {
		api.get('/employees').then((response) => {
			setEmployees(response.data);
		});
	}, []);

	function nullState() {
		setName('');
		setPassword('');
	}

	// Resolvemos add as mensagens pelo Front-End ao invés de de buscarmos do Back-End
	function appearModal() {
		setIsModalVisible(!isModalVisible);
	}

	function appearModalB() {
		setIsModalVisibleB(!isModalVisibleB);
	}

	function appearModalC() {
		setIsModalVisibleC(!isModalVisibleC);
	}

	function appearModalD() {
		setIsModalVisibleD(!isModalVisibleD);
	}

	const myCallBack = (dataFromChild) => {
		setIsModalVisible(dataFromChild);
		setIsModalVisibleB(dataFromChild);
		setIsModalVisibleC(dataFromChild);
		setIsModalVisibleD(dataFromChild);
	};

	function exitModal() {
		window.location.reload();
	}

	async function handleRegister(e) {
		e.preventDefault();

		//reuno os dados necessários, para depois manda-lo pelo api
		const data = {
			name_employee,
			password_employee
		};

		try {
			await api.post('/employee', data);
			appearModal();
			nullState();
			//levo o usuário para a tela de login
			history.push('/admin');
		} catch (err) {
			if (err.response) {
				/*console.log(err.response.data);*/
				appearModalD();
			}
			appearModalB();
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

	// Função de deletar employee
	async function handleDelete(id) {
		try {
			await api.delete(`/employee`, {
				headers: {
					Authorization: id
				}
			});

			// Deletar em tempo real
			setEmployees(employees.filter((employee) => employee.id_employee !== id));
		} catch (err) {
			appearModalC();
		}
	}

	function handleStorageAdmin() {
		localStorage.clear(); // Limpando
		history.push('/');
	}

	return (
		<body className="bodyNotLogged">
			<div className="admin-container">
				<header>
					<div className="canto">
						<button className="back-link-top" onClick={handleStorageAdmin}>
							<Arrow />
						</button>
					</div>
				</header>
				<div className="App">
					{isModalVisible ? ( // condição ? Valor se for "true" : se for "false"
						<Modal
							modalVisible={isModalVisible} // Passando uma prop que levará a informação sobre seu estado para o componente filho (logon)
							callbackFromParent={myCallBack} // props que veio com o estado definido do Modal
							tittle="Cadastrado com sucesso!"
							content="Seu cadastro foi bem sucedido."
							exit={exitModal}
						/>
					) : null}
					{isModalVisibleB ? ( // condição ? Valor se for "true" : se for "false"
						<Modal
							modalVisible={isModalVisibleB} // Passando uma prop que levará a informação sobre seu estado para o componente filho (logon)
							callbackFromParent={myCallBack} // props que veio com o estado definido do Modal
							tittle="Falha ao cadastrar!"
							content="Não foi possível cadastrar, tente novamente."
							exit={exitModal}
						/>
					) : null}
					{isModalVisibleC ? ( // condição ? Valor se for "true" : se for "false"
						<Modal
							modalVisible={isModalVisibleC} // Passando uma prop que levará a informação sobre seu estado para o componente filho (logon)
							callbackFromParent={myCallBack} // props que veio com o estado definido do Modal
							tittle="Falha ao deletar!"
							content="Não foi possível deletar, tente novamente."
							exit={exitModal}
						/>
					) : null}
					{isModalVisibleD ? ( // condição ? Valor se for "true" : se for "false"
						<Modal
							modalVisible={isModalVisibleD} // Passando uma prop que levará a informação sobre seu estado para o componente filho (logon)
							callbackFromParent={myCallBack} // props que veio com o estado definido do Modal
							tittle="Falha ao cadastrar!"
							content="Já existe um usuário com esse nome."
							exit={exitModal}
						/>
					) : null}
				</div>
				<section className="form">
					<form onSubmit={handleRegister}>
						<p>Nome</p>
						<input
							type="text"
							id="inputname"
							required="required"
							value={name_employee}
							onChange={(e) => setName(e.target.value)}
						/>
						<div className="eye">
							<p>Senha</p>
							<input
								type="password"
								id="inputPassword"
								required="required"
								value={password_employee}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<img id="eye" alt="eye" src={visible} onClick={ShowPassword} />
						</div>
						<button className="button" type="submit">
							Adicionar
						</button>
					</form>
				</section>

				<div className="tabelaContainer">
					<table id="table" className="tableAdministrator">
						<tr>
							<th>NOME</th>
							<th>OPÇÕES</th>
						</tr>
						{employees.map((employees) => (
							<tr key={employees.id_employee}>
								<td>{employees.name_employee}</td>
								<td>
									<div className="profileIcons">
										<FiTrash2
											className="icons"
											size={17}
											color={'#fc2121'}
											onClick={() => handleDelete(employees.id_employee)}
										/>
									</div>
								</td>
							</tr>
						))}
					</table>
				</div>
			</div>
		</body>
	);
}
