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

userRegistrationData = {}

let nameInputValue;
let emailInputValue;
let ageInputValue;

async function handleFormRegister() {
    nameInputValue = document.querySelector('.nameInputValue').value;
    emailInputValue = document.querySelector('.emailInputValue').value;
    ageInputValue = document.querySelector('.ageInputValue').value;
   
    setUserRegistrationData(nameInputValue, emailInputValue, ageInputValue)

    if(verifyEmptyValue(nameInputValue, emailInputValue, ageInputValue)) {
        openDialogContinuationRegistration();
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

const setUserRegistrationData = (name, email, age) => {
    userRegistrationData.data = {
        name, 
        email,
        age
    }
}

const openDialogContinuationRegistration = () => {
    const dialog = document.querySelector('.dialog-continuation-registration')
    dialog.click();
}

if('customElements' in window) {
    customElements.define('app-form-register', FormRegister);
}