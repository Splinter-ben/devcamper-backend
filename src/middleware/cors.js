let whitelist = ['http://localhost:5000', 'http://localhost:4200', 'http://localhost:8100'];

let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

module.export = corsOptions;
