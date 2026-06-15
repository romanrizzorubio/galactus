import React, {Component} from "react";
import './Mesa.css';
import Panel from "../panel/Panel.js";
import Form from "../form/Form.js";
import Api from "../../api/Api.js";
import Progress from "../progress/Progress.js";

class Mesa extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numPlayers: 2,
      solucionDone: false,
      maquina: 50,
      solucion: 50,
      nulificador: 50,
      end: new Date(),
      ended: false,
    }
  }

  componentDidMount() {
    this.load();
  }

  load() {
    Api.get('data')
      .then(data => {
        console.log(data);

        this.setData(data);
      });
  }

  getTime(end) {
    const now = new Date();
    const time = new Date(end);

    if (time.getTime() < now.getTime()) {
      this.setState({
        ...this.state,
        ended: true,
      })
    }

    let hour = time.getHours() - now.getHours();
    let _minutes= time.getMinutes() - now.getMinutes();
    let _seconds = time.getSeconds() - now.getSeconds();
    if (_seconds < 0) {
      _seconds = 60 + _seconds;
      _minutes--;
    }
    if (_minutes < 0) {
      _minutes = 60 + _minutes;
      hour--;
    }

    const minutes = _minutes < 10 ? `0${_minutes}` : _minutes;
    const seconds = _seconds < 10 ? `0${_seconds}` : _seconds;

    return `${hour}:${minutes}:${seconds}`;
  }

  setData(data) {
    const maquina = (data.maquina * 100) / data.maquinaMax;
    const solucion = (data.solucion * 100) / data.solucionMax;
    const nulificador = (data.nulificador * 100) / data.nulificadorMax;
    const timer = this.getTime(data.end);

    this.setState({
      numPlayers: data.players,
      solucionDone: data.solucionDone,
      timer,
      maquina,
      solucion,
      nulificador,
      maquinaCurrent: data.maquina,
      maquinaMax: data.maquinaMax,
      solucionCurrent: data.solucion,
      solucionMax: data.solucionMax,
      nulificadorCurrent: data.nulificador,
      nulificadorMax: data.nulificadorMax,
    });

    if (maquina < 100 && !this.state.ended && nulificador > 0) {
      setTimeout(() => {
        this.load();
      }, 1000)
    }
  }

  handleMaquina = value => {
    Api.post('maquina', {
      maquina: value,
    });
  }

  handlePlan = value => {
    const {solucionDone} = this.state;

    if (solucionDone)  {
      Api.post('nulificador', {
        nulificador: value,
      });
    } else {
      Api.post('solucion', {
        solucion: value,
      });
    }
  }

  get classPlan() {
    return this.state.solucionDone ? 'nulificador' : 'solucion';
  }

  render() {
    const {
      maquina, solucion, nulificador, timer, solucionDone, ended,
      maquinaCurrent, maquinaMax, solucionCurrent, solucionMax,
      nulificadorCurrent, nulificadorMax
    } = this.state;


    if (maquina >= 100) {
      return (
          <div className="mesa">
            <h1>¡Fin del juego!</h1>
            <h2>¡Galactus ha devorado el planeta!</h2>
          </div>
      );
    }

    if (ended) {
      return (
          <div className="mesa">
            <h1>¡Fin del juego!</h1>
            <h2>¡Se os acabó el tiempo!</h2>
          </div>
      );
    }

    if (!solucionDone && solucion < 1) {
      return (
          <div className="mesa">
            <h1>¡Solución encontrada!</h1>
          </div>
      );
    }

    if (nulificador < 1) {
      return (
          <div className="mesa">
            <h1>¡Nulificador encontrado!</h1>
            <h2>Dad la vuelta a la Máquina</h2>
          </div>
      );
    }

    return (
      <div className="mesa">
        <h1>{timer}</h1>
        <div className="container">
          <Panel type="maquina">
            <Progress perc={maquina} current={maquinaCurrent} max={maquinaMax} invert/>
            <Form onChange={this.handleMaquina} />
          </Panel>
          <Panel type={this.classPlan}>
            <Progress
              perc={solucionDone ? nulificador : solucion}
              current={solucionDone ? nulificadorCurrent : solucionCurrent}
              invert
            />
            <Form onChange={this.handlePlan} />
          </Panel>
        </div>
      </div>
    );
  }
}

export default Mesa;
