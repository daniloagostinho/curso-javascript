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

if('customElements' in window) {
    customElements.define('app-form-register', FormRegister);
}