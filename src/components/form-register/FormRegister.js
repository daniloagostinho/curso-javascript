class FormRegister extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        this.innerHTML = `
            <form>
                <div class="input-group mb-3">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Nome"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                />
                </div>

                <div class="input-group mb-3">
                <input
                    type="email"
                    class="form-control"
                    placeholder="Email"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                />
                </div>

                <div class="input-group mb-3">
                <input
                    type="number"
                    class="form-control"
                    placeholder="Idade"
                    aria-label="Age"
                    aria-describedby="basic-addon1"
                />
                </div>

                <div class="d-grid gap-2">
                <button
                    class="btn btn-primary btn-register btn-block"
                    type="button"
                    data-toggle="modal" 
                    data-target="#exampleModal">
                        CONTINUAR CADASTRO
                </button>
                </div>
        </form>    
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
    customElements.define('app-form-register', FormRegister);
}