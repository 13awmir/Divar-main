function notFoundHandler(app) {
  app.use((req, res, next) => {
    res.status(404).json({
      message: "Not found Route",
    });
  });
}

module.exports = notFoundHandler;
