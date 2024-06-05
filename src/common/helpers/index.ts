export const buildUsername = (firstName: string, lastName: string) => {
  const firstNameAbbr = firstName
    .split(/\s+/)
    .map((i) => i[0])
    .join("");

  return `${lastName}.${firstNameAbbr}`;
};
