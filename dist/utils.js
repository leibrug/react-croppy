'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clip = clip;
exports.multiply = multiply;
exports.assign = assign;
exports.isRetina = isRetina;
exports.getPixelRatio = getPixelRatio;
exports.getOffset = getOffset;
function clip(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function multiply(obj, n) {
  for (var key in obj) {
    obj[key] = n * obj[key];
  }
  return obj;
}

function assign(obj1, obj2) {
  Object.keys(obj2).forEach(function (key) {
    obj1[key] = obj2[key];
  });
  return obj1;
};

function isRetina() {
  return global.matchMedia('(-webkit-device-pixel-ratio: 2)').matches;
}

function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

function getOffset(elem) {
  // taken from the jquery source
  var rect = elem.getBoundingClientRect();
  var doc = elem.ownerDocument;
  var docElem = doc.documentElement;
  return {
    top: rect.top + global.pageYOffset - docElem.clientTop,
    left: rect.left + global.pageXOffset - docElem.clientLeft
  };
}