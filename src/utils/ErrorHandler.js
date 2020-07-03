// Input: error object
// Output: html string to be displayed.
function ErrorHandler(err) {
  console.log(err);
  switch (err.name) {

    default:
      console.log(err.message);
      return "";
  }
};

export default ErrorHandler;