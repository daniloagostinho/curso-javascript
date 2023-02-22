class Menu extends HTMLElement {
    constructor() {
        super();
        console.log('contructor ', this)

        fetch('src/components/shared/menu/Menu.html')
        .then(response=> response.text())
        .then(text=> this.innerHTML = text);
    }

    connectedCallback () {
		console.log('connected!', this);
        setTimeout(() => {
            getImageUser();
            messageWelcome();
        }, 1000);
    }

    disconnectedCallback () {
		console.log('disconnected', this);
	}
}

const getImageUser = () => {
    console.log('comeceii')
    const img = document.querySelector('img');
    const nameImage = JSON.parse(localStorage.getItem('userInfo'))
    window.downloadImage('http://localhost:3000/download/image', nameImage.image)
    .then(res => res.json())
    .then(res => {
        console.log('res -->> ' , res)
      let url = 'data:image/jpg;base64,' + res.image;
      img.src = url;
    })
}

const messageWelcome = () => {
    const messageContainer = document.querySelector('.message');
    const nameUser = JSON.parse(localStorage.getItem('userInfo'))
    let showNameUser = nameUser.name;

    let message;
    let hour = new Date().getHours();
    
    if(hour <= 5) {
      message = 'Boa madrugada!';
    }
    else if(hour < 12) {
        message = 'Bom dia!';
    }
    else if(hour < 18) {
        message = 'Boa tarde!';
    }
    else {
        message = 'Boa noite';
    }

    messageContainer.innerHTML = `Olá <strong>${showNameUser}</strong>, ${message}`;
}

if('customElements' in window) {
    customElements.define('app-menu', Menu);
}