'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tarea Schema
 */
var TareaSchema = new Schema({
	proyectos: {
		type: Array,
		default: '',
		trim: true
	},
	nombres: {
		type: Array,
		default: '',
		trim: true
	},
	prioridad: {
		type: String,
		default: '',
		required: 'Ingresa la prioridad',
		trim: true
	},
	status: {
		type: String,
		default: '',
		required: 'Ingresa el Status',
		trim: true
	},
	name: {
		type: String,
		default: '',
		required: 'Ingresa el nombre de la tarea',
		trim: true
	},
	dateFin: {
		type: Date,
		default: ''
	},
	dateLim: {
		type: Date,
		default: ''
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tarea', TareaSchema);