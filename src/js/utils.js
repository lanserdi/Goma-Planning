export function dealDateNumber(num){
  num = '' + num;
  return num.charAt(1) ? num : '0' + num;
}