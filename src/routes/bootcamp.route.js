const bootcampRouter = require('express').Router();
const Bootcamp = require('../models/bootcamp.model');
const {
  getBootcamps,
  getBootcamp,
  getBootcampInRadius,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  uploadBootcampPhoto,
} = require('../controllers/bootcamp.ctrl');
const advancedResults = require('../middleware/advancedResult');

// Include other ressource routers
const courseRouter = require('./course.route');

// Protect the routes
const { protect, authorize } = require('../middleware/authentication');

//  Re-route into other resource routers
bootcampRouter.use('/bootcamp/:bootcampId/courses', courseRouter);

// GET all bootcamps
bootcampRouter
  .route('/bootcamps/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps);

// GET a bootcamp by Id
bootcampRouter.route('/bootcamp/:id').get(getBootcamp);

// GET a bootcamp with radius
bootcampRouter
  .route('/bootcamps/radius/:zipcode/:distance')
  .get(getBootcampInRadius);

// POST create a bootcamp
bootcampRouter
  .route('/bootcamp/create')
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

// PUT update a bootcamp
bootcampRouter
  .route('/bootcamp/:id')
  .put(protect, authorize('publisher', 'admin'), updateBootcamp);

// DELETE
bootcampRouter
  .route('/bootcamp/:id')
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

// UPLOAD a bootcamp photo
bootcampRouter
  .route('/bootcamp/:id/photo')
  .put(protect, authorize('publisher', 'admin'), uploadBootcampPhoto);

module.exports = bootcampRouter;
