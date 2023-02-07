class FormLogin extends HTMLElement {
    constructor() {
        super();

        console.log('working -> ', this)

        fetch('src/components/form-login/FormLogin.html')
        .then(response => response.text())
        .then(text => this.innerHTML = text)
    }

    connectedCallback () {
        console.log('iniciou o componente')
    }

    disconnectedCallback () {
        console.log('destruiu o componente')
    }
}

const handleLogin = () => {
    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password').value;

    const user = {
        email,
        password
    }

    if (!verifyFormLoginFieldFill(email, password)) {
        openFormLoginRequiredFieldModal();
        return;
    }

    userAuthentication(user);
}

const userAuthentication = async(user) => {
    await window.login('http://localhost:3000/auth/login', user)
    .then(handleAuthenticationError)
    .then(response => response.json())
    .then(response => {
         localStorage.setItem('token', response.token);
         onNavigate('/dashboard')
    })
    .catch(errorTypeVerification)
}

const handleAuthenticationError = (response) => {
    if (response.ok) {
        return response;
    }

    throw new Error(response.statusText);
};

const errorTypeVerification = (error) => {
    if(error == 'Error: Not Found') {
        openFormLoginUserNotFoundModal();
    }
}

const openFormLoginUserNotFoundModal  = () => {
    const dialog = document.querySelector('.modal-user-not-found');
    dialog.click();
}

const verifyFormLoginFieldFill = (email, password) => email !== '' && password !== '';

const openFormLoginRequiredFieldModal = () => {
    const dialog = document.querySelector('.modal-required-field');
    dialog.click();
}

if('customElements' in window) {
    customElements.define('app-form-login', FormLogin)
}