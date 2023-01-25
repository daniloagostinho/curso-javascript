class Dashboard extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        this.innerHTML = `
            <h1>Bem vindo ao dashboard</h1>
        `
    }

    connectedCallback () {
		console.log('connected!', this);
	}

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}

if('customElements' in window) {
    customElements.define('app-dashboard', Dashboard);
}