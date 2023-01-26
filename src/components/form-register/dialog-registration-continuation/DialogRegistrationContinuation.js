class DialogRegistrationContinuation extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        fetch("src/components/form-register/dialog-registration-continuation/DialogRegistrationContinuation.html")
        .then(response=> response.text())
        .then(text=> this.innerHTML = text);
    }

    connectedCallback () {
		
	}

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}

const values = [];

let stateDialogRegistrationContinuation = {};

const loadValueInput = () => {
    if(values.length === 3) {
        document.querySelector('.nameInput').value = values[0]
        document.querySelector('.emailInput').value = values[1]
        document.querySelector('.ageInput').value = values[2]
        setAvatar();
    }
}
const verifyState = () => {
    state = new Proxy({}, {
        set: function(target, property, value) {
            // do something
            values.push(value)
            console.log(values)
            loadValueInput();
            target[property] = value;
        }
    });
}

verifyState();

const setAvatar = () => {
    const imgAvatar = document.querySelector('.avatar')
    console.log(imgAvatar)
    imgAvatar.src = "assets/images/avatar-default.png"
}

const onChange = (event) => {
    if(event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const reader = new FileReader();

      reader.onload = (e) => ( document.querySelector('.avatar').src = reader.result)

      reader.readAsDataURL(file)

      stateDialogRegistrationContinuation.image = file;
       
    }
}
const handleRegisterContinuation = async() => {
    const name = document.querySelector('.nameInput').value;
    const email = document.querySelector('.emailInput').value;
    const age = document.querySelector('.ageInput').value;
    const image = stateDialogRegistrationContinuation.image;
    const password = document.querySelector('.passwordInput').value;
    const confirmPassword = document.querySelector('.confirmPasswordInput').value;

    const payload = {
        name,
        email,
        age, 
        image,
        password,
        confirmPassword
    }

    if(checkEmptyModalFields(name, email, age, image, password, confirmPassword)) {
       await window.registerUser('http://localhost:3000/auth/register/user', payload)
        .then(response => response.json())
        .then(response => {
           onNavigate('/')
        })
    } else {
        alert('Por favor preencha os campos vazios!')
    }
}

const checkEmptyModalFields = (name, email, age, image, password, confirmPassword) => {
    if(
        name !== ''
        && email !== ''
        && age !== ''
        && image !== ''
        && password
        && confirmPassword) {
        return true;
    }

    return false;
}

if('customElements' in window) {
    customElements.define('app-dialog-registration-continuation', DialogRegistrationContinuation);
}