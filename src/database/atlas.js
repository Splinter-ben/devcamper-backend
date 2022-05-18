const mongoose = require('mongoose');

// Atlas mongoDB
const URI = `mongodb+srv://${process.env.DB_HOST_ATLAS}:${process.env.DB_PASSWORD}@mongocluster-h3gqv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectDB = async () => {
  const conn = await mongoose.connect((mongo_uri = URI), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
