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

const verifySetStoreMonthData = () => {
    setStoreMonth = new Proxy({}, {
        set: function(target, property, value) {

            monthDialogAddRevenues = value;

            console.log(target, property, value)
            target[property] = value;
        }
    });
}

verifySetStoreMonthData();

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

const handleAddRevenues = async (event) => {
    event.preventDefault();
    const typeRevenue = document.querySelector('.typeRevenue').value;
    const value = valueDialogAddRevenues;
    const fixedRevenue = document.querySelector('.fixedRevenue').checked;
    const dateEntry = document.querySelector('.dateEntry').value;
    let user = localStorage.getItem('user');
    
    if(verifyDialogAddRevenuesCompletedFields(typeRevenue, value, dateEntry, fixedRevenue)) {

        const dateEntryCopy = document.querySelector('.dateEntry').value;

        const dateReplace = dateEntryCopy
        .replaceAll('-', '$')
        .replaceAll(' ', '$')
        .split('$')

        
        let fixedMonth = Number(dateReplace[1] - 1);
        let newDate = new Date(dateReplace[0], fixedMonth, dateReplace[2]);
        
        const monthDateSelected = newDate.toLocaleDateString('pt-br', {
            month: 'long'
        });
        
        const convertUppercase = monthDateSelected[0].toUpperCase() + monthDateSelected.substring(1);

        let indexMonthCurrent = searchIndexMonth(convertUppercase);
        let dateEntry = new Date(dateReplace[0], indexMonthCurrent, dateReplace[2]);

        const payload = {
            user: {
              title: user,
              month: {
                title: monthDialogAddRevenues.month,
                listMonth: {
                  typeRevenue,
                  value,
                  dateEntry
                }
              }
            }
        }

        if(fixedRevenue) {
            for(let i = 0; i < months.length; i++) {
                dateEntry = new Date(dateReplace[0], searchIndexMonth(months[i]), dateReplace[2]);

                const payload = {
                    user: {
                      title: user,
                      month: {
                        title: months[i],
                        listMonth: {
                          typeRevenue,
                          value,
                          dateEntry
                        }
                      }
                    }
                }

                await window.registerRevenues('http://localhost:3000/auth/revenues', payload)
                document.querySelector('.dialog-add-revenues-form').reset();

                const buttonAddRevenues = document.querySelector('.add-revenues');
                buttonAddRevenues.setAttribute('data-dismiss', 'modal');
            }

            setStoreRevenues.store = {
                status: true
            }

            return;
        }

        const buttonAddRevenues = document.querySelector('.add-revenues');
        buttonAddRevenues.setAttribute('data-dismiss', 'modal');

        // REQUISIÇÃO
        await window.registerRevenues('http://localhost:3000/auth/revenues', payload)
        .then(() => {
            setStoreRevenues.store = {
                status: true
            }
            document.querySelector('.dialog-add-revenues-form').reset();
        })
    } else {
        const buttonAddRevenues = document.querySelector('.add-revenues')
        buttonAddRevenues.removeAttribute('data-dismiss');
        alert('Preencha os campos vazios!')
    }

}

const searchIndexMonth = (monthSearch) => {
    let index = months.findIndex((month) => {
      return month === monthSearch;
    })

    return index;
  }

const verifyDialogAddRevenuesCompletedFields = (typeRevenue, value, dateEntry, fixedRevenue) => {
    if(typeRevenue !== '' && value !== '' && value !== undefined && dateEntry !== '' && fixedRevenue !== '') {
        return true;
    }

    return false;
}

if ("customElements" in window) {
  customElements.define("app-dialog-add-revenues", DialogAddRevenues);
}
