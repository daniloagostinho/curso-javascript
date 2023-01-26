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

const loadValueInput = () => {
    if(values.length === 3) {
        document.querySelector('.nameInput').value = values[0]
        document.querySelector('.emailInput').value = values[1]
        document.querySelector('.ageInput').value = values[2]
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

if('customElements' in window) {
    customElements.define('app-dialog-registration-continuation', DialogRegistrationContinuation);
}