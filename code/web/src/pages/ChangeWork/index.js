import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import InputMask from 'react-input-mask';

import api from '../../services/api';
import Modal from '../../components/Modal';
import Arrow from '../../components/Arrow';

import './styles.css';

export default function ViewWork() {
	document.title = 'Editar Serviço';
	const [ client_work, setClient ] = useState('');
	const [ description_work, setDescription ] = useState('');
	const [ value_work, setValue ] = useState('');
	const [ date_work, setDate ] = useState('');
	const [ dayPayment_work, setDayPayment ] = useState('');
	const [ isModalVisible, setIsModalVisible ] = useState(false);
	const [ isModalVisibleB, setIsModalVisibleB ] = useState(false);

	//const employee_id = localStorage.getItem('employee_id');
	const token = localStorage.getItem('token');
	const id_work = localStorage.getItem('id_work'); // Pegando lá da função "exportID"

	const history = useHistory();

	// Listando os dados no input
	useEffect(
		() => {
			api
				.get(`/works/${id_work}`, {
					headers: {
						Authorization: token
					}
				})
				.then((response) => {
					setClient(response.data.client_work);
					setDescription(response.data.description_work);
					setValue(response.data.value_work);
					setDate(response.data.date_work);
					setDayPayment(response.data.dayPayment_work);
				});
		},
		[ id_work, token ]
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

	// Função de update work
	async function handleChangeWork(e) {
		e.preventDefault();
		const work = {
			client_work,
			description_work,
			value_work,
			date_work,
			dayPayment_work
		};
		try {
			await api.put(`/works/change/${id_work}`, work, {
				headers: {
					Authorization: token
				}
			});
			appearModal();
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
						<p>Edição de Serviço</p>
					</div>
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
					<form onSubmit={handleChangeWork}>
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
