const advancedResults = require('../middleware/advancedResult');
const Course = require('../models/course.model'),
  Bootcamp = require('../models/bootcamp.model'),
  ErrorResponse = require('../utils/errorResponse'),
  asyncHandler = require('../middleware/asyncHandler');

// @desc    GET all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public and Private
exports.getCourses = asyncHandler(async (req, res, next) => {
  let bootcampId = req.params.bootcampId;

  if (bootcampId) {
    const courses = await Course.find({ bootcamp: bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    GET a single course
// @route   GET /api/v1/course/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  let id = req.params.id;
  const course = await Course.findById(id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(new ErrorResponse(`No course with id of ${id}`), 404);
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    CREATE a course
// @route   POST /api/v1/bootcamps/:bootcampId/course
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`),
      404
    );
  }

  // Make sure the bootcamp owner is the right user
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User _id of ${req.user._id} is not authorize to add a course to bootcamp ${bootcamp.id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    UPDATE a course
// @route   PUT /api/v1/course/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse(`No course with id of ${id}`), 404);
  }

   // Make sure the course owner
   if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User _id of ${req.user._id} is not authorize to update a the course ${course._id}`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    DELETE a course
// @route   DELETE /api/v1/course/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse(`No course with id of ${id}`), 404);
  }

     // Make sure the course owner
     if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User _id of ${req.user._id} is not authorize to delete the course ${course._id}`,
          401
        )
      );
    }

  await course.remove();

  res.status(200).json({
    msg: 'Course deleted',
    success: true,
    data: {},
  });
});
