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

let uploadedAvatar;

const loadValueInput = (name, email, age) => {
    document.querySelector('.nameInput').value = name
    document.querySelector('.emailInput').value = email
    document.querySelector('.ageInput').value = age
    setAvatar();
}
const verifyUserRegistrationData = () => {
    userRegistrationData = new Proxy({}, {
        set: function(target, property, value) {

            const name = value.name;
            const email = value.email;
            const age = value.age;

            loadValueInput(name, email, age);
            target[property] = value;
        }
    });
}

verifyUserRegistrationData();

const setAvatar = () => {
    const imgAvatar = document.querySelector('.avatar')
    imgAvatar.src = 'assets/images/avatar-default.png'
}

const onChange = (event) => {
    if(event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const reader = new FileReader();

      reader.onload = (e) => ( document.querySelector('.avatar').src = reader.result)

      reader.readAsDataURL(file)

      uploadedAvatar = file;
       
    }
}
const sendDataToBackend = async() => {
    const name = document.querySelector('.nameInput').value;
    const email = document.querySelector('.emailInput').value;
    const age = document.querySelector('.ageInput').value;
    const image = uploadedAvatar;
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

    console.log('payload', payload)

    if(checkEmptyModalFields(name, email, age, image, password, confirmPassword)) {
        if(checkPasswordEqual(password, confirmPassword)) {
            const btnCloseModal = document.querySelector('.btn-continuation-register')
            btnCloseModal.setAttribute("data-dismiss", "modal");  
            await window.registerUser('http://localhost:3000/auth/register/user', payload)
            .then(catchApiDialogError) 
            .then(response => response.json())
             .then(response => {
               alert('Cadastro realizado com sucesso!')
                onNavigate('/')
             })
             .catch(handleDialogErrorTypes)
        } else {
            return;
        }
    } else {
        alert('Por favor preencha os campos vazios!')
    }
}

const catchApiDialogError = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const handleDialogErrorTypes = (error) => {
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

const checkPasswordEqual = (password, confirmPassword) => {
    if(password !== confirmPassword) {
        const errorMessage = document.querySelector('.errorMessage')
        const btnCloseModal = document.querySelector('.btn-continuation-register')
        btnCloseModal.removeAttribute("data-dismiss");
        errorMessage.style.display = 'block'
        return false;
    }

    return true;
}

if('customElements' in window) {
    customElements.define('app-dialog-registration-continuation', DialogRegistrationContinuation);
}