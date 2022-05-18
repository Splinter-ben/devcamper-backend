const { json } = require('express');

require('colors');

// CONST
const express = require('express'),
  path = require('path'),
  PORT = process.env.PORT,
  bootcampRouter = require('./routes/bootcamp.route'),
  courseRouter = require('./routes/course.route'),
  authenticationRouter = require('./routes/authentication.route'),
  morgan = require('morgan'),
  corsOptions = require('./middleware/cors'),
  fileUpload = require('express-fileupload'),
  cookieParser = require('cookie-parser'),
  errorHandler = require('./middleware/error'),
  cors = require('cors'),
  connectDB = require('./database/atlas'),
  app = express();

// Body Parser
app.use(json());

// Enable CORS
app.use(cors(corsOptions));

// Cookie parser
app.use(cookieParser());

// Morgan Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// File uploading
app.use(fileUpload());

// Set static floder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1', bootcampRouter, courseRouter, authenticationRouter);

// Errors
app.use(errorHandler);

// Database
connectDB();

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode, on port: ${PORT}`.yellow
      .bold
  )
);

// Handle rejections
/* process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Clsoe server & exit process
  server.close(() => process.exit(1));
}); */
