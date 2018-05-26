let mongoose = require('mongoose'),
    Schema   = mongoose.Schema

let UserSchema = new Schema({
	user: {type: String, require: true, unique: true},
	email: {type: String, require: true},
	password: {type: String, require: true}
},{
  versionKey: false
})

let Users = mongoose.model('usuarios', UserSchema)

module.exports = Users