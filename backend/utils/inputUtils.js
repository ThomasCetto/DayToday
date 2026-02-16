export function checkFields(body, parameterList) {
  for (const field of parameterList) {
    if (!body[field]) {
      return `${field} is required`;
    }
  }
  return "";
}