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
let emptyResponse;
const itemsPerPage = 3;
let currentPage = 1;

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
            }
            spinner.style.display = 'none';
            pagination(arr);

        })
}


const createTableHeader = () => {
    const thead = document.querySelector(".table thead");
    thead.innerHTML = "";
    const titlesTable = ["Tipo de Receita", "Valor", "Data de Entrada", "Id", "Ações"];

    const headerRow = document.createElement("tr");

    titlesTable.forEach(title => {
        const headerCell = document.createElement("th");
        headerCell.textContent = title;
        headerRow.appendChild(headerCell);
    });

    thead.appendChild(headerRow);
};

const populateTable = (arr) => {
    if (!document.querySelector('.table thead tr') && !emptyResponse) {
        createTableHeader();
    }
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = "";
    
    arr.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.typeRevenue}</td>
            <td>${item.value}</td>
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
// TODO
const pagination = (arr) => {
    const pagination = document.querySelector('.my-pagination');
  
    const paginationHTML = createPagination();
    pagination.innerHTML = paginationHTML;
  
    const pageLinks = pagination.querySelectorAll('.page-item');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');

    populateTable(paginate(arr, itemsPerPage, currentPage));
  
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
    
            populateTable(nextPageData);
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

if('customElements' in window) {
    customElements.define('app-revenues', Revenues);
}