export function formatPhoneNumber(number) {
  var codes = number.match(/^(\d{3})(\d{3})(\d{4})$/);
  return "(" + codes[1] + ") " + codes[2] + "-" + codes[3];
}