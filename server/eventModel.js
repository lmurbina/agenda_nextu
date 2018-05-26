let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    Users       = require('./userModel'),
    autoIncrement = require('mongoose-auto-increment')

let EventSchema = new Schema({
	title: {type: String, require: true},
	start: {type: String, require: true},
	end:   {type: String, require: false},
	user:  {type: Schema.ObjectId, ref: 'usuarios'}
},{
  versionKey: false
})

autoIncrement.initialize(mongoose.connection)
EventSchema.plugin(autoIncrement.plugin, {model: 'Eventos', startAt: 1})

const Events = mongoose.model('eventos', EventSchema)

module.exports = Events