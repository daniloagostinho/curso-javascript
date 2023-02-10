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
        setTimeout(() => {
            loadingTable();
        }, 1000)
	}

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}

isOpenDialogAddRevenues = {};

const loadingTable = () => {
    const table = document.querySelector(".table thead");
    const titlesTable = ["Tipo de Receita", "Valor", "Data de Entrada", "Id", "Ações"];

    const headerRow = document.createElement("tr");

    titlesTable.forEach(title => {
        const headerCell = document.createElement("th");
        headerCell.textContent = title;
        headerRow.appendChild(headerCell);
    });

    table.appendChild(headerRow);
}

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