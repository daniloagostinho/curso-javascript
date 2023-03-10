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

  connectedCallback() {
    setTimeout(() => {
      createSelectElement();
    }, 1000)
  }

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

let months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
]

let valueDialogAddRevenues;
let setStoreRevenues = {};


let monthDialogAddRevenues;

const createSelectElement = () => {
  // criar o elemento select
  const select = document.createElement('select');
  
  // adicionar classes CSS ao select
  select.classList.add('form-control');
  select.classList.add('typeRevenue');
  
  // criar um elemento label e adicionar ao container
  const label = document.createElement('label');
  label.textContent = 'Tipo de Receita';
  document.querySelector('.select-container').appendChild(label);
  
  // criar a primeira opção (selecionada por padrão)
  const optionSelected = document.createElement('option');
  optionSelected.selected = true;
  optionSelected.textContent = 'Selecione o tipo de receita';
  
  // criar as outras opções com base em um array de objetos
  const options = typeRevenues
      .filter((_, index) => index <= 7) // filtrar apenas as primeiras 8 opções
      .map(revenue => {
          // criar um elemento option para cada tipo de receita
          const option = document.createElement('option');
          option.textContent = revenue.name;
          option.value = revenue.name;
          return option;
      });
  
  // adicionar a primeira opção e as demais ao select
  select.append(optionSelected);
  select.append(...options);
  
  // adicionar o select ao container
  document.querySelector('.select-container').appendChild(select);
}

const checkAddRevenuesModalOpen = () => {
    window.isOpenDialogAddRevenues = new Proxy({}, {
        set: function(target, property, value) {

            console.log(target, property, value)
            disableFutureDates();

            target[property] = value;
        }
    });
}


checkAddRevenuesModalOpen();

const formatCurrency = (event) => {
    const filterValue = event.target.value.replace(/\D/g, '');

    const currency = new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL'
    }).format(parseFloat(filterValue / 100))

    event.target.value = currency;

    valueDialogAddRevenues = parseFloat(filterValue / 100);

    console.log(valueDialogAddRevenues);
    
}

const disableFutureDates = () => {
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

const handleAddRevenues = async (event) => {
  event.preventDefault();

  const { typeRevenue, value, dateEntry, fixedRevenue } = selectInputsDom();

  if (!verifyFieldFill(typeRevenue, value, dateEntry, fixedRevenue)) {
    const buttonAddRevenues = document.querySelector('.add-revenues')
    buttonAddRevenues.removeAttribute('data-dismiss');
    alert("Preencha os campos vazios!");
    return;
  }

  fixedRevenue ? registerFixedRecipe() : registerMonthlyRecipe() ;
};

const generatePortugueseDateFormat = () => {
    const dateEntryCopy = document.querySelector('.dateEntry').value;

    const dateReplace = dateEntryCopy.replace(/-/g, '$').split('$');
    
    let fixedMonth = Number(dateReplace[1] - 1);
    let newDate = new Date(dateReplace[0], fixedMonth, dateReplace[2]);
    
    const monthDateSelected = newDate.toLocaleDateString('pt-br', {
        month: 'long'
    });
    
    const convertUppercase = monthDateSelected[0].toUpperCase() + monthDateSelected.substring(1);

    let indexMonthCurrent = searchIndexMonth(convertUppercase);

    return new Date(dateReplace[0], indexMonthCurrent, dateReplace[2]);
}


const generateMonthlyRecipePayload = () => {
  const selectedInputs = selectInputsDom();
  const generatePortugueseDate = generatePortugueseDateFormat();

  const payload = {
    user: {
      title: selectedInputs.user,
      month: {
        title: monthDialogAddRevenues.month,
        listMonth: {
          typeRevenue: selectedInputs.typeRevenue,
          value: selectedInputs.value,
          dateEntry: generatePortugueseDate
        }
      }
    }
  };

  return payload;
};

const checkMonthSetting = () => {
  window.monthValueVariable = new Proxy({}, {
      set: function(target, property, value) {

          monthDialogAddRevenues = value;

          console.log(target, property, value)
          target[property] = value;
      }
  });
}

checkMonthSetting();

const registerFixedRecipe = async () => {
    const dateEntry = document.querySelector('.dateEntry').value;
    const dateReplace = dateEntry.replace(/-/g, '$').split('$');
    const selectInputs = selectInputsDom();
  
    for (const month of months) {
      const dateEntry = new Date(dateReplace[0], searchIndexMonth(month), dateReplace[2]);
      const payload = {
        user: {
          title: selectInputs.user,
          month: {
            title: month,
            listMonth: {
              typeRevenue: selectInputs.typeRevenue,
              value: selectInputs.value,
              dateEntry
            }
          }
        }
      };
  
      try {
        await window.registerRevenues('http://localhost:3000/auth/revenues', payload)
          .then(() => {
            window.addRevenues.add = {
              request: true
            }
          })
      } catch {
        console.log(error)
      }
    }
  
    document.querySelector('.dialog-add-revenues-form').reset();
    document.querySelector('.add-revenues').setAttribute('data-dismiss', 'modal');
    setStoreRevenues.store = {
      status: true
    };
};

const selectInputsDom = () => {
    const typeRevenue = document.querySelector('.typeRevenue').value;
    const value = valueDialogAddRevenues;
    const dateEntry = document.querySelector('.dateEntry').value;
    const fixedRevenue = document.querySelector('.fixedRevenue').checked;
    const user = localStorage.getItem('user');

    return {
        typeRevenue,
        value,
        dateEntry,
        fixedRevenue,
        user
    }
}

const registerMonthlyRecipe = async () => {
    const buttonAddRevenues = document.querySelector('.add-revenues');
    buttonAddRevenues.setAttribute('data-dismiss', 'modal');
  
    const payload = generateMonthlyRecipePayload();
  
    try {
      await window.registerRevenues('http://localhost:3000/auth/revenues', payload)
        .then(() => {
          window.addRevenues.add = {
            request: true
          }
        })
      setStoreRevenues.store = { status: true };
      document.querySelector('.dialog-add-revenues-form').reset();
    } catch (error) {
      console.error(error);
    }
};

const searchIndexMonth = (monthSearch) => {
    return months.findIndex(month => month === monthSearch);
};

const verifyFieldFill = (typeRevenue, value, dateEntry, fixedRevenue) =>
  typeRevenue !== '' && value !== '' && value !== undefined && dateEntry !== '' && fixedRevenue !== '';

if ("customElements" in window) {
  customElements.define("app-dialog-add-revenues", DialogAddRevenues);
}
