function validateEmail(email) {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,2}))$/;
  if (re.test(email));
}
function validatePassword(password) {
  var re = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{10,40})$/;
  return re.test(password);
}

export { validateEmail, validatePassword };
