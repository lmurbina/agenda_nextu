const express    = require('express'),
      Router     = express.Router(),
      session    = require('express-session'),
			Users      = require('./userModel'),
			Events     = require('./eventModel'),
			Operac     = require('./newUser')

// MANEJO DE SESSIONES
Router.use(session({
	secret: 'secret-pass',
	cookie: { maxAge: (60 * 60 * 1000)},
	resave: false,
	saveUninitialized: true,
}))

Router.get('/demo', function(req, res){
	Users.find({user: req.query.user}).count({}, function(err, count){
		if (count > 0){
			res.send('Utilice los siguientes datos: </br> Usuario: demo | password: demo')
		} else {
			Operac.crearUsuarioDemo((err, result)=>{
				if(err) res.send(err) //Enviar mensaje de error
        else res.send(result) //Enviar mensaje de resultado        
			})
		}
	})
})

Router.post('/login', function(req, res){		
	// Verificar que el usuario existe
	Users.find({user: req.body.user}).count({}, function(err, count){
		if (err){
			res.status(500)
			res.json(err)
		} else {
			if (count == 1) {
				// Consultamos de nuevo para verificar el password
				Users.find({user: req.body.user, password: req.body.pass}).count({}, function(err, count){
					if (err){
						res.status(500)
						res.json(err)
					} else {
						if (count == 1) {
							req.session.user = req.body.user
							res.send('Validado')
						} else res.send('Contraseña incorrecta') 
					}
				})
			} else {
				res.send('Usuario no registrado')
			}
		}
	})
})

Router.post('/logout', function(req, res){
	req.session.destroy((err)=>{
		if (err){
			console.log(err)
			res.json(err)
		} else {
			req.session = null
			res.send('logout')
			res.end()
		}
	})
})

/*
 * Rutas para los eventos
 */

Router.get('/all', function(req, res){
	req.session.reload(function(err){
		if (req.session.user){ // Si inicio sesión			
			Users.findOne({user: req.session.user}).exec(function(err,user){
				if (err) {
					res.status(500)
					res.json(err)
				}
				else { // Si hay un usuario valido registrado buscamos sus eventos					
					Events.find({user: user._id}).exec(function(err, doc){
						if (err) {
							res.status(500)
							res.json(err)
						} else res.json(doc) // devolvemos los eventos
					})					
				}
			})			
		} else { // Si no existe sesión
			res.send('logout')
			res.end()
		}
	})
})

Router.post('/new', function(req, res){
	req.session.reload(function(err){
		if (err) {
			console.log(err)
			res.json('logout')
		} else {
			// Preparamos el ID del nuevo evento
			Users.findOne({user: req.session.user}).exec({}, function(error, doc){
				Events.nextCount(function(err, count){
					newID = count
				})
				// Creamos el nuevo evento
				let evento = new Events({
					title: req.body.title,
					start: req.body.start,
					end:   req.body.end,
					user:  doc._id
				})
				// Guardamos el nuevo evento
				evento.save(function(err){
					if (err) {
						console.log(err)
						res.json(err)
					}
					else res.json(newID)						
				})
			})
		}
	})
})

Router.post('/delete/:_id', function(req, res){
	let id = req.params._id
	console.log(id)
	req.session.reload(function(err){
		if (err) {
			console.log(err)
			res.send('logout')
		} else {
			Events.remove({_id: id}, function(err){
				if (err) {
					console.log(err)
					res.status(500)
					res.json(err)
				} else res.send('Evento eliminado.')
			})
		}
	})
})

Router.post('/update/:_id', function(req, res){
	req.session.reload(function(err){
		if (err) {
			console.log(err)
			res.send('logout')
		} else {
			// Consultar si el evento existe
			Events.findOne({_id: req.params._id}).exec((err) => { 
				if (err) {
					console.log(err)
					res.status(500)
					res.json(err)
				} else {
					// Preparamos los datos
					let cond   = 	{ _id: req.params._id },
							values = 	{ start: req.body.start, 
												 	end: req.body.end 
												}
					console.log(cond)
					console.log(values)
					// Actualizamos el evento
					Events.update(cond, values, (err, result) => {
						if (err) res.send(err)
						else res.send('Evento actualizado.')
					})					
				}
			})
		}
	})
})

/*
 * Ruta general
 */

Router.all('*', function(req, res){
	res.send('Error al mostrar el recurso solicitado, Por favor verifique la dirección url a la cual desea ingresar')
	res.end()
})

// Por ultimo exportamos el modulo
module.exports = Router