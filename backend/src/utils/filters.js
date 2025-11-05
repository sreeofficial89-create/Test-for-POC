const matchesString = (value, query) => {
  if (!query) return true;
  if (!value) return false;
  return String(value).toLowerCase() === String(query).toLowerCase();
};

const matchesPartial = (value, query) => {
  if (!query) return true;
  if (!value) return false;
  return String(value).toLowerCase().includes(String(query).toLowerCase());
};

module.exports = {
  matchesString,
  matchesPartial,
};
