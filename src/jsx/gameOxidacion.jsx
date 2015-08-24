var	elementos;

var Opcion = React.createClass({
	render: function () {
		return (
			<p key={this.props.key}>
				<input name={this.props.name} id={this.props.id} value={this.props.value} type="radio" />
				<label htmlFor={this.props.id}> {this.props.value} </label>
			</p>
		)
	}
});


var Elemento = React.createClass({
	chooseOption: function (correct) {
		
		var long_opt = correct.datos.n_oxidacion.length,
			grupo = correct.datos.grupo,
			opts = [],
			map_pos = [],
			r_correcta = correct.datos.n_oxidacion.join(', ').replace('+-', unescape('%B1'));

		//Incluimos las posibles respuestas y la respuesta correcta dependiendo el grupo en el que se encuentre el elemento
		switch (Number(grupo[1])) {
			case 1:
				opts = ['±1', '+1', '+2', '+3'];
				break;
			case 2:
				opts = ['+1', '+2', '+3', '+4'];
				break;
			case 3:
				opts = ['+1', '+2', '+3', '+4'];
				break;
			case 4:
				opts = ['+4', '+3, +4', '+2, +3, +4', '+3, +1'];
				break;
			case 5:
				opts = ['+2, +3 +4, +5', '+3, +4, +5', '+5', '+4, +5'];
				break;
			case 6:
				opts = ['+2, +3, +6', '+2, +3, +4, +5, +6', '+5, +6', '+4, +6'];
				break;
			case 7:
				opts = ['+2, +3, +4, +6, +7', '+4, +5, +6, +7', '+2, +4, +6', '+3, +4, +6, +7'];
				break;
			case 8:
				opts = ['+2, +3', '+2, +3, +4, +5, +6, +7, +8', '+4, +6', '+5, +6, +7, +8'];
				break;
			case 9:
				opts = ['+2, +3', '+2, +3, +4, +5, +6', '+2, +3, +4, +5, +6, +7, +8', '+4, +6'];
				break;
			case 10:
				opts = ['+2, +3', '+2, +4', '+4, +6', '+5, +6, +7, +8'];
				break;
			case 11:
				opts = ['+1, +2', '+1', '+1, +3', '+2, +4'];
				break;
			case 12:
				opts = ['+2', '+1, +2', '+1, +3', '+1'];
				break;
			case 13:
				opts = ['±3', '+3', '+1, +3', '+3, +4'];
				break;
			case 14:
				opts = ['+2', '+2, ±4', '+2, +4', '+4'];
				break;
			case 15:
				opts = ['±1, ±2, ±3, +4, +5', '±3, +5', '+3, +5', '+3, +4'];
				break;
			case 16:
				opts = ['-1, -2', '±2, +4, +6', '-2, +4, +6', '±3, +5'];
				break;
			case 17:
				opts = ['-1', '±1, +3, +5, +7', '±1, +5', '+1, +5'];
				break;
		}

		//Reordenamos las respuesta
		opts = reordenar(opts);

		return opts;
	},
	chooseElement: function () {
		var elem,
			n_max = elementos.length,
			bool = false,
			azar;

		//Ciclo para encontrar elemento
		while(!bool){
			var azar = Math.floor(Math.random()*n_max);
			//Revisamos que el elemento tenga un N. de Oxidacion registrado y que no sea gas noble
			if (elementos[azar].datos.n_oxidacion && Number(elementos[azar].datos.grupo[1]) < 18) {
				elem = elementos[azar];
				bool = true;
			}
		}

		return elem;
	},
	getInitialState: function () {
		var elem = this.chooseElement(),
			opciones = this.chooseOption(elem);

		return {
			n_atomico: elem.datos.n_atomico,
			simbolo: elem.datos.Simbolo,
			nombre: elem.nombre,
			n_oxidacion: elem.datos.n_oxidacion.join(', '),
			opciones: opciones
		}
	},
	render: function () {
		var parent = this;
		return (
			<div>
				<div id="box-simbolo">
					<p id="val-n-atomico">{this.state.n_atomico}</p>
					<h1 id="elemento-simbolo">{this.state.simbolo}</h1>
					<h2 id="elemento-nombre">{this.state.nombre}</h2>
				</div>
				<div>
					<form id="box-opciones">
						{
							this.state.opciones.map(function (opcion, key) {
								return (
									<div>
										<Opcion value={opcion} id={key} name={parent.state.nombre} key={key} />
									</div>
								)
							})
						}
					</form>
				</div>
			</div>			
		)
	}
}); 

var BtnCheck = React.createClass({
	check: function () {
		var n_atomico = Number($('#val-n-atomico').text()),
			r_intento,
			elem_actual,
			r_correcta;
		//Buscamos el elemento por su N. Atomico
		elementos.map(function (e) {
			if (Number(e.datos.n_atomico) == n_atomico) {
				elem_actual = e;			
			}
		});
		//Buscamos cual marcamos como respuesta
		r_intento = document.getElementsByName(elem_actual.nombre);
		for (var i = 0; i < r_intento.length; i++) {
			if(r_intento[i].checked == true) r_intento = r_intento[i].value;
		};
		
		//Checamos que devuelva un string, en cosa de hacerlo significa que ya contesto.
		if (typeof r_intento != 'string') {
			alert('No haz constestado');
		}else{
			//Formato para cambiar simbolo +- por unescape('%B1')
			r_correcta = elem_actual.datos.n_oxidacion.join(', ').replace('+-', unescape('%B1'));
			
			//Revisar si la respuesta es correcta
			if (r_correcta == r_intento) alert('Correcto');
			else alert('Error, la respuesta correcta es '+r_correcta);

			//Cambiar de elemento
			$('#box-elemento').html('');
			React.render(<Elemento />, $('#box-elemento')[0]);
		}
	},
	render: function () {
		return (
			<button onClick={this.check} >Verificar</button>	
		)
	}
});

//Funcion que convierte un Objeto JSON a un Array
function simpleArray(target){
	var arr = [];

	$.each(target, function (key, value) {
		var obj = {
			nombre: key,
			datos: value
		}
		arr.push(obj);
	});

	return arr;
}

$(document).ready(function () {
	$.getJSON('src/data/elementos.json', function (data) {
		elementos = simpleArray(data);
		React.render(<Elemento />, $('#box-elemento')[0]);
		React.render(<BtnCheck />, $('#box-controles')[0]);
	});
});