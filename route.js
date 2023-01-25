const routes = {
    "/": "<app-login></app-login>",
    "/index.html": "<app-login></app-login>",
    "/dashboard": "<app-dashboard></app-dashboard>"
};

const rootDiv = document.getElementById('main-page');
rootDiv.innerHTML = routes[window.location.pathname];

const onNavigate = (pathname) => {
    window.history.pushState({}, pathname, window.location.origin + pathname)
    canGuard(pathname) ? rootDiv.innerHTML = routes[pathname] : '<app-login></app-login>'
}

const canGuard = (route) => {
    if(route === '/dashboard') {
        if(localStorage.getItem('token') !== null) {
            return true;
        } else {
            window.location.pathname = '/'
            return false;
        }
    } else {
        return true;
    }
}

window.onpopstate = () => {
    rootDiv.innerHTML = routes[window.location.pathname]
}