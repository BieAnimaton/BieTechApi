const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.nome = !isEmpty(data.nome) ? data.nome : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.senha = !isEmpty(data.senha) ? data.senha : "";
  data.senha2 = !isEmpty(data.senha2) ? data.senha2 : "";

  // Name checks
  if (Validator.isEmpty(data.nome)) {
    errors.nome = "Name field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.senha)) {
    errors.senha = "Password field is required";
  }

  if (Validator.isEmpty(data.senha2)) {
    errors.senha2 = "Confirm password field is required";
  }

  if (!Validator.isLength(data.senha, { min: 6, max: 30 })) {
    errors.senha = "Password must be at least 6 characters";
  }

  if (!Validator.equals(data.senha, data.senha2)) {
    errors.senha2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
