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
            getRegisterRevenues();
        }, 1000)
	}

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}


let monthSelected;

const defineInitMonth = () => {
    let date = new Date();
    let dateString = date.toLocaleDateString('pt-br', {month: 'long'})
    let letterDateString = dateString[0].toUpperCase() + dateString.substring(1)
    monthSelected == undefined ? (monthSelected = letterDateString) : monthSelected
  }

const getRegisterRevenues = async () => {
    const user = localStorage.getItem('user');
    window.getRegisterRevenues('http://localhost:3000/list/revenues', monthSelected, user)
        .then(response => response.json())
        .then(response => {
            let arr = [];
            if(response.result.length === 0) {
            } else {
                response.result.forEach(revenue => {
                    arr.push(revenue.user.month.listMonth)
                })
            }
            populateTable(arr);
        })
}


const populateTable = (arr) => {
    const thead = document.querySelector(".table thead");
    const titlesTable = ["Tipo de Receita", "Valor", "Data de Entrada", "Id", "Ações"];

    const headerRow = document.createElement("tr");

    titlesTable.forEach(title => {
        const headerCell = document.createElement("th");
        headerCell.textContent = title;
        headerRow.appendChild(headerCell);
    });

    thead.appendChild(headerRow);

    const tbody = document.querySelector('table tbody');

    arr.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.typeRevenue}</td>
            <td>${item.value}</td>
            <td>${item.dateEntry}</td>
            <td>${item._id}</td>
            <td>
                <img class="image" src="${item.actions[0]}" />
                <img class="image" src="${item.actions[1]}" />
            </td>
        `;
        tbody.appendChild(tr);
    });
}
const checkAddRevenues = () => {
    addRevenues = new Proxy({}, {
        set: function(target, property, value) {

            getRegisterRevenues();

            console.log(target, property, value)
            target[property] = value;
        }
    });
}

checkAddRevenues();

const openDialogAddRevenues = () => {
    const dialog = document.querySelector('.dialog-add-revenues');
    window.isOpenDialogAddRevenues.open = {
        isOpen: true
    }
    dialog.click();
}


if('customElements' in window) {
    customElements.define('app-revenues', Revenues);
}