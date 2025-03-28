export const validate = (req, res) => {
  const { username, email, password } = req.body;

  const arrRegexValidations = {
    usernameRegex: /^[a-zA-Z0-9_]{3,16}$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    passwordRegex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  };

  const regexRules = {
    usernameRegexRule:
      "Username must be between 3 and 16 characters.\nWith numbers or letters.",
    emailRegexRule:
      "One or more characters that are not whitespace or @ at the beginning (^[^s@]+).\nFollowed by an @ symbol (@).\nFollowed by one or more characters that are not whitespace or @ ([^s@]+).\nFollowed by a . symbol (.).\nFollowed by one or more characters that are not whitespace or @ at the end ([^s@]+$).",
    passwordRegexRule:
      "Minimum Length: At least 8 characters.\nUppercase: At least one uppercase letter (A-Z).\nLowercase: At least one lowercase letter (a-z).\nNumber: At least one digit (0-9).\nSpecial Character: At least one special character from the set @$!%*?&.\n",
  };

  if (!password || !username) {
    return res.status(422).json({ error: "please add all the fields" });
  }

  if (!arrRegexValidations.usernameRegex.test(username)) {
    return res.status(422).json({ error: regexRules.usernameRegexRule });
  }

  if (!arrRegexValidations.emailRegex.test(email)) {
    return res.status(422).json({ error: regexRules.emailRegexRule });
  }

  if (!arrRegexValidations.passwordRegex.test(password)) {
    return res.status(422).json({ error: regexRules.passwordRegexRule });
  }
};
