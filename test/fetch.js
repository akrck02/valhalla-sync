
window.onload = () => {
    fetch('http://localhost:5500/sync/v1/new/auth',{
        method: 'POST',
        headers: {
            oauth: 'eggs',
            "Content-type": "application/json; charset=UTF-8" 
        },
        body: JSON.stringify({
            username: 'akrck02',
            password: 'root',
            mail: 'aketza.vazquez@gmail.com'
         })   
    })
    .then((response) => response.text())
    .then((data) => console.log(data));
}
