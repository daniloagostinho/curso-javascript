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

if('customElements' in window) {
    customElements.define('app-menu', Menu);
}