const courseRouter = require('express').Router({ mergeParams: true });
const Course = require('../models/course.model');
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course.ctrl');
const advancedResults = require('../middleware/advancedResult');

// Protect the routes
const { protect, authorize } = require('../middleware/authentication');

// GET all Courses
courseRouter.route('/courses').get(
  advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getCourses
);

// GET Courses for a Bootcamp
courseRouter.route('/bootcamp/:bootcampId/courses').get(getCourses);

// GET a single Course
courseRouter.route('/course/:id').get(getCourse);

// POST a Course
courseRouter
  .route('/bootcamps/:bootcampId/course')
  .post(protect, authorize('publisher', 'admin'), addCourse);

// UPDATE a Course
courseRouter
  .route('/course/:id')
  .put(protect, authorize('publisher', 'admin'), updateCourse);

// DELETE a Course
courseRouter
  .route('/course/:id')
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = courseRouter;
