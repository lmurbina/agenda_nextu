const http       = require('http'),
      path       = require('path'),
      express    = require('express'),
      //session    = require('express-session'),
      Routing    = require('./rutas'),      
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose')
      

// CONEXION CON LA BASE DE DATOS
const url = 'mongodb://localhost/agenda_db'
const connection = mongoose.connect(url, function(err){
	if (err) {
		console.log('Error :'+ err.message)
	} else {
		console.log('Conectado a MongoDB')
	}
})

const PORT = process.env.PORT || 2000,
      app  = express()

const Server = http.createServer(app)

app.use(express.static('./client'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/agenda',Routing)

// SERVIDOR LISTO PARA EL USUARIO
Server.listen(PORT, function() {
	console.log('Server is listening on port: '+PORT)
})

module.exports = app