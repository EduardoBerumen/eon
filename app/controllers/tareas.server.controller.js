'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tarea = mongoose.model('Tarea'),
	_ = require('lodash');

/**
 * Create a Tarea
 */
exports.create = function(req, res) {
	var tarea = new Tarea(req.body);
	tarea.user = req.user;

	tarea.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tarea);
		}
	});
};

/**
 * Show the current Tarea
 */
exports.read = function(req, res) {
	res.jsonp(req.tarea);
};

/**
 * Update a Tarea
 */
exports.update = function(req, res) {
	var tarea = req.tarea ;

	tarea = _.extend(tarea , req.body);

	tarea.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tarea);
		}
	});
};

/**
 * Delete an Tarea
 */
exports.delete = function(req, res) {
	var tarea = req.tarea ;

	tarea.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tarea);
		}
	});
};

/**
 * List of Tareas
 */
/*exports.list = function(req, res) { 
	Tarea.find().sort('-created').populate('user', 'displayName').exec(function(err, tareas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tareas);
		}
	});
};*/

exports.list = function(req, res) { 

	console.info(req.query);
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

Tarea
	.find()
	.filter(filter)
	.order(sort)
	.page(pagination, function(err,tareas){

		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tareas);
		}
	});
};
/**
 * Tarea middleware
 */
exports.tareaByID = function(req, res, next, id) { 
	Tarea.findById(id).populate('user', 'displayName').exec(function(err, tarea) {
		if (err) return next(err);
		if (! tarea) return next(new Error('Failed to load Tarea ' + id));
		req.tarea = tarea ;
		next();
	});
};

/**
 * Tarea authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tarea.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
