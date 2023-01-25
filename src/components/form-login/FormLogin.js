class FormLogin extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        this.innerHTML = `
            <form>
                <div class="input-group mb-3">
                <input
                    type="email"
                    class="form-control email"
                    placeholder="E-mail"
                    aria-label="email"
                    aria-describedby="email"
                />
                </div>
            
                <div class="input-group mb-3">
                <input
                    type="password"
                    class="form-control password"
                    placeholder="Senha"
                    aria-label="password"
                    aria-describedby="password"
                />
                </div>
            
                <div class="d-grid gap-2">
                <button class="btn btn-primary btn-login btn-block" onclick="handleLogin(); return false">
                    ENTRAR
                </button>
                </div>
            
                <p class="text-custom">
                Se você ainda não tiver os dados de login, será necessário realizar um
                cadastro.
                </p>
            </form>
                    
            <app-dialog-user-not-found></app-dialog-user-not-found>
        `
    }

    connectedCallback () {
		console.log('connected!', this);

	}

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}

async function handleLogin() {
    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password').value;

    const username = {
        email, 
        password
    }

    if(email !== '' && password !== '') {
       await window.login('http://localhost:3000/auth/login', username)
       .then(handleErrors)
        .then(response => response.json())
        .then(response => {
            localStorage.setItem('token', response.token)
            onNavigate('/dashboard')
        })
        .catch(typeOfErros)
    }

}


const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const typeOfErros = (error) => {
    if(error == 'Error: Not Found') {
        openDialogUserNotFound();
        console.log('usuario nao encontrado!!')
    }
}

const openDialogUserNotFound = () => {
    const dialog = document.querySelector('.modal-user-not-found')
    dialog.click();
}

if('customElements' in window) {
    customElements.define('app-form-login', FormLogin);
}