class Dashboard extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        fetch("src/components/dashboard/Dashboard.html")
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

if('customElements' in window) {
    customElements.define('app-dashboard', Dashboard);
}