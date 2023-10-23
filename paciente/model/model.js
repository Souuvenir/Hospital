var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pacienteSchema = Schema({
    name: String,
    rut: String,
    edad: Number,
    sexo: String,
    photo: String,
    fechaIngreso: {type: Date, default: Date.now},
    enfermedad: String,
    revisado: {type: Boolean, default: false}
});


module.exports = mongoose.model('Paciente', pacienteSchema);