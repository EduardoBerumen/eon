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
	prioridad: {
		type: String,
		default: '',
		required: 'Ingresa la prioridad',
		trim: true
	},
	name: {
		type: String,
		default: '',
		required: 'Ingresa el nombre de la tarea',
		trim: true
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