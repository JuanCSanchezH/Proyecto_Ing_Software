/*******************************FIREBASE Y CLOUD FIRESTORE*****************************************/

/************************REGISTRO DOCTORES, PACIENTES Y VERIFICACIÓN*********************************/

// Initialize Cloud Firestore through Firebase
  
var db = firebase.firestore();

// Registrar doctores
function registrar(){
    var email = document.getElementById('email').value;
    var contrasena = document.getElementById('contrasena').value;
    var confReg = document.getElementById('confReg');

    firebase.auth().createUserWithEmailAndPassword(email, contrasena)

    .then(function(){
        confReg.innerHTML = `
        <div class="alert alert-success text-center" role="alert">
            <h4 class="alert-heading">¡Se ha registrado exitosamente!</h4>
            <p>Por favor, revisa el correo para verificar la cuenta</p>
        </div>`
        verificar()
    })

    .catch((error) => { //Errores al no ingresar algun campo
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        if(errorCode == "auth/email-already-in-use"){
            confReg.innerHTML = `
            <div class="alert alert-danger pr-5" role="alert">
                <h4 class="alert-heading">Lo sentimos...</h4>
                <p>El correo ingresado ya se encuentra en uso.</p>
            </div>`
        }
        else{
            confReg.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h4 class="alert-heading">Formato de correo erróneo. Por favor, vuelve a ingresarlo.</h4>
            </div>`
        }
    });
}

// Verificar email
function verificar(){
    var user = firebase.auth().currentUser;
    user.sendEmailVerification()
    .then(function(){
    // Email verification sent!
        console.log('Enviando correo...');
    })
    .catch(function(error){
        console.log(error);
    });
}

// Función para vacear el contenido cuando el registro no es exitoso
function vacear(){
    confReg.innerHTML = ``;
    document.getElementById('email').value = '';
    document.getElementById('contrasena').value = '';
}

// Recorrer

function recorre(min, max){
    var arreglo = new Array(6);
    for(let j = 0; j<6; j++){
        arreglo[j] = Math.floor(Math.random() * (max - min) + min);
    }
    return arreglo;
}


// Agregar documentos

function guardar(){

    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;
    var cedula = document.getElementById('cedula').value;
    var edad = document.getElementById('edad').value;
    var fecha = document.getElementById('fecha').value;
    var genero = document.getElementById('genero').value;
    var eps = document.getElementById('eps').value;
    var confnuevoP = document.getElementById('confnuevoP');
    let fc = recorre(30, 130);
    let time = [ 0, 5, 10, 15, 20, 25];

    if( nombre != '' && apellido != '' && cedula != '' && fecha != '' && genero != '' && eps != ''){
        console.log(typeof(fecha));
        console.log(fecha);
        if(validarFormatoFecha(fecha)){
            
            db.collection("pacientes").add({
                nombres: nombre,
                apellidos: apellido,
                ID: cedula,
                edad: edad,
                sexo: genero,
                eps: eps,
            })
            .then((docRef) => {
                
                var idReal = db.collection("pacientes").doc(docRef.id);
                idReal.collection(fecha).doc("Distancia").set({
                    Distacia: ""
                })
                idReal.collection(fecha).doc("Calorias").set({
                    Calorias: ""
                })
                idReal.collection(fecha).doc("HR").set({
                    bpm: fc,
                    hora: time
                })
                idReal.collection(fecha).doc("Pasos").set({
                    Pasos: ""
                })
                idReal.collection(fecha).doc("Reporte").set({
                    reporte: ""
                })
                
    
                console.log("Documento escrito con ID: ", docRef.id);
                nombre = document.getElementById('nombre').value = '';
                apellido = document.getElementById('apellido').value = '';
                cedula = document.getElementById('cedula').value = '';
                edad = document.getElementById('edad').value = '';
                genero = document.getElementById('genero').value = '';
                eps = document.getElementById('eps').value = '';
                fecha1 = fecha;
                fecha = document.getElementById('fecha').value = '';
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
            });
        }
        else{
            confnuevoP.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h6 class="alert-heading">Por favor, vuelva a ingresar la fecha con el formato indicado.</h6>
            </div>
            `;
            setTimeout(function(){
                confnuevoP.innerHTML = ``
            },5000);
        }
    }
    else{
        confnuevoP.innerHTML = `
            <div class="alert alert-danger text-center" role="alert" style="width: 600px;">
                <h6 class="alert-heading">Debe llenar todos los campos para poder guardar el nuevo usuario.</h6>
            </div>
            `;
        setTimeout(function(){
            confnuevoP.innerHTML = ``
        },5000);
    }
}

//Valida el formato tipo fecha al crear un paciente

function validarFormatoFecha(fecha) {
    var RegExPattern = /^\d{2,4}\-\d{1,2}\-\d{1,2}$/;
    if (fecha.match(RegExPattern)) {
          return true;
    } else {
          return false;
    }
}

// Leer documentos

var tabla = document.getElementById('tabla');
var barra = document.getElementById('barra');

db.collection("pacientes").onSnapshot((querySnapshot) => { //Agente de escucha para poder obtener los datos de la BD en tiempo real
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        id1 = doc.id;

        tabla.innerHTML += `
        <tr class="table-light">
            <th scope="row">${doc.id}</th>
            <td>${doc.data().nombres}</td>
            <td>${doc.data().apellidos}</td>
            <td>${doc.data().ID}</td>
            <td>${doc.data().edad}</td>
            <td>${doc.data().sexo}</td>
            <td>${doc.data().eps}</td>
            <td><button class="btn btn-danger btn-sm" style="padding-right: 10px;" onclick="eliminar('${doc.id}')">Eliminar</button></td> <!--Por cada presion de boton, se ejecuta la función eliminar sobre el id actual-->
            <td><button class="btn btn-warning btn-sm" onclick="editar('${doc.id}', '${doc.data().nombres}', '${doc.data().apellidos}', '${doc.data().ID}', '${doc.data().edad}', '${doc.data().sexo}', '${doc.data().eps}')">Editar</button></td>
        </tr>
        
        `;
    });

});

// Borrar documentos

function eliminar(id){
    db.collection("pacientes").doc(id).delete()
    .then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

// Actualizar documento

function editar(id, nombres, apellidos, ID, edad, sexo, eps){

    document.getElementById('nombre').value = nombres;
    document.getElementById('apellido').value = apellidos;
    document.getElementById('cedula').value = ID;
    document.getElementById('edad').value = edad;
    document.getElementById('genero').value = sexo;
    document.getElementById('eps').value = eps;

    var boton = document.getElementById('boton');

    boton.innerHTML = 'Editar'

    boton.onclick = function(){

        eliminar(id);
        guardar();

        console.log("Document successfully updated!");
        boton.innerHTML = 'Guardar';
        // return pacientes.update({
        //     nombres: nombre,
        //     apellidos: apellido,
        //     ID: cedula,
        //     edad: edad,
        //     sexo: genero,
        //     eps: eps
        // })
        // .then(() => {
        //     console.log("Document successfully updated!");
        //     boton.innerHTML = 'Guardar';
        //     document.getElementById('nombre').value = '';
        //     document.getElementById('apellido').value = '';
        //     document.getElementById('fecha').value = '';
        // })
        // .catch((error) => {
        //     // The document probably doesn't exist.
        //     console.error("Error updating document: ", error);
        // });
    }
}

function observador(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Existe usuario activo');
            //aparece(user);

            console.log('*******************');
            console.log(user.emailVerified);
            console.log('*******************');
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
        //   uid += 'medic';
        //   console.log(uid);
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
