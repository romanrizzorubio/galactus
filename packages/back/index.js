const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 4000

const maquinaInit = 5;
const maquinaMax = 10;
const solucionMax = 10;
const nulificadorMax = 12;

const data = {
  maquina: 0,
  solucion: 0,
  nulificador: 0,
  maquinaMax: 0,
  solucionMax: 0,
  nulificadorMax: 0,
  players: 0,
  solucionDone: false,
  end: 0,
}

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json('Hello World!')
})

app.get('/data', (req, res) => {
  console.log('data', data);
  res.send(data)
})

app.post('/init', (req, res) => {
  const {players, end} = req.body;

  data.players = players;
  data.maquina = maquinaInit * players;
  data.solucion = solucionMax * players;
  data.nulificador = nulificadorMax * players;
  data.maquinaMax = maquinaMax * players;
  data.solucionMax = data.solucion;
  data.nulificadorMax = data.nulificador;
  data.solucionDone = false;
  data.end = end;

  console.log('init', data);

  res.send(data)
})

app.post('/maquina', (req, res) => {
  const {maquina} = req.body;

  data.maquina += maquina;
  if (data.maquina < 0) {
    data.maquina = 0;
  }

  res.send(data)
})

app.post('/solucion', (req, res) => {
  const {solucion} = req.body;

  data.solucion += solucion;

  res.send(data)
})

app.post('/nulificador', (req, res) => {
  const {nulificador} = req.body;

  data.nulificador += nulificador;

  res.send(data)
})

app.get('/solucion-done', (req, res) => {
  data.solucionDone = true;

  res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
