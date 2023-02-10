window.login = (url, user) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
    });
}

window.registerUser = (url, user) => {
    const formData = new FormData();

    formData.append('name', user.name)
    formData.append('email', user.email)
    formData.append('age', user.age)
    formData.append('image', user.image)
    formData.append('password', user.password)
    formData.append('confirmPassword', user.confirmPassword)

    return fetch(url, {
        method: 'POST',
        body: formData
    });
}

window.registerRevenues = (url, revenue) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(revenue),
        headers: {'Content-type': 'application/json'}
    });
}

window.getRegisterRevenues = (url, param, user) => {
    return fetch(url, {
        headers: {
            'month': param,
            'user': user
        }
    });
}