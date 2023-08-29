export function parsePhone(phone: any) {
  let phoneParsed = '+7';
  if (phone.slice(0, 2) === '+7')
    phoneParsed = phoneParsed + `(${phone.slice(2, 5)})${phone.slice(5, 12)}`;
  else if (phone.slice(0, 1) === '8' || phone.slice(0, 1) === '7')
    phoneParsed = phoneParsed + `(${phone.slice(1, 4)})${phone.slice(4, 11)}`;

  else
    phoneParsed = phoneParsed + `(${phone.slice(0, 3)})${phone.slice(3, 10)}`;
  return phoneParsed;
}
