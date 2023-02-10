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
            defineInitMonth();
            loadingTable();
        }, 1000)
	}

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}

isOpenDialogAddRevenues = {};
let monthSelected;

const defineInitMonth = () => {
    let date = new Date();
    let dateString = date.toLocaleDateString('pt-br', {month: 'long'})
    let letterDateString = dateString[0].toUpperCase() + dateString.substring(1)
    monthSelected ==  undefined ? (this.monthSelected = letterDateString) : this.monthSelected
  }

const getRegisterRevenues = async () => {
    const user = localStorage.getItem('userinfo');
    window.getRegisterRevenues('http://localhost:3000/list/revenues', monthSelected, user)
        .then(response => response.json())
        .then(response => console.log(response))
}

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

    getRegisterRevenues();
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