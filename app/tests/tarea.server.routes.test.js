'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tarea = mongoose.model('Tarea'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tarea;

/**
 * Tarea routes tests
 */
describe('Tarea CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Tarea
		user.save(function() {
			tarea = {
				name: 'Tarea Name'
			};

			done();
		});
	});

	it('should be able to save Tarea instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tarea
				agent.post('/tareas')
					.send(tarea)
					.expect(200)
					.end(function(tareaSaveErr, tareaSaveRes) {
						// Handle Tarea save error
						if (tareaSaveErr) done(tareaSaveErr);

						// Get a list of Tareas
						agent.get('/tareas')
							.end(function(tareasGetErr, tareasGetRes) {
								// Handle Tarea save error
								if (tareasGetErr) done(tareasGetErr);

								// Get Tareas list
								var tareas = tareasGetRes.body;

								// Set assertions
								(tareas[0].user._id).should.equal(userId);
								(tareas[0].name).should.match('Tarea Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tarea instance if not logged in', function(done) {
		agent.post('/tareas')
			.send(tarea)
			.expect(401)
			.end(function(tareaSaveErr, tareaSaveRes) {
				// Call the assertion callback
				done(tareaSaveErr);
			});
	});

	it('should not be able to save Tarea instance if no name is provided', function(done) {
		// Invalidate name field
		tarea.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tarea
				agent.post('/tareas')
					.send(tarea)
					.expect(400)
					.end(function(tareaSaveErr, tareaSaveRes) {
						// Set message assertion
						(tareaSaveRes.body.message).should.match('Please fill Tarea name');
						
						// Handle Tarea save error
						done(tareaSaveErr);
					});
			});
	});

	it('should be able to update Tarea instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tarea
				agent.post('/tareas')
					.send(tarea)
					.expect(200)
					.end(function(tareaSaveErr, tareaSaveRes) {
						// Handle Tarea save error
						if (tareaSaveErr) done(tareaSaveErr);

						// Update Tarea name
						tarea.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tarea
						agent.put('/tareas/' + tareaSaveRes.body._id)
							.send(tarea)
							.expect(200)
							.end(function(tareaUpdateErr, tareaUpdateRes) {
								// Handle Tarea update error
								if (tareaUpdateErr) done(tareaUpdateErr);

								// Set assertions
								(tareaUpdateRes.body._id).should.equal(tareaSaveRes.body._id);
								(tareaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tareas if not signed in', function(done) {
		// Create new Tarea model instance
		var tareaObj = new Tarea(tarea);

		// Save the Tarea
		tareaObj.save(function() {
			// Request Tareas
			request(app).get('/tareas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tarea if not signed in', function(done) {
		// Create new Tarea model instance
		var tareaObj = new Tarea(tarea);

		// Save the Tarea
		tareaObj.save(function() {
			request(app).get('/tareas/' + tareaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tarea.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tarea instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tarea
				agent.post('/tareas')
					.send(tarea)
					.expect(200)
					.end(function(tareaSaveErr, tareaSaveRes) {
						// Handle Tarea save error
						if (tareaSaveErr) done(tareaSaveErr);

						// Delete existing Tarea
						agent.delete('/tareas/' + tareaSaveRes.body._id)
							.send(tarea)
							.expect(200)
							.end(function(tareaDeleteErr, tareaDeleteRes) {
								// Handle Tarea error error
								if (tareaDeleteErr) done(tareaDeleteErr);

								// Set assertions
								(tareaDeleteRes.body._id).should.equal(tareaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tarea instance if not signed in', function(done) {
		// Set Tarea user 
		tarea.user = user;

		// Create new Tarea model instance
		var tareaObj = new Tarea(tarea);

		// Save the Tarea
		tareaObj.save(function() {
			// Try deleting Tarea
			request(app).delete('/tareas/' + tareaObj._id)
			.expect(401)
			.end(function(tareaDeleteErr, tareaDeleteRes) {
				// Set message assertion
				(tareaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tarea error error
				done(tareaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tarea.remove().exec();
		done();
	});
});