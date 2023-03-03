class DialogUpdateRevenues extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        fetch('src/components/dashboard/revenues/dialog-update-revenues/DialogUpdateRevenues.html')
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

const typeUpdateRevenues = [
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

const checkUpdateRevenues = () => {
    window.revenueSave = new Proxy({}, {
        set: function(target, property, value) {

            fillForm(value)
            target[property] = value;
        }
    });
}

const fillForm = (revenue) => {
    const {typeRevenue, value, dateEntry} = revenue;
    const dateToInsertField = new Date(dateEntry);
    const formattedDate = dateToInsertField.toISOString().substring(0, 10)

    createSelectUpdateElement(typeRevenue);

    document.querySelector('.value').value = value;
    document.querySelector('.dateUpdateEntry').value = formattedDate;
    
}

checkUpdateRevenues();

const createSelectUpdateElement = (optionSelected) => {
    // criar o elemento select
    const select = document.createElement('select');
    
    // adicionar classes CSS ao select
    select.classList.add('form-control');
    select.classList.add('typeRevenue');
    
    // criar um elemento label e adicionar ao container
    const label = document.createElement('label');
    label.textContent = 'Tipo de Receita';
    document.querySelector('.select-update-container').appendChild(label);

    
    // criar a primeira opção (selecionada por padrão)
    const optionUpdateSelected = document.createElement('option');
    optionUpdateSelected.selected = true;
    optionUpdateSelected.textContent = optionSelected;
    
    // criar as outras opções com base em um array de objetos
    const options = typeUpdateRevenues
        .filter((_, index) => index <= 7) // filtrar apenas as primeiras 8 opções
        .filter(revenue => revenue.name !== optionSelected)
        .map(revenue => {
            // criar um elemento option para cada tipo de receita
            const option = document.createElement('option');
            option.textContent = revenue.name;
            option.value = revenue.name;
            return option;
        });

    select.append(optionUpdateSelected);
    select.append(...options);
    
    // adicionar o select ao container
    document.querySelector('.select-update-container').appendChild(select);
  }

if('customElements' in window) {
    customElements.define('app-dialog-update-revenues', DialogUpdateRevenues);
}