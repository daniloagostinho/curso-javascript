window.login = (url, user) => {
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });
}
