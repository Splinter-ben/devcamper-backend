require('dotenv').config();
require('colors');

const fs = require('fs'),
  Bootcamp = require('./src/models/bootcamp.model'),
  Course = require('./src/models/course.model'),
  User = require('./src/models/user.model'), 
  connectDB = require('./src/database/atlas');

// Connect to BDD
connectDB();

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf8')
);

// Import into BDD
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);

    console.log('data imported into database'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error, 'data failed to be imported'.red.bold);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();

    console.log('data deleted from database'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error, 'data failed to be deleted'.magenta.bold);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
