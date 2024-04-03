class Validator {
  isUsername(username: string) {
    return /^[a-zA-Z0-9_]{6,20}$/.test(username);
  }

  isEmail(email: string) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  isPassword(password: string) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(password);
  }
}

export {
  Validator
}