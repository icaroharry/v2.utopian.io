import ext from "./utils/ext";
import storage from "./utils/storage";
import jquery from 'jquery';
window.$ = window.jquery = jquery;
import Popper from 'popper.js';
import 'bootstrap';
import { setCookie } from './utils/helpers'

const popup = document.getElementById("app");

storage.get('color', (resp) => {
  const color = resp.color;
  if(color) {
    popup.style.backgroundColor = color
  }
});

window.onload = async () => {
  await setCookie()
  const token = localStorage.getItem('token')
  if (!token) console.log('User is not logged in')
  else console.log('User is logged in')
}

const optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", (e) => {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
})
