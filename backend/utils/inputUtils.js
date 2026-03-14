// parameterList contains the list of the names of the keys needed in params
export function checkFields(params, parameterList) {
  const length = params ? Object.keys(params).length : 0;
  if (length < parameterList.length) {
    return "The number of parameters is incorrect!";
  }

  for (const field of parameterList) {
    if (!(field in params)) {
      return `${field} is required`;
    }
  }
  return "";
}