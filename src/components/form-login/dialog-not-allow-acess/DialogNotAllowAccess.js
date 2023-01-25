class DialogNotAllowAccess extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        this.innerHTML = `
        <button type="button" class="btn btn-primary by-modal" data-toggle="modal" data-target="#exampleModal" style="display: none;">
            Launch demo modal
        </button>

        <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Sem permissão de cesso</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Você não possui permissão para acessar o dashboard. Tente criar um cadastro!
                </div>
                </div>
            </div>
            </div>    
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
    customElements.define('app-dialog-not-allow-access', DialogNotAllowAccess);
}