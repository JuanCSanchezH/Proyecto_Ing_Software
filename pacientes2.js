var db = firebase.firestore();
// const formulario = document.querySelector('#formulario');
// const boton = document.querySelector('#boton');
// const contboton = document.querySelector('#contenedor-boton');
// const resultado0 = document.querySelector('#resultado0');
// const resultado1 = document.querySelector('#resultado1');
// const resultado2 = document.querySelector('#resultado2');
// const resultado3 = document.querySelector('#resultado3');
// const resultado4 = document.querySelector('#resultado4');
// const confirmar = document.querySelector('#confirmar');
// const confirmar2 = document.querySelector('#confirmar2');


  const filtrar = ()=>{
    // const texto = formulario.value;
    // var bandera = 0;

    // resultado0.innerHTML = '';
    // resultado1.innerHTML = '';
    // resultado2.innerHTML = '';
    // resultado3.innerHTML = '';
    // resultado4.innerHTML = '';
    
    var tabla2 = document.getElementById('tabla2');
    var linechart = document.getElementById('line-chart');
    var areachart = document.getElementById('area-chart');
    var textrep = document.getElementById('text-rep');
    

    db.collection("pacientes").onSnapshot((querySnapshot) => { //Agente de escucha para poder obtener los datos de la BD en tiempo real
        tabla2.innerHTML = '';
        linechart.innerHTML = '';
        areachart.innerHTML = '';
        textrep.innerHTML = '';
        confirmar2.innerHTML = '';
        querySnapshot.forEach((doc) => {
            
            
            cc = doc.data().valor;

            if(cc == texto){
                // nombre = doc.data().nombre;
                // apellido = doc.data().apellido;
                // edad = doc.data().edad;
                // genero = doc.data().genero;
                // eps = doc.data().eps;
                // reporte = doc.data().reporte;

                // fc = doc.data().fc;
                // time = doc.data().time;
                // spo2 = doc.data().spo2;

                // document.getElementById('resultado0').value = nombre;
                // document.getElementById('resultado1').value = apellido;
                // document.getElementById('resultado2').value = edad;
                // document.getElementById('resultado3').value = genero;
                // document.getElementById('resultado4').value = eps;
                      
                for (var i = 0; i < fc.length; i++) {
                    tabla2.innerHTML += `
                    <tr class="table-primary">
                        <td>${time[i]}</td>
                        <td>${fc[i]}</td>
                        <td>${spo2[i]}</td>
                    </tr>`;
                    
                }

                contboton.innerHTML = `
                    <button type="button" class="btn btn-info" style="width: 100px;" onclick="guardarRep('${doc.id}')">Enviar</button>
                `;
                console.log(reporte);
                
                // Mostrar reporte:

                if(reporte != ''){
                    confirmar2.innerHTML = '';
                    textrep.innerHTML = reporte;
                }
                else{
                    textrep.innerHTML = '';
                    confirmar2.innerHTML = `
                    <div class="alert alert-danger" role="alert" style="width: 250px;">
                        <h6 class="alert-heading">No hay reporte existente</h6>
                    </div>
                    `;
                }

                // Datos para las gráficas

                var data = [
                    { y: time[0], a: fc[0],  b: spo2[0]},
                    { y: (time[1],"26/07/2021"), a: fc[1],  b: spo2[1]},
                    { y: (time[2],"26/07/2021"), a: fc[2],  b: spo2[2]},
                    { y: (time[3],"26/07/2021"), a: fc[3],  b: spo2[3]},
                    { y: (time[4],"26/07/2021"), a: fc[4],  b: spo2[4]},
                    { y: (time[5],"26/07/2021"), a: fc[5],  b: spo2[5]}
                  ],
                  config = {
                    data: data,
                    xkey: 'y',
                    ykeys: ['a', 'b'],
                    labels: ['Frecuencia cardiaca', 'SpO2'],
                    fillOpacity: 0.6,
                    hideHover: 'auto',
                    behaveLikeLine: true,
                    resize: true,
                    pointFillColors:['#ffffff'],
                    pointStrokeColors: ['black'],
                    lineColors:['red','blue'],
                    parseTime: false
                };
                config.element = 'area-chart';
                Morris.Area(config);
                config.element = 'line-chart';
                Morris.Line(config);
                
                confirmar.innerHTML = '';
                // bandera = 1;
            }

            // Verifica si el paciente existe o no

            // if (bandera == 1) {
            //     console.log(bandera);
            // }
            // else {
            //     bandera = 0;
            //     document.getElementById('resultado0').value = '';
            //     document.getElementById('resultado1').value = '';
            //     document.getElementById('resultado2').value = '';
            //     document.getElementById('resultado3').value = '';
            //     document.getElementById('resultado4').value = '';
            //     confirmar.innerHTML = `
            //     <div class="alert alert-danger" role="alert">
            //         <h6 class="alert-heading">Paciente no encontrado</h6>
            //     </div>
            //     `;
            // }

        });
    });  
}

boton.addEventListener('click', filtrar);
// $('#formulario').keydown(filtrar)

function guardarRep(id){
    var text = document.getElementById("FormControlTextarea1").value;
    console.log('este es el texto: ', text);
    db.collection('pacientes').doc(id).set({
        reporte: text
    },{ merge: true })
}

function observador(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Existe usuario activo');
            //aparece(user);

            console.log('*******************');
            console.log('verificado', user.emailVerified);
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