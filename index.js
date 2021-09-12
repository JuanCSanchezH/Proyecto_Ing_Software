

/*****************************INGRESO Y RESTABLECER CONTRASEÑA*************************************/

// Initialize Cloud Firestore through Firebase

var db = firebase.firestore();

function ingresar(){
    var email2 = document.getElementById('email2').value;
    var contrasena2 = document.getElementById('contrasena2').value;
    var loginCorrecto = document.getElementById('login-correcto');

    firebase.auth().signInWithEmailAndPassword(email2, contrasena2)
    
    .then(user => {
        document.getElementById('email2').value = '';
        document.getElementById('contrasena2').value = '';
    })
    
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);

        if(errorCode == "auth/invalid-email"){
            loginCorrecto.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h6 class="alert-heading">Formato de correo erróneo.</h6>
            </div>`
            setTimeout(function(){
                loginCorrecto.innerHTML = ``
                document.getElementById('email2').value = '';
                document.getElementById('contrasena2').value = '';
            },5000);
            
        }
        else if(errorCode == "auth/user-not-found"){
            loginCorrecto.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h6 class="alert-heading">Usuario no registrado. Contáctese con nosotros para más información.</h6>
            </div>`
            setTimeout(function(){
                loginCorrecto.innerHTML = ``
                document.getElementById('email2').value = '';
                document.getElementById('contrasena2').value = '';
            },6000);
        }
        else{
            loginCorrecto.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h6 class="alert-heading">Contraseña inválida.</h6>
            </div>`
            setTimeout(function(){
                loginCorrecto.innerHTML = ``
                document.getElementById('contrasena2').value = '';
            },5000);
        }
    });
}

function observador(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Existe usuario activo');
            aparece(user);

            console.log('*******************');
            console.log(user.emailVerified);
            console.log('*******************');
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
            console.log('No existe usuario activo');
            // contenido.innerHTML = ` 
            
            // `;
        }
    });
}
observador();

function aparece(user){
    
    var user = user;
    var contenido = document.getElementById('contenido');
    var loginCorrecto = document.getElementById('login-correcto');

    // db.collection("pacientes").onSnapshot((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         console.log(user)
    //         console.log(doc)
    //         tipo = doc.data().usuario;
    //         if(tipo === 'paciente'){
    //             bandlogin = 1;
    //             console.log(bandlogin)
                
    //             console.log('jajajajajajjajajajaj')
    //             loginCorrecto.innerHTML = `
    //             <div class="alert alert-danger text-center" role="alert">
    //                 <h6 class="alert-heading">No está autorizado para ingresar al sistema.</h6>
    //             </div>`
    //             setTimeout(function(){
    //                 loginCorrecto.innerHTML = ``
    //                 document.getElementById('email2').value = '';
    //                 document.getElementById('contrasena2').value = '';
    //             },5000);
    //         }
    //     })
    // })
    // console.log(bandlogin)
    
    var userRef = db.collection('pacientes').doc(user.uid);
    userRef.get()
    .then(doc => {
        if (!doc.exists) {

            if((firebase.auth().fetchSignInMethodsForEmail(user.email))&&((user.uid == 'q4b91dy4C5bzaEAKQv4zPom9Wcq1'))){

                contenido.innerHTML = ` 
                <div class="container py-3">
                    <div class="alert alert-success" role="alert">
                        <h4 class="alert-heading">¡Bienvenido!</h4>
                        <p>Acaba de ser autorizado con el correo ${user.email} para ingresar al sistema de administrador de usuarios. En un momento será redirigido al sistema</p>
                        <hr>
                    </div>
                </div>
                `;
        
                loginCorrecto.innerHTML = `
                    <div class="alert alert-success" role="alert">
                        <h1 class="alert-heading fs-6">Ingreso exitoso.</h1>
                    </div>
                `;
        
                setTimeout("location = 'registro.html'", 6000);
                // Las `` permiten hacer template (escribir html en javascript)
            }
            else{
                contenido.innerHTML = ` 
                <div class="container py-4">
                    <div class="alert alert-success" role="alert">
                        <h4 class="alert-heading">¡Bienvenido!</h4>
                        <p>Acaba de ser autorizado con el correo ${user.email} para ingresar al sistema de pacientes. En un momento será redirigido al sistema</p>
                        <hr>
                    </div>
                </div>
                `;
        
                loginCorrecto.innerHTML = `
                    <div class="alert alert-success" role="alert">
                        <h1 class="alert-heading fs-6">Ingreso exitoso.</h1>
                    </div>
                `;
        
                setTimeout("location = 'pacientes.html'", 6000);
            }
        } 
        else {
            loginCorrecto.innerHTML = `
                <div class="alert alert-danger text-center" role="alert">
                    <h6 class="alert-heading">No está autorizado para ingresar al sistema de visualización.</h6>
                </div>`
                setTimeout(function(){
                    loginCorrecto.innerHTML = ``
                    document.getElementById('email2').value = '';
                    document.getElementById('contrasena2').value = '';
                },5000);
                Cerrar();
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });
    
    
}


function restablecer(){
    var emailrestore = document.getElementById('emailrestore').value;
    var confrest = document.getElementById('confirmrestore');
    firebase.auth().sendPasswordResetEmail(emailrestore)
    .then(() => {
        document.getElementById('emailrestore').value = '';
        confrest.innerHTML = `
            <div class="alert alert-success" role="alert">
                <h1 class="alert-heading fs-6">El correo ha sido enviado exitosamente.</h1>
            </div>
        `;
        setTimeout(function(){
            confrest.innerHTML = ``
        },5000);
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
        console.log(error.code);
        console.log(errorMessage);
        if(errorCode == "auth/invalid-email"){
            confrest.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h6 class="alert-heading">Formato de correo erróneo.</h6>
            </div>`
            setTimeout(function(){
                confrest.innerHTML = ``
            },5000);
            
        }
        else if(errorCode == "auth/user-not-found"){
            confrest.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h6 class="alert-heading">Usuario no registrado. Contáctese con nosotros para más información.</h6>
            </div>`
            setTimeout(function(){
                confrest.innerHTML = ``
            },6000);
        }
    });
}

//Mostrar-Ocultar contraseña
$(document).ready(()=>{
    $('#btn-show').mousedown(()=>{
        $('#contrasena2').removeAttr('type');
    })
    $('#btn-show').mouseup(()=>{
        $('#contrasena2').attr('type','password');
    })
})

//Cerrar sesión
function Cerrar(){
    firebase.auth().signOut()
    .then(function(){
        console.log('Saliendo...')
    })
    .catch(function(error){
        console.log(error);
    })
}