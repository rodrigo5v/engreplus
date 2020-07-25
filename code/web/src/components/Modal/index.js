import React, { useState } from 'react';
import './styles.css';

import { FiX } from 'react-icons/fi';

export default function Modal(props) {
	const [flag] = useState(props.modalVisible) // Recebeu o estado da prop "modalVisible"

	/* Esta função vai ser responsável por enviar os dados desejados 
	   como parâmetros para a função definida no componente pai (logon) */
	const someFn = () => {
		props.callbackFromParent(false); // Estou utilizando props para passar seu estado
	}
	return(
		<>
			{/* O false vai sempre executar depois dos ":" */}
		{ flag ?  // condição ? flag se for "false" : se for "true" executa esse HTML -->
		
			<div  className="modal">
				<div id="modal" className="container" >
					<div className="headerModal">
						<h4 className="textTittle">{props.tittle}</h4>
						<button className="closeIcon" onClick={someFn}>
							<FiX className="closeIcon" />
						</button>
					</div>
					<div className="contentModal">
						<span className="textContent">{props.content}</span>
					</div>
					<div className="bottomModal">
						<button className="closeButton" onClick={props.exit}>
							SAIR
						</button>
					</div>
				</div>
			</div>
		: null } 
		</>	
	)
}
