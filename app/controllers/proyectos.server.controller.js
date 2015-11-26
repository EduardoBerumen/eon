'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Proyecto = mongoose.model('Proyecto'),
	_ = require('lodash');

/**
 * Create a Proyecto
 */
exports.create = function(req, res) {
	var proyecto = new Proyecto(req.body);
	proyecto.user = req.user;

	proyecto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proyecto);
		}
	});
};

/**
 * Show the current Proyecto
 */
exports.read = function(req, res) {
	res.jsonp(req.proyecto);
};

/**
 * Update a Proyecto
 */
exports.update = function(req, res) {
	var proyecto = req.proyecto ;

	proyecto = _.extend(proyecto , req.body);

	proyecto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proyecto);
		}
	});
};

/**
 * Delete an Proyecto
 */
exports.delete = function(req, res) {
	var proyecto = req.proyecto ;

	proyecto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proyecto);
		}
	});
};

//lista proyectos para vista de tareas

//list usuarios

exports.listProyectos = function(req, res) {
	Proyecto.find().exec(function(err, proyecto) {
		if(err){
			message : 'error'
		}
		else{
			res.jsonp(proyecto);
		}
	});
};

/**
 * List of Proyectos
 */
exports.list = function(req, res) { 
	var sort;
	var sortObject = [];
	var count = req.query.count || 5;
	var page = req.query.page || 1;

	var filter = {
		filters: {
			mandatory:{
				contains: req.query.filter
			}
		}
	};

var pagination = {
	start: [page - 1] * count,
	count: count
};

if (req.query.sorting){
	var sortKey = Object.keys(req.query.sorting)[0];
	var sortValue = req.query.sorting[sortKey];

	sortObject[sortValue] = sortKey;
}else{
	sortObject['desc'] = '_id';
}

var sort = {
	sort: sortObject
};

Proyecto
	.find()
	.filter(filter)
	.order(sort)
	.page(pagination, function(err,proyectos){

		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proyectos);
		}
	});
};

/**
 * Proyecto middleware
 */
exports.proyectoByID = function(req, res, next, id) { 
	Proyecto.findById(id).populate('user', 'displayName').exec(function(err, proyecto) {
		if (err) return next(err);
		if (! proyecto) return next(new Error('Failed to load Proyecto ' + id));
		req.proyecto = proyecto ;
		next();
	});
};

/**
 * Proyecto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.proyecto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
