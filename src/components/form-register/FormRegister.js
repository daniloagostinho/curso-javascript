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

const handleFormRegister = () => {
    const nameInputValue = document.querySelector('.nameInputValue').value;
    const emailInputValue = document.querySelector('.emailInputValue').value;
    const ageInputValue = document.querySelector('.ageInputValue').value;
   
    setUserRegistrationData(nameInputValue, emailInputValue, ageInputValue)
    

    if(!verifyFormRegisterFieldFill(nameInputValue, emailInputValue, ageInputValue)) {
        openDialogRequiredField();
        return;
    }

    continueRegistrationModal();
}

const verifyFormRegisterFieldFill = (name, email, age) => name !== '' && email !== '' && age !== '';

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

const continueRegistrationModal = () => {
    const dialog = document.querySelector('.dialog-continuation-registration')
    dialog.click();
}

if('customElements' in window) {
    customElements.define('app-form-register', FormRegister);
}