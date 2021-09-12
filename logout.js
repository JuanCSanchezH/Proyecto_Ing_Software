function Cerrar(){
    firebase.auth().signOut()
    .then(function(){
        console.log('Saliendo...')
        setTimeout("location = 'index.html'", 1000);
    })
    .catch(function(error){
        console.log(error);
    })
}
