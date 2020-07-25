import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import InputMask from 'react-input-mask';

import api from '../../services/api';
import Modal from '../../components/Modal';
import Arrow from '../../components/Arrow';

import './styles.css';

export default function NewWork() {
	document.title = 'Cadastrar Serviço';
	const [ client_work, setClient ] = useState('');
	const [ description_work, setDescription ] = useState('');
	const [ value_work, setValue ] = useState('');
	const [ date_work, setDate ] = useState('');
	const [ dayPayment_work, setDayPayment ] = useState('');
	const [ isModalVisible, setIsModalVisible ] = useState(false);
	const [ isModalVisibleB, setIsModalVisibleB ] = useState(false);

	//const employee_id = localStorage.getItem('employee_id');
	const token = localStorage.getItem('token');

	const history = useHistory();

	const date = new Date(); // Pegando data atual, no qual essa váriavel vai ser usada para carregar o input
	const dateBR = date.toLocaleDateString('pt-BR'); // Deixando ela no formato BR d/m/a

	//definindo o state é possível apresentar a data quando abrir a página
	useEffect(
		() => {
			setDate(dateBR);
		},
		[ dateBR ]
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

	function nullState() {
		setClient('');
		setDescription('');
		setValue('');
		setDayPayment('');
	}

	async function handleNewWork(e) {
		e.preventDefault();
		const work = {
			client_work,
			description_work,
			value_work,
			date_work,
			dayPayment_work
		};

		try {
			await api.post('/works', work, {
				headers: {
					Authorization: token
				}
			});
			appearModal();
			nullState();
		} catch (err) {
			appearModalB();
		}
	}

	return (
		<body className="bodyPages">
			<div className="cwork-container">
				<header>
					<div className="canto">
						<Link className="back-link-top" to="/profile">
							<Arrow />
						</Link>
					</div>
					<div className="contentHeader">
						<h1>ENGREPLUS</h1>
						<p>Cadastro de Serviço</p>
					</div>
				</header>
				<div className="App">
					{isModalVisible ? (
						<Modal
							modalVisible={isModalVisible} // Passando uma prop que levará a informação sobre seu estado para o componente filho (logon)
							callbackFromParent={myCallBack} // props que veio com o estado definido do Modal
							tittle="Cadastrado com sucesso!"
							content="Seu cadastro foi bem sucedido."
							exit={exitModal}
						/>
					) : null}
					{isModalVisibleB ? (
						<Modal
							modalVisible={isModalVisibleB} // Passando uma prop que levará a informação sobre seu estado para o componente filho (logon)
							callbackFromParent={myCallBack} // props que veio com o estado definido do Modal
							tittle="Falha ao cadastrar!"
							content="Não foi possível cadastrar, tente novamente."
							exit={exitModal}
						/>
					) : null}
				</div>
				<section className="form">
					<form onSubmit={handleNewWork}>
						<p>Cliente</p>
						<input
							type="text"
							required="required"
							value={client_work}
							onChange={(e) => setClient(e.target.value)}
						/>
						<p>Descrição</p>
						<textarea
							required="required"
							value={description_work}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<div className="p-group">
							<p>Entrega</p> <p>Receber(dias)</p>
						</div>
						<div className="inp-group">
							<InputMask
								id="date"
								mask="99/99/9999"
								type="text"
								required="required"
								value={date_work}
								onChange={(e) => setDate(e.target.value)}
							/>
							<input
								type="number"
								required="required"
								value={dayPayment_work}
								onChange={(e) => setDayPayment(e.target.value)}
							/>
						</div>
						<p className="p-value">Valor</p>
						<div className="value-group">
							<input
								type="number"
								required="required"
								value={value_work}
								onChange={(e) => setValue(e.target.value)}
							/>
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
