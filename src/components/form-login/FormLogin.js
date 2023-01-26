class FormLogin extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        fetch('src/components/form-login/FormLogin.html')
        .then(response=> response.text())
        .then(text=> this.innerHTML = text);
    }

    connectedCallback () {
		console.log('connected!', this);

	}

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}

 const handleLogin = async () => {
    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password').value;

    const username = {
        email, 
        password
    }

    if(email !== '' && password !== '') {
       await window.login('http://localhost:3000/auth/login', username)
       .then(catchApiError)
        .then(response => response.json())
        .then(response => {
            localStorage.setItem('token', response.token)
            onNavigate('/dashboard')
        })
        .catch(handleErrorTypes)
    }

}


const catchApiError = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const handleErrorTypes = (error) => {
    if(error == 'Error: Not Found') {
        openModalUserNotFound();
        console.log('usuario nao encontrado!!')
    }
}

const openModalUserNotFound = () => {
    const dialog = document.querySelector('.modal-user-not-found')
    dialog.click();
}

if('customElements' in window) {
    customElements.define('app-form-login', FormLogin);
}