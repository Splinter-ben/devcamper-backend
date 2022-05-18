const Bootcamp = require('../models/bootcamp.model'),
  ErrorResponse = require('../utils/errorResponse'),
  asyncHandler = require('../middleware/asyncHandler'),
  geocoder = require('../utils/geocoder'),
  path = require('path');

// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get a single bootcamp
// @route   GET /api/v1/bootcamp/:id
// @access  Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp found with _id of ${id}`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    GET bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide distance by radius of Earth
  // Earth radius = 3,963 miles or 6,378 km
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    CREATE a bootcamp
// @route   POST /api/v1/bootcamp
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The User with _id of ${req.user.id} has already published a Bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res
    .status(201)
    .json({ success: true, data: bootcamp, msg: 'Created a new bootcamp' });
});

// @desc    UPDATE a  bootcamp
// @route   PUT /api/v1/bootcamp/:id
// @access  Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp found with _id of ${id}`, 404));
  }

  // Make sure user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User _id of ${id} is not authorize to update this bootcamp`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, msg: `Update the bootcamp: ${id}` });
});

// @desc    DELETE a new  bootcamp
// @route   DELETE /api/v1/bootcamp/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp found with _id of ${id}`, 404));
  }

  // Make sure user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User _id of ${id} is not authorize to delete this bootcamp`,
        401
      )
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, msg: `Delete bootcamp: ${id}` });
});

// @desc    UPLOAD photo for  bootcamp
// @route   PUT /api/v1/bootcamp/:id/photo
// @access  Private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp found with _id of ${id}`, 404));
  }

  // Make sure user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User _id of ${id} is not authorize to update this bootcamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please uplaod a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (!file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
