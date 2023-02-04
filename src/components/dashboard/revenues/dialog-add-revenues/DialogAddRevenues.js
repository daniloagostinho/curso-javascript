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


const createOptionBySelect = () => {
    typeRevenues.forEach(revenue => {
        const newOption = document.createElement('option');
        const optionText = document.createTextNode(revenue.name);
        newOption.appendChild(optionText);
        newOption.setAttribute('value', revenue.name);
        const select = document.querySelector('select');
        select.appendChild(newOption);
    })
}

const verifyIsOpenDialogAddRevenues = () => {
    isOpenDialogAddRevenues = new Proxy({}, {
        set: function(target, property, value) {

            console.log(target, property, value)
            createOptionBySelect();

            target[property] = value;
        }
    });
}

verifyIsOpenDialogAddRevenues();

const getValueCurrency = (event) => {
    const filterValue = event.target.value.replace(/\D/g, '');

    event.target.value = new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL'
    }).format(parseFloat(filterValue / 100))

}


if ("customElements" in window) {
  customElements.define("app-dialog-add-revenues", DialogAddRevenues);
}
