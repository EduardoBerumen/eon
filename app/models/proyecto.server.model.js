'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Proyecto Schema
 */
var ProyectoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'El campo nombre es Obligaatorio',
		trim: true
	},
	descripcion: {
		type: String,
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

mongoose.model('Proyecto', ProyectoSchema);