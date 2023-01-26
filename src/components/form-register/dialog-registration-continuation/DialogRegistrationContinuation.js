class DialogRegistrationContinuation extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        fetch('src/components/form-register/dialog-registration-continuation/DialogRegistrationContinuation.html')
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

let userRegistrationDataDialogRegistrationContinuation = {};

const loadValueInput = () => {
    if(values.length === 3) {
        document.querySelector('.nameInput').value = values[0]
        document.querySelector('.emailInput').value = values[1]
        document.querySelector('.ageInput').value = values[2]
        setAvatar();
    }
}
const verifyuserRegistrationData = () => {
    userRegistrationData = new Proxy({}, {
        set: function(target, property, value) {
            values.push(value)
            loadValueInput();
            target[property] = value;
        }
    });
}

verifyuserRegistrationData();

const setAvatar = () => {
    const imgAvatar = document.querySelector('.avatar')
    console.log(imgAvatar)
    imgAvatar.src = 'assets/images/avatar-default.png'
}

const onChange = (event) => {
    if(event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const reader = new FileReader();

      reader.onload = (e) => ( document.querySelector('.avatar').src = reader.result)

      reader.readAsDataURL(file)

      userRegistrationDataDialogRegistrationContinuation.image = file;
       
    }
}
const sendDataToBackend = async() => {
    const name = document.querySelector('.nameInput').value;
    const email = document.querySelector('.emailInput').value;
    const age = document.querySelector('.ageInput').value;
    const image = userRegistrationDataDialogRegistrationContinuation.image;
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
       .then(catchApiDialogRegistrationContinuationError) 
       .then(response => response.json())
        .then(response => {
           onNavigate('/')
        })
        .catch(handleDialogRegistrationContinuationErrorTypes)
    } else {
        alert('Por favor preencha os campos vazios!')
    }
}

const catchApiDialogRegistrationContinuationError = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const handleDialogRegistrationContinuationErrorTypes = (error) => {
    if(error == 'Error: Unprocessable Entity') {
        alert('Já existe uma conta com esse e-mail!')
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