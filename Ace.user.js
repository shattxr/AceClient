// ==UserScript==
// @name         ACE CLIENT RM
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  testing
// @author       shattxr
// @match        https://starblast.io/
// @grant        none
// @run-at       document-start
// ==/UserScript==

document.open();
document.write('');
document.close();
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://shattxr.github.io/AceClient/");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 0x4) {
    document.open();
    document.write(xhr.responseText);
    document.close();
  }
};
xhr.send();