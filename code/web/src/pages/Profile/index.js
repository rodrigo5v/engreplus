import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { FaTruck } from 'react-icons/fa';
import {
	AiFillEdit,
	AiFillBook,
	AiFillSetting,
	AiFillDollarCircle,
	AiFillAlert,
	AiOutlineLogout
} from 'react-icons/ai';

import api from '../../services/api';
import Modal from '../../components/Modal';

import logo from '../../assets/bannerEmail.png';

import './styles.css';

export default function Profile() {
	document.title = 'Perfil';
	const [ works, setWorks ] = useState([]);
	const [ isModalVisible, setIsModalVisible ] = useState(false);

	const history = useHistory();

	// Valor que veio do logon
	const name_employee = localStorage.getItem('name_employee');
	//const employee_id = localStorage.getItem('employee_id');
	const token = localStorage.getItem('token');

	// Método que pego o primeiro nome do employee
	const quantPalavras = name_employee.split(' '); // Transformando em array
	const tamanho = quantPalavras.length; // Pegando o comprimento dessa array
	const primeiroNome = quantPalavras[tamanho - tamanho]; // Dentro da array faço(comprimento-comprimento) e assim pego o primeiro indice da array

	// Método de listagem de works
	useEffect(
		() => {
			api
				.get('profile', {
					headers: {
						Authorization: token
					}
				})
				.then((response) => {
					setWorks(response.data);
				});
		},
		[ token ]
	);

	// Método de colorir a tabela assim que entrar no profile
	useEffect(() => {
		handleTable();
	});

	function appearModal() {
		setIsModalVisible(!isModalVisible);
	}

	const myCallBack = (dataFromChild) => {
		setIsModalVisible(dataFromChild);
	};

	function exitModal() {
		window.location.reload();
	}

	// Método de logout
	function handleLogout() {
		localStorage.clear(); // Limpando
		history.push('/');
	}

	// Função de deletar work
	async function handleDeleteWork(id) {
		try {
			await api.delete(`works/${id}`, {
				headers: {
					Authorization: token
				}
			});

			// Deletar em tempo real
			setWorks(works.filter((works) => works.id_work !== id));
		} catch (err) {
			appearModal();
		}
	}

	// Função de exportar ID no update
	async function exportID(id) {
		localStorage.setItem('id_work', id);
		history.push('/changework');
	}

	// Método coloração da tabela
	function handleTable() {
		const tabela = document.getElementById('table');
		const linhas = tabela.getElementsByTagName('tr');

		for (let index = 0; index < linhas.length - 1; index++) {
			/*** Conversão de dias para data na table ***/

			const dayDigitado = works.map((works) => works.dayPayment_work)[index]; // Extraindo o Dia cadastrado pelo user
			const dayInt = parseInt(dayDigitado); // Ele vem como uma array, então faço a conversão para Int

			const entregaWork = works.map((works) => works.date_work)[index]; // Extraindo o dia de entrega do trabalho cadastrado pelo user
			const split = entregaWork.split('/'); // Dividindo com o split
			const dateEntregaWork = new Date(split[2], split[1] - 1, split[0]); // Transformo para date

			const mes = split[1];
			const monthInt = parseInt(mes);

			const year = split[2];
			const yearInt = parseInt(year);

			const datePagamento = new Date(); // Pegando outra data atual, no qual essa váriavel vai ser usada para realizar a som
			datePagamento.setMonth(monthInt - 1);
			datePagamento.setFullYear(yearInt);

			datePagamento.setDate(dateEntregaWork.getDate() + dayInt); // aplico a data que esta na variavel "dateEntregaWork" e somo mais os dias com a variavel digitada "dayInt"
			const datePagamentoBR = datePagamento.toLocaleDateString('pt-BR'); // Deixando ela no formato BR d/m/a

			const tdPagamento = document.getElementsByClassName('dayData');
			tdPagamento[index].innerHTML = datePagamentoBR; //insiro a data

			/*** Comparação date ***/

			// Pego a data atual e transformo no formato BR
			const nowComparation = new Date();
			const nowComparationBR = nowComparation.toLocaleDateString('pt-BR');

			// Pego os valores dela para comparar a igualdade
			const nowComparationValue = nowComparationBR.valueOf();
			const userComparationValue = datePagamentoBR.valueOf();

			// Divido em partes e aplico em uma nova variavel para podermos fazer as comparações
			const strData = datePagamentoBR;
			const partesData = strData.split('/');
			const datePagamentoFinal = new Date(partesData[2], partesData[1] - 1, partesData[0]);

			if (userComparationValue === nowComparationValue) {
				document.getElementsByClassName('classeTR')[index].style.backgroundColor = '#ffff80';
			} else if (datePagamentoFinal < new Date()) {
				document.getElementsByClassName('classeTR')[index].style.backgroundColor = '#ff8080';
			} else if (datePagamentoFinal > new Date()) {
				document.getElementsByClassName('classeTR')[index].style.backgroundColor = '#80ff80';
			}
		}
	}

	return (
		<body className="bodyProfile">
			<div className="topProfile">
				<div className="contentLeftTop">
					<img className="imgTop" src={logo} alt="logo" />
				</div>
				<div className="contentRightTop">
					<span>Bem vindo, {primeiroNome}</span>
				</div>
			</div>
			<div className="App">
				{isModalVisible ? ( // condição ? Valor se for "true" : se for "false"
					<Modal
						modalVisible={isModalVisible} // Passando uma prop que levará a informação sobre seu estado para o componente filho (logon)
						callbackFromParent={myCallBack} // props que veio com o estado definido do Modal
						tittle="Falha ao deletar!"
						content="Não foi possível deletar, tente novamente."
						exit={exitModal}
					/>
				) : null}
			</div>
			<div className="content">
				<div class="wallMenu">
					<div className="container-itens">
						<div className="container-icons">
							<AiFillEdit size={20} color={'#ffffff'} />
						</div>
						<Link className="labelWall" to="/profile/change">
							Editar perfil
						</Link>
					</div>
					<div className="container-itens">
						<div className="container-icons">
							<FaTruck size={20} color={'#ffffff'} />
						</div>
						<Link className="labelWall">Vendas</Link>
					</div>
					<div className="container-itens">
						<div className="container-icons">
							<AiFillBook size={20} color={'#ffffff'} />
						</div>
						<Link className="labelWall">Relatórios</Link>
					</div>
					<div className="container-itens">
						<div className="container-icons">
							<AiFillDollarCircle size={20} color={'#ffffff'} />
						</div>
						<Link className="labelWall">Pagamentos</Link>
					</div>
					<div className="container-itens">
						<div className="container-icons">
							<AiFillSetting size={20} color={'#ffffff'} />
						</div>
						<Link className="labelWall">Configurações</Link>
					</div>
					<div className="container-itens">
						<div className="container-icons">
							<AiFillAlert size={20} color={'#ffffff'} />
						</div>
						<Link className="labelWall">Suporte online</Link>
					</div>
					<div className="container-itens">
						<div className="container-icons">
							<AiOutlineLogout size={20} color={'#ff0000'} />
						</div>
						<Link className="labelWall" onClick={handleLogout}>
							Sair
						</Link>
					</div>
				</div>
				<div className="contentRight">
					<div class="bannerTable">
						<div className="firstSpan">
							<span className="spanBanner">Pagamentos e serviços</span>
						</div>
						<div className="buttonNew">
							<Link className="buttonNew_style" to="/works/new">
								<p className="pButton">Novo</p>
							</Link>
						</div>
					</div>
					<div className="tableContent">
						<table id="table" className="table">
							<tr>
								<th>Cliente</th>
								<th>Descrição</th>
								<th>Valor</th>
								<th>Entrega</th>
								<th>Pagamento</th>
								<th>Opções</th>
							</tr>
							{works.map((works) => (
								<tr className="classeTR" id="trID" key={works.id_work}>
									<td>{works.client_work}</td>
									<td>{works.description_work}</td>
									<td>
										{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
											works.value_work
										)}
									</td>
									<td>{works.date_work}</td>
									<td className="dayData" />
									<td>
										<div className="profileIcons">
											<button
												onClick={() => exportID(works.id_work)}
												type="button"
												style={{ border: 0, width: 0 }}
											>
												<FiEdit className="icons" size={15} color={'#333333'} />
											</button>
											<button
												onClick={() => handleDeleteWork(works.id_work)}
												type="button"
												style={{ border: 0, width: 0 }}
											>
												<FiTrash2 className="icons" size={15} color={'#333333'} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</table>
					</div>
				</div>
			</div>
		</body>
	);
}
