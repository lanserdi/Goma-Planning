"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dealDateNumber = dealDateNumber;

function dealDateNumber(num) {
  num = '' + num;
  return num.charAt(1) ? num : '0' + num;
}