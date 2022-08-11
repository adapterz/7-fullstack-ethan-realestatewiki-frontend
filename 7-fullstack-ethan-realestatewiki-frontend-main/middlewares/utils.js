// 쿠키 생성
export function getCookie(cName) {
  cName = cName + "=";
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cName);
  var cValue = "";
  if (start != -1) {
    start += cName.length;
    var end = cookieData.indexOf(";", start);
    if (end == -1) end = cookieData.length;
    cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}

// 쿠키 삭제
export function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function getParamMap(queryString) {
  let splited = queryString.replace("?", "").split(/[=?&]/);
  let param = {};
  for (let i = 0; i < splited.length; i++) {
    param[splited[i]] = splited[++i];
  }
  return param;
}
