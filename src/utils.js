export const arraysEqual = (a, b) => {
  return !!a && !!b && !(a<b || b<a);
};

export const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
