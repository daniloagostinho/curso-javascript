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
            initTableConfig(); 
            animationInput(); 
        }, 1000)
	}
''
    disconnectedCallback () {
		console.log('disconnected', this);
	}
}


let monthSelected;
let emptyResponse;
const itemsPerPage = 3;
let currentPage = 1;
let arrRevenues;

let tbody;

const defineInitMonth = () => {
    let date = new Date();
    let dateString = date.toLocaleDateString('pt-br', {month: 'long'})
    let letterDateString = dateString[0].toUpperCase() + dateString.substring(1)
    monthSelected == undefined ? (monthSelected = letterDateString) : monthSelected
  }

  
  const getRegisterRevenues = async () => {
    const spinner = document.querySelector('.spinner-border');
    const blockRevenuesSearch = document.querySelector('.block-revenues-search');
    const myPagination = document.querySelector('nav.my-pagination');
    const blockRegisterRecipes = document.querySelector('.block-register-recipes');

    spinner.style.display = 'block';

    const user = localStorage.getItem('user');
    window.getRegisterRevenues('http://localhost:3000/list/revenues', monthSelected, user)
        .then(response => response.json())
        .then(response => {
            let arr = [];
            if(response.result.length === 0) {
                emptyResponse = true;
                blockRegisterRecipes.style.display = 'block';       
            } else {
                response.result.forEach(revenue => {
                    arr.push(revenue.user.month.listMonth)
                })
                emptyResponse = false;
                blockRevenuesSearch.style.display = 'block';
                myPagination.style.display = 'block';
                blockRegisterRecipes.style.display = 'none';
                arrRevenues = arr;
            }
            spinner.style.display = 'none';
            buildPagination(arr);

        })
}


const initTableConfig = () => {
    let table = document.createElement('table');
    table.classList.add("table")
    
    const thead = document.createElement("thead");
    table.appendChild(thead);

    thead.innerHTML = "";
    const titlesTable = ["Tipo de Receita", "Valor", "Data de Entrada", "Id", "Ações"];

    const headerRow = document.createElement("tr");

    titlesTable.forEach(title => {
        const headerCell = document.createElement("th");
        headerCell.textContent = title;
        headerRow.appendChild(headerCell);
    });

    thead.appendChild(headerRow);
    document.querySelector('.table-container').appendChild(table);
    tbody = document.createElement('tbody');
    table.appendChild(tbody)
};

const updateTableRows  = (arr) => {
    tbody.innerHTML = "";
    
    arr.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.typeRevenue}</td>
            <td>${currencyValue(item.value)}</td>
            <td>${item.dateEntry}</td>
            <td>${item._id}</td>
            <td>
                <img class="image" onclick="captureClickedAction('${item.actions[0]}', '${item}')" src="${item.actions[0]}" />
                <img class="image" onclick="captureClickedAction('${item.actions[1]}', '${item}')" src="${item.actions[1]}" />
            </td>
        `;
        tbody.appendChild(tr);
    });
}

const currencyValue = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL'
    }).format(parseFloat(value / 100));
}

const captureClickedAction = (action, element) => {
    if(action.indexOf('edit.png') !== -1) {
        alert('Open update!');
        console.log(element)
    } else {
        alert('Open remove!')
        console.log(element)
    }
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

const paginate = (array, itemsPerPage, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return array.slice(startIndex, startIndex + itemsPerPage);
}

const openDialogAddRevenues = () => {
    const dialog = document.querySelector('.dialog-add-revenues');
    window.isOpenDialogAddRevenues.open = {
        isOpen: true
    }
    dialog.click();
}

const searchRevenues = (event) => {
    const noResult = document.querySelector('.no-result');
    const searchTerm = event.target.value.toLowerCase();
    
    const filteredArray = arrRevenues.filter(item => {
      const text = item.typeRevenue.toLowerCase();
      return text.includes(searchTerm);
    });
  
    if (filteredArray.length > 0) {
      noResult.style.display = "none";
      
      const itemsPerPage = 3;
      const currentPage = 1;
      const paginatedArray = paginate(filteredArray, itemsPerPage, currentPage);
      updateTableRows(paginatedArray);
  
    } else {
      // Não há resultados
      noResult.style.display = "block";
      const tableBody = document.querySelector('.table tbody');
      tableBody.innerHTML = ''
    }
}

const buildPagination = (arr) => {

    const pagination = document.querySelector('.my-pagination');
  
    const paginationHTML = createPagination();
    pagination.innerHTML = paginationHTML;
  
    const pageLinks = pagination.querySelectorAll('.page-item');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');

    updateTableRows(paginate(arr, itemsPerPage, currentPage));
  
    for (const pageLink of pageLinks) {
        pageLink.addEventListener('click', (event) => {
            event.preventDefault();
            const clickedLink = event.target.closest('.page-link');
            if (clickedLink.textContent === 'Anterior') {
                currentPage--;
                next.disabled = false;
            } else if (clickedLink.textContent === 'Próximo') {
                currentPage++;
                prev.disabled = false;
            }
    
            const nextPageData = paginate(arr, itemsPerPage, currentPage);
            if (nextPageData.length === 0) {
                clickedLink.disabled = true;
                return;
            }
    
            updateTableRows(nextPageData);

            const prevLink = pagination.querySelector('.page-link.prev');
            const nextLink = pagination.querySelector('.page-link.next');

            if (currentPage === 1) {
                prevLink.disabled = true;
            } else {
                prevLink.disabled = false;
            }
            if (currentPage === Math.ceil(arr.length / itemsPerPage)) {
                nextLink.disabled = true;
            } else {
                nextLink.disabled = false;
            }
            
        });
    }
};

const createPagination = () => {
    let paginationHTML = `<ul class="pagination">
                            <li class="page-item"><button type="button" class="btn btn-outline-dark page-link prev" disabled>Anterior</button></li>
                            <li class="page-item"><button type="button" class="btn btn-outline-dark page-link next">Próximo</button></li>
                          </ul>
                          `
    return paginationHTML;
}

const animationInput = () => {
    const inputSearch = document.querySelector('.block-revenues-search input');
    inputSearch.style.width = '163px';
    inputSearch.addEventListener('focus', (event) => {
        inputSearch.style.width = '42%';
        inputSearch.classList.add('animationCard');
    })

    inputSearch.addEventListener('blur', (event) => {
        inputSearch.style.width = '163px';
        inputSearch.classList.add('animationCard');
    })
    console.log(inputSearch)
}

if('customElements' in window) {
    customElements.define('app-revenues', Revenues);
}