class FormRegister extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)
        
        fetch("src/components/form-register/FormRegister.html")
        .then(response=> response.text())
        .then(text=> this.innerHTML = text)
    }

    connectedCallback () {
		console.log('connected!', this);
	}

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}

userRegistrationData = {
    name: '',
    email: '',
    age: ''
}

async function handleFormRegister() {
    const name = document.querySelector('.name').value;
    const email = document.querySelector('.email-register').value;
    const age = document.querySelector('.age').value;

    // const username = {
    //     email, 
    //     password
    // }

    if(verifyEmptyValue(name, email, age)) {
        setuserRegistrationData(name, email, age)
        openDialogRegistrationContinuation();
    } else {
        openDialogRequiredField();
    }

}
const verifyEmptyValue = (name, email, age) => {
    if(name !== '' && email !== '' && age !== '') {
        return true;
    }

    return false;
}

const openDialogRequiredField = () => {
    const dialog = document.querySelector('.modal-required-field')
    dialog.click();
}

const setuserRegistrationData = (name, email, age) => {
    userRegistrationData.name = name;
    userRegistrationData.email = email;
    userRegistrationData.age = age;
}

const openDialogRegistrationContinuation = () => {
    const dialog = document.querySelector('.modal-registration-continuation')
    dialog.click();
}

if('customElements' in window) {
    customElements.define('app-form-register', FormRegister);
}