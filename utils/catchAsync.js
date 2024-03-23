module.exports = (fn) => {
  return (req, res, next) => {
    //function passed in will be of async type so we could handle the error using .catch
    fn(req, res, next).catch((err) => next(err));
    //fn(req, res, next).catch((err) => next(err)); // same as above
  };
};
