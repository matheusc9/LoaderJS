const { ipcRenderer } = require("electron");

function main() {
    show('.launchPage', false);
    show('.loginPage', true);
    show('.loadingPage', false);
} main();

function show(selector, bool) {
    const element = document.querySelector(selector);
    if (!element) return;
    element.classList.toggle('hidden', !bool);
}

// LOGIN PAGE
function loginPage() {
    show('.launchPage', false);
    show('.loginPage', true);
    show('.loadingPage', false);
    show('header', true);
}
const msgLogin = document.querySelector('#msgLogin');
function login() {
    const user = document.querySelector('#userTxt');
    const pass = document.querySelector('#passTxt');

    if (user.value.trim() === 'adm' && pass.value.trim() === '123') {
        loadingPage('.loginPage', launchPage, 5);
    } else {
        msgLogin.textContent = 'Invalid credentials!';
        msgLogin.style.color = 'maroon';

        // Limpa os valores dos inputs
        user.value = '';
        pass.value = '';

        // Dá foco no input do usuário
        user.focus();
    }
}


const header = document.querySelector('header');
const loadLabel = document.querySelector('#loadLabel');
function loadingPage(origin, target, seconds = 1, string = 'Loading...') {
    // Esconde header e a página de origem; mostra a tela de loading
    show('header', false);
    show(origin, false);
    show('.loadingPage', true);

    loadLabel.textContent = string;

    setTimeout(() => {
    // some a tela de loading ao finalizar
    show('.loadingPage', false);

    if (typeof target === 'function') {
        target();               // executa a função de destino
    } else if (typeof target === 'string') {
        show(target, true);     // ou mostra o seletor de destino
    } else {
        console.warn('target deve ser função ou seletor (string).');
    }
    }, seconds * 1000);
}

// LAUNCH PAGE
function launchPage() {
    show('header', true);
    show('.loadingPage', false);
    show('.launchPage', true);
    loadAccInfo();
    loadGameInfo();
}

const accInfo = document.querySelector('#accInfo')
let gameSelected = null;
const statusLabel = document.querySelector('#statusLabel');

function loadGameInfo() {
    let status = getStatus();
    statusLabel.textContent = status;

    if (status == 'Working') {
        statusLabel.style.color = 'green';
    } else {
        statusLabel.style.color = 'red';
    }
}

function loadAccInfo() {
    const userName = document.querySelector('#userTxt').value.toString().trim();
    const nameInfo = document.createElement('p');
    const dateInfo = document.createElement('p');
    const licenseInfo = document.createElement('p');
    let dataCurrent = new Date().getHours();

    nameInfo.textContent = `Name: ${userName}`;
    dateInfo.textContent = `Last use: ${dataCurrent} hours ago`;
    licenseInfo.textContent = `License: Lifetime`;
    
    accInfo.appendChild(nameInfo);
    accInfo.appendChild(dateInfo);
    accInfo.appendChild(licenseInfo);
}

function getStatus() {
    let status = 'Working';
    return status;
}

function launch() {
  loadingPage('.launchPage', () => {
    ipcRenderer.invoke("launch-exe");
  }, 5, 'Launching...');
}

