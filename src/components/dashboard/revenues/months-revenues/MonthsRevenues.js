class MonthsRevenues extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        fetch('src/components/dashboard/revenues/months-revenues/MonthsRevenues.html')
        .then(response=> response.text())
        .then(text=> this.innerHTML = text);
    }

    connectedCallback () {
		console.log('connected!', this);
        setTimeout(() => {
            setImages();
            getMonthCurrent();
        }, 100)
	}

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}

let monthsRevenues = [
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
    'Dezembro'
]

let i;
let currentMonth;
monthValueVariable = {};

const setImages = () => {
    const arrowLeft = document.querySelector('img.arrow-left-img');
    const arrowRight = document.querySelector('img.arrow-right-img');
    arrowLeft.src = 'https://raw.githubusercontent.com/daniloagostinho/curso-angular15-na-pratica/main/src/assets/images/arrow-left.png';
    arrowRight.src = 'https://raw.githubusercontent.com/daniloagostinho/curso-angular15-na-pratica/main/src/assets/images/arrow-right.png';   
}

const getMonthCurrent = () => {
    let date = new Date();
    let dateString = date.toLocaleDateString('PT-BR', {month: 'long'});
    let letterDateString = dateString[0].toUpperCase() + dateString.substring(1);
    document.querySelector('.text-month').innerHTML = letterDateString;
    currentMonth = letterDateString;
    monthValueVariable.add = {
        month: letterDateString
    }
}

const prev = () => {
    findIndexElement();
    i = i - 1;
    i = i % monthsRevenues.length;
    currentMonth = monthsRevenues[i];
    document.querySelector('.text-month').innerHTML = currentMonth;
}

const next = () => {
    findIndexElement();
    i = i + 1;
    i = i % monthsRevenues.length;
    currentMonth = monthsRevenues[i];
    document.querySelector('.text-month').innerHTML = currentMonth;
}


const findIndexElement = () => {
    let returnIndex = monthsRevenues.findIndex(item => item === currentMonth);
    i = returnIndex;
}


if('customElements' in window) {
    customElements.define('app-months-revenues', MonthsRevenues);
}