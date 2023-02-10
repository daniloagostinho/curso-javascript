class DialogContinuationRegistration extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        fetch('src/components/form-register/dialog-continuation-registration/DialogContinuationRegistration.html')
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
let password;
let confirmPassword;

const loadValueInput = (name, email, age) => {
    document.querySelector('.nameInput').value = name
    document.querySelector('.emailInput').value = email
    document.querySelector('.ageInput').value = age
    setAvatar();
}
// carrega os dados do formulário anterior
const verifyUserRegistrationData = () => {
    window.userRegistrationData = new Proxy({}, {
        set: function(target, property, value) {

            console.log(target, property, value)

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
    imgAvatar.src = 'https://raw.githubusercontent.com/daniloagostinho/curso-angular15-na-pratica/main/src/assets/images/default.png'
}

const uploadAvatar = (event) => {
    if(event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const reader = new FileReader();

      reader.onload = (e) => ( document.querySelector('.avatar').src = reader.result)

      reader.readAsDataURL(file)

      uploadedAvatar = file;
       
    }
}

const sendDataToBackend = async() => {
    const extractValues = extractInputValues();

    const payload = {
        name: extractValues.name,
        email: extractValues.email,
        age: extractValues.age, 
        image: extractValues.image,
        password: extractValues.password,
        confirmPassword: extractValues.confirmPassword
    }
    
    if(!emptyFieldsCheck(extractValues.name, extractValues.email, extractValues.age, extractValues.image, extractValues.password, extractValues.confirmPassword)) {
        const btnCloseModal = document.querySelector('.btn-continuation-register')
        btnCloseModal.removeAttribute("data-dismiss");
        alert('Por favor preencha os campos vazios!');
        return;
    }

    if(checkPasswordMatch(password, confirmPassword)) {
        const btnCloseModal = document.querySelector('.btn-continuation-register')
        btnCloseModal.setAttribute("data-dismiss", "modal");  
        registerUser(payload)
    }
}

const extractInputValues = () => {
    const name = document.querySelector('.nameInput').value;
    const email = document.querySelector('.emailInput').value;
    const age = document.querySelector('.ageInput').value;
    const image = uploadedAvatar;
    const password = document.querySelector('.passwordInput').value;
    const confirmPassword = document.querySelector('.confirmPasswordInput').value;

    return {
        name,
        email,
        age,
        image,
        password,
        confirmPassword
    }
}

const registerUser = async (payload) => {
    await window.registerUser('http://localhost:3000/auth/register/user', payload)
    .then(captureErrorOnUserRegistration) 
    .then(response => response.json())
     .then(response => {
        localStorage.setItem('userInfo', JSON.stringify(response.user))
       alert('Cadastro realizado com sucesso!')
        onNavigate('/')
     })
     .catch(checkErrorType)
}

const getPasswordValue = (event) => {
    password = event.target.value
    isPasswordMatch();
    verifyPasswordMismatch();
}

const getPasswordConfirmationValue = (event) => {
    confirmPassword = event.target.value
    isPasswordMatch();
    verifyPasswordMismatch();
}

const isPasswordMatch = () => {
    if(password !== '' && confirmPassword !== '' && password == confirmPassword) {
        hideErrorMessage()
        return true;
    }

    return false;
}

const verifyPasswordMismatch = () => {
    if(password !== '' && confirmPassword !== '' && password != confirmPassword) {
        showErrorMessage();
        configCloseModalRemove();
    }
}

const captureErrorOnUserRegistration = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const checkErrorType = (error) => {
    if(error == 'Error: Unprocessable Entity') {
        alert('Já existe uma conta com esse e-mail!')
    }
}

const showErrorMessage = () => {
    const errorMessage = document.querySelector('.errorMessage')
    errorMessage.style.display = 'block';
}

const hideErrorMessage = () => {
    const errorMessage = document.querySelector('.errorMessage')
    errorMessage.style.display = 'none';
}

const configCloseModalRemove = () => {
    const btnCloseModal = document.querySelector('.btn-continuation-register')
    btnCloseModal.removeAttribute('data-dismiss')
}

const emptyFieldsCheck = (name, email, age, image, password, confirmPassword) => name !== '' 
    && email !== ''
    && age !== ''
    && image !== undefined 
    && password
    && confirmPassword;

const checkPasswordMatch = (password, confirmPassword) => {
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
    customElements.define('app-dialog-continuation-registration', DialogContinuationRegistration);
}