import { CONTROLLER } from './constants.js';

export const arraysEqual = (a, b) => {
  return !!a && !!b && !(a<b || b<a);
};

export const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const wait = t => new Promise(ok => setTimeout(ok, t));

export const getController = devices => devices.find(device => {
  return device.vendorId === CONTROLLER.vid && device.productId === CONTROLLER.pid;
});
