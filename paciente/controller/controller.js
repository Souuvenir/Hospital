var validate = require('validator');
var paciente = require('../model/model.js');

var fs = require('fs');
var path = require('path');

var controller = {
    newPaciente: (req, res) =>{
        var params = req.body;
        if(!validate.isEmpty(params.name) 
            && !validate.isEmpty(params.rut) 
            && params.edad != undefined 
            && !validate.isEmpty(params.sexo) 
            && !validate.isEmpty(params.enfermedad)) {
            var newPaciente = new paciente();
            newPaciente.name = params.name;
            newPaciente.rut = params.rut;
            newPaciente.edad = params.edad;
            newPaciente.sexo = params.sexo;
            newPaciente.fechaIngreso = params.fechaIngreso;
            newPaciente.enfermedad = params.enfermedad;
            newPaciente.revisado = params.revisado;

            if(params.photo){
                newPaciente.photo = params.photo;
            }else{
                newPaciente.photo = null;
            }
            newPaciente.save((err, pacienteStored) => {
                if(err || !pacienteStored) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar el paciente'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    paciente: pacienteStored
                });
            }); 
        } else {
            return res.status(500).send({
                status: 'error',
                message: 'Debe completar los campos requeridos'
            });
        }
    },
    getAll: (req, res) =>{
        var query = paciente.find({});
        var last = req.params.last;
        if(last || last != undefined) {
            query.limit(5);
        }   
        query.sort('-_id').exec((err, pacientes) => {
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al encontrar pacientes'
                });
            }
            if(!pacientes) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay pacientes para mostrar'
                });
            }
            return res.status(200).send({
                status: 'success',
                pacientes
            });
        });
    },
    findById: (req, res) =>{
        var pacienteId = req.params.id;

        if(!pacienteId || pacienteId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el paciente'
            });
        }
        paciente.findById(pacienteId, (err, paciente) => {
            if(err || !paciente) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el paciente'
                });
            }
            return res.status(200).send({
                status: 'success',
                paciente
            });
        });
    },
    updatePaciente: (req, res) =>{  
       var pacienteId = req.params.id;
       var params = req.body;  

         try {
                
          } catch(err) {
                return res.status(500).send({
                 status: 'error',
                 message: 'Debe completar los campos requeridos'
                });
          }
          if(!validate.isEmpty(params.name) 
            && !validate.isEmpty(params.rut) 
            && params.edad != undefined 
            && !validate.isEmpty(params.sexo) 
            && !validate.isEmpty(params.enfermedad)) {

                paciente.findByIdAndUpdate({_id: pacienteId}, params, {new:true}, (err, pacienteUpdated) => {
                 if(err) {
                      return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar el paciente'
                      });
                 }
                 else if(!pacienteUpdated) {
                      return res.status(404).send({
                            status: 'error',
                            message: 'No existe el paciente'
                      });
                 } else {
                        return res.status(200).send({
                        status: 'success',
                        paciente: pacienteUpdated
                    }); 
                 }
                });
          }else{
            return res.status(500).send({
                status: 'error',
                message: 'Debe completar los campos requeridos'
            });
          } 
    },
    deleteById: (req, res) =>{
        var pacienteId = req.params.id;
        paciente.findByIdAndDelete({_id: pacienteId}, (err, pacienteRemoved) => {
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar el paciente'
                });
            }
            if(!pacienteRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el paciente'
                });
            }
            return res.status(200).send({
                status: 'Registro de paciente eliminado',
                paciente: pacienteRemoved
            });
        }); 
    },
    search: (req, res) =>{
        var search = req.params.search;

        paciente.find({ 
        "$or": [
            {"sexo": { "$regex": search, "$options": "i"}},
            {"enfermedad": { "$regex": search, "$options": "i"}}
        ]
        })
        .sort([['fechaIngreso', 'descending']])
        .exec((err, pacientes) => {

            if(!pacientes || pacientes.length <= 0){
                paciente.find({
                    "fechaIngreso": search
                })
                .sort([['fechaIngreso', 'descending']])
                .exec((err, pacientes) => {
                    if(err){
                        return res.status(404).send({
                            status: 'error',
                            message: 'Error al buscar por fecha'
                        });
                    }
                    if(!pacientes || pacientes.length <= 0){
                        return res.status(404).send({
                            status: 'error',
                            message: 'No hay pacientes con esa fecha de ingreso'
                        });
                    } else {
                        return res.status(200).send({
                            status: 'Pacientes:',
                            pacientes
                        });
                    }
                });
            } else {
                return res.status(200).send({
                    status: 'Pacientes:',
                    pacientes
                });
            }
        });
    },
    uploadPhoto: (req, res) =>{
        var file = req.file;
        var pacienteId = req.params.id;

        if(!file) {
            return res.status(404).send({
                status: 'error',
                message: 'No se ha subido ninguna imagen'
            });
        }
        var fileName = file.filename;
        if(pacienteId != null && pacienteId != undefined){
            paciente.findByIdAndUpdate({_id: pacienteId}, {photo: fileName}, {new:true}, (err, pacienteUpdated) => {
                if(err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar el paciente'
                    });
                }
                else if(!pacienteUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el paciente'
                    });
                } else {
                    return res.status(200).send({
                        status: 'success',
                        paciente: pacienteUpdated
                    }); 
                }
            }   
            );
        }
    },
    findPhoto: (req, res) =>{
        var photo = req.params.photo;
        var path_file = './uploads/' + photo;

        fs.existsSync(path_file, (exists) => {
            if(exists){
                return sendFile(path.resolve(path_file))
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la imagen'
                });
            }
        });
    }
}

module.exports = controller;