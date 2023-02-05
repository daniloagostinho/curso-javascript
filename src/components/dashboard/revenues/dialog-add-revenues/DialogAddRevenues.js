class DialogAddRevenues extends HTMLElement {
  constructor() {
    super();
    console.log("contructor ", this);

    fetch(
      "src/components/dashboard/revenues/dialog-add-revenues/DialogAddRevenues.html"
    )
      .then((response) => response.text())
      .then((text) => (this.innerHTML = text));
  }

  connectedCallback() {}

  disconnectedCallback() {
    console.log("disconnected", this);
  }
}

const typeRevenues = [
  {
    name: "Investimento",
  },
  {
    name: "Outros",
  },
  {
    name: "Férias",
  },
  {
    name: "13 Sálario",
  },
  {
    name: "PLR",
  },
  {
    name: "Aposentaria",
  },
  {
    name: "Aluguel",
  },
  {
    name: "Salario",
  },
];

let valueDialogAddRevenues;

const createOptionBySelect = () => {
    const select = document.querySelector('select');
    typeRevenues.forEach(revenue => {
        const newOption = document.createElement('option');
        const optionText = document.createTextNode(revenue.name);
        newOption.appendChild(optionText);
        newOption.setAttribute('value', revenue.name);
        if(select.options.length <= 7) {
            select.appendChild(newOption);
        }
    })
}

const verifyIsOpenDialogAddRevenues = () => {
    isOpenDialogAddRevenues = new Proxy({}, {
        set: function(target, property, value) {

            console.log(target, property, value)
            createOptionBySelect();
            preventFutureDate();

            target[property] = value;
        }
    });
}

verifyIsOpenDialogAddRevenues();

const getValueCurrency = (event) => {
    const filterValue = event.target.value.replace(/\D/g, '');

    const currency =  new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL'
    }).format(parseFloat(filterValue / 100))

    event.target.value = currency;

    const replaceSymbol = currency.replace('R$', '');
    const replaceComma = replaceSymbol.replace(',', '.')
    valueDialogAddRevenues = replaceComma.trim();
}

const preventFutureDate = () => {
    const inputDate = this.document.querySelector('#dateEntry')

    let date = new Date();

    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    if(month < 10) {
      month = '0' + month.toString()
    }

    if(day < 10) {
      day = '0' + day.toString();
    }

    let maxDate = year + '-' + month + '-' + day;

    inputDate.max = maxDate;
}

const handleAddRevenues = (event) => {
    event.preventDefault();
    const typeRevenue = document.querySelector('.typeRevenue').value;
    const value = valueDialogAddRevenues;
    const dateEntry = document.querySelector('.dateEntry').value;
    const fixedRevenue = document.querySelector('.fixedRevenue').checked;

    const payload = {
        typeRevenue,
        value,
        dateEntry,
        fixedRevenue
    }

    console.log(payload);

}

if ("customElements" in window) {
  customElements.define("app-dialog-add-revenues", DialogAddRevenues);
}