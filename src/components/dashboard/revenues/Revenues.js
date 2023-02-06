class Revenues extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        fetch('src/components/dashboard/revenues/Revenues.html')
        .then(response=> response.text())
        .then(text=> this.innerHTML = text);
    }

    connectedCallback () {
		console.log('connected!', this);
	}

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}

isOpenDialogAddRevenues = {}

const openDialogAddRevenues = () => {
    const dialog = document.querySelector('.dialog-add-revenues');
    isOpenDialogAddRevenues.open = {
        isOpen: true
    }
    dialog.click();
}


if('customElements' in window) {
    customElements.define('app-revenues', Revenues);
}