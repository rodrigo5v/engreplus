import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import Modal from '../../components/Modal';
import Arrow from '../../components/Arrow';

import './styles.css';

import visible from '../../assets/visible.svg';
import notVisible from '../../assets/not-visible.svg';

export default function ChangeProfile() {
	document.title = 'Editar Perfil';
	const [ name, setName ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ isModalVisible, setIsModalVisible ] = useState(false);
	const [ isModalVisibleB, setIsModalVisibleB ] = useState(false);

	//const id = localStorage.getItem('employee_id');
	const token = localStorage.getItem('token');
	const name_employee = localStorage.getItem('name_employee');

	const history = useHistory();

	//hook no backend para pegar os dados que podem ser alterados
	useEffect(
		() => {
			setName(name_employee);
		},
		[ name_employee ]
	);

	function appearModal() {
		setIsModalVisible(!isModalVisible);
	}

	function appearModalB() {
		setIsModalVisibleB(!isModalVisibleB);
	}

	const myCallBack = (dataFromChild) => {
		setIsModalVisible(dataFromChild);
		setIsModalVisibleB(dataFromChild);
	};

	function exitModal() {
		history.push('/profile');
	}

	function ShowPassword() {
		var inputElement = document.querySelector('#inputpassword');
		var type = inputElement.getAttribute('type');
		var imgElement = document.querySelector('#eye');

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

	async function handleChangeProfile(e) {
		e.preventDefault();
		const profile = {
			name,
			password
		};
		try {
			await api.put('/employee', profile, {
				headers: {
					Authorization: token
				}
			});
			localStorage.setItem('name_employee', name);

			appearModal();
			//history.push('/profile');
		} catch (err) {
			appearModalB();
		}
	}
	return (
		<body className="bodyPages">
			<div className="view-container">
				<header>
					<div className="canto">
						<Link to="/profile" className="back-link-top">
							<Arrow />
						</Link>
					</div>
					<h1>ENGREPLUS</h1>
					<p>Edição de Perfil</p>
				</header>
				<div className="App">
					{isModalVisible ? (
						<Modal
							modalVisible={isModalVisible} // Passando uma prop que levará a informação sobre seu estado para o componente filho (logon)
							callbackFromParent={myCallBack} // props que veio com o estado definido do Modal
							tittle="Editado com sucesso!"
							content="Alterações realizadas com sucesso."
							exit={exitModal}
						/>
					) : null}
					{isModalVisibleB ? (
						<Modal
							modalVisible={isModalVisibleB} // Passando uma prop que levará a informação sobre seu estado para o componente filho (logon)
							callbackFromParent={myCallBack} // props que veio com o estado definido do Modal
							tittle="Falha ao editar!"
							content="Não foi possível editar, tente novamente."
							exit={exitModal}
						/>
					) : null}
				</div>
				<section className="form">
					<form onSubmit={handleChangeProfile}>
						<p>Nome</p>
						<input
							type="text"
							id="inputname"
							required="required"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<div className="eye">
							<p>Nova senha</p>
							<input
								type="password"
								id="inputpassword"
								required="required"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<img id="eye" alt="eye" src={visible} onClick={ShowPassword} />
						</div>
						<button className="button" type="submit">
							Salvar
						</button>
					</form>
				</section>
			</div>
		</body>
	);
}
