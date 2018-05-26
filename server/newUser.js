var Users = require('./userModel') //Asignarle a la variable USUARIO el modelo del usuario

module.exports.crearUsuarioDemo = function(callback){ //Función para crear usuarios
  var arr = [{ 
    email: 'demo@mail.com', 
    user: "demo", 
    password: "demo"
    }, {
    email: 'lmurbina@mail.com', 
    user: "lmurbina", 
    password: "123456"
  }]; 
  Users.insertMany(arr, function(error, docs) { 
    if (error){ //Acciones si existe un error
      if (error.code == 11000){ 
        callback("Utilice los siguientes datos: </br>usuario: demo | password: demo") //Mostrar mensaje
      }else{
        callback(error.message) //Mostrar mensaje de error
      }
    }else{
      callback(null, "Utilice los siguientes datos: </br>usuario: demo | password: demo")
    }
  });
}