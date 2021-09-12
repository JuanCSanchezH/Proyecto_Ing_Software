
var db = firebase.firestore();
const formulario = document.querySelector('#formulario');
const boton = document.querySelector('#boton');
const botonload = document.querySelector('#btn-load');
const contboton = document.querySelector('#contenedor-boton');
const resultado0 = document.querySelector('#resultado0');
const resultado1 = document.querySelector('#resultado1');
const resultado2 = document.querySelector('#resultado2');
const resultado3 = document.querySelector('#resultado3');
const resultado4 = document.querySelector('#resultado4');
const confirmar = document.querySelector('#confirmar');
const confirmar2 = document.querySelector('#confirmar2');

  const filtrar = ()=>{

    var texto = formulario.value;
    var bandera = 0;
    var bandAlert1 = 0;
    var bandAlert2 = 0;
    var bandAlert3 = 0;
    var band1= 0;
    var band2= 0;
    var band3= 0;

    resultado0.innerHTML = '';
    resultado1.innerHTML = '';
    resultado2.innerHTML = '';
    resultado3.innerHTML = '';
    resultado4.innerHTML = '';
    
    var tabla2 = document.getElementById('tabla2');
    // var linechart = document.getElementById('line-chart');
    var areachart = document.getElementById('area-chart');
    var roundedchart = document.getElementById('rounded-chart');
    var textrep = document.getElementById('text-rep');
    var consultaFecha = document.getElementById('contenido-consultafecha');
    var inforoundedchart = document.getElementById('info-roundedchart');
    var verifecha = document.getElementById('verificar-fecha');
    var alertaDatos = document.getElementById('alertaDatos');

    db.collection("pacientes").onSnapshot((querySnapshot) => { //Agente de escucha para poder obtener los datos de la BD en tiempo real
        tabla2.innerHTML = '';
        // linechart.innerHTML = '';
        areachart.innerHTML = '';
        roundedchart.innerHTML = '';
        confirmar2.innerHTML = '';
        textrep.innerHTML = '';
        inforoundedchart.innerHTML = '';
        verifecha.innerHTML = '';

        querySnapshot.forEach((doc) => {
            
            cc = doc.data().ID;
            console.log(cc)

            if(resultado0.value == ''){
                $('#boton').hide();
                botonload.innerHTML = `
                    <button class="btn btn-primary" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Buscando paciente...
                    </button>
                `;
            }
            else{}

            if(cc == texto){

                id1 = doc.id;
                nombre = doc.data().nombres;
                apellido = doc.data().apellidos;
                edad = doc.data().edad;
                genero = doc.data().sexo;
                eps = doc.data().eps;

                document.getElementById('resultado0').value = nombre;
                document.getElementById('resultado1').value = apellido;
                document.getElementById('resultado2').value = edad;
                document.getElementById('resultado3').value = genero;
                document.getElementById('resultado4').value = eps;

                botonload.innerHTML = '';
                $('#boton').show();

                consultaFecha.innerHTML = `
                    <p>Ingrese en el siguiente campo, la fecha a consultar tal cual se muestra el formato ejemplo, donde 07 corresponde al día, 08 al mes y 2021 al año.</p>
                    <p class="fw-bold">Ejemplo: 2021-08-07</p>
                    <div class="input-group">
                        <span class="input-group-text" id="basic-addon1">Fecha</span>
                        <input id="fecha-paciente" type="text" class="form-control" aria-label="Userdate" aria-describedby="basic-addon1">
                        <div id="btn-consultarfecha" class="btn btn-outline-info">Consultar</div>
                    </div>
                `
                const btnfecha = document.getElementById('btn-consultarfecha');

                btnfecha.addEventListener("click", () => {

                    var fecha = document.getElementById('fecha-paciente').value;

                    if(validarFormatoFecha(fecha)){
                        console.log(id1);
                        db.collection('pacientes').doc(id1).collection(fecha).get()
                        .then(query => {

                            if(query.size){
                                console.log(query.size)

                                db.collection("pacientes").doc(id1).collection(fecha).onSnapshot((querySnapshot) => {
                                    
                                    tabla2.innerHTML = '';
                                    // linechart.innerHTML = '';
                                    areachart.innerHTML = '';
                                    roundedchart.innerHTML = '';
                                    confirmar2.innerHTML = '';
                                    textrep.innerHTML = '';
                                    inforoundedchart.innerHTML = '';
                                    verifecha.innerHTML = '';
                            
                                    querySnapshot.forEach((doc) => {
                                        
                                        id2 = doc.id;
                                        console.log(doc.data());
            
                                        reporte = doc.data().reporte;
            
                                        if(id2 == 'Calorias'){
                                            calorias = doc.data().Calorias;
                                            band1 = 1;
                                        }
                                        else if(id2 == 'Distancia'){
                                            distancia = doc.data().Distancia;
                                            band2 = 1;
                                        }
                                        else if(id2 == 'Pasos'){
                                            pasos = doc.data().Pasos;
                                            band3 = 1;
                                        }
                                        else if(id2 == 'HR'){
                                            
                                            fc = doc.data().bpm;
                                            hora = doc.data().hora;
            
                                            for (var i = 0; i < fc.length; i++) {
            
                                                tabla2.innerHTML += `
                                                <tr class="table-primary">
                                                    <td>${hora[i]}</td>
                                                    <td>${fc[i]}</td>
                                                </tr>`;
            
                                                var data = [];
            
                                                for (var l = 0; l < fc.length; l++){
                                                    
                                                    var dataObject = new Object();
                                                    dataObject.y = hora[l];
                                                    dataObject.a = fc[l];
                                                    data.push(dataObject);
                                                    
                                                }
                                                
                                            }
            
                                            config = {
                                                data: data,
                                                xkey: 'y',
                                                ykeys: 'a',
                                                labels: ['Frecuencia cardiaca (bpm)'],
                                                fillOpacity: 0.5,
                                                hideHover: 'auto',
                                                behaveLikeLine: true,
                                                resize: true,
                                                pointFillColors:['#ffffff'],
                                                pointStrokeColors: ['black'],
                                                lineColors:['red','blue'],
                                                parseTime: false,
                                                backgroundColor: 'black'
                                            };
                                            config.element = 'area-chart';
                                            Morris.Area(config);
                                            // config.element = 'line-chart';
                                            // Morris.Line(config);
                                            
                                            if(edad < 2){
                                                for(var k = 0; k < fc.length; k++){
                                                    if(fc[k]<100){
                                                        bandAlert1 = 1;
                                                    }
                                                    else if(fc[k]>120){
                                                        bandAlert2 = 1;
                                                    }
                                                    else {
                                                        bandAlert3 = 1;
                                                    }
                                                }
                                            }
                                            else if(edad >= 2 && edad < 6){
                                                for(var k = 0; k < fc.length; k++){
                                                    if(fc[k]<80){
                                                        bandAlert1 = 1;
                                                    }
                                                    else if(fc[k]>120){
                                                        bandAlert2 = 1;
                                                    }
                                                    else {
                                                        bandAlert3 = 1;
                                                    }
                                                }
                                            }
                                            else if(edad >= 6 && edad < 13){
                                                for(var k = 0; k < fc.length; k++){
                                                    if(fc[k]<80){
                                                        bandAlert1 = 1;
                                                    }
                                                    else if(fc[k]>100){
                                                        bandAlert2 = 1;
                                                    }
                                                    else {
                                                        bandAlert3 = 1;
                                                    }
                                                }
                                            }
                                            else if(edad >= 13 && edad < 16){
                                                for(var k = 0; k < fc.length; k++){
                                                    if(fc[k]<70){
                                                        bandAlert1 = 1;
                                                    }
                                                    else if(fc[k]>80){
                                                        bandAlert2 = 1;
                                                    }
                                                    else {
                                                        bandAlert3 = 1;
                                                    }
                                                }
                                            }
                                            else if(edad >= 16){
                                                console.log('holaaa')
                                                for(var k = 0; k < fc.length; k++){
                                                    if(fc[k]<60){
                                                        bandAlert1 = 1;
                                                    }
                                                    else if(fc[k]>80){
                                                        bandAlert2 = 1;
                                                    }
                                                    else {
                                                        bandAlert3 = 1;
                                                    }
                                                }
                                            }

                                            console.log(bandAlert1);
                                            console.log(bandAlert2);
                                            console.log(bandAlert3);

                                            if(bandAlert1 && !bandAlert2){
                                                bandAlert1 = 0;
                                                alertaDatos.innerHTML = `
                                                    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                                                        <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                                        </symbol>
                                                    </svg>
                                                    <div class="alert alert-warning align-items-center d-block" role="alert">
                                                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                                                        <div">
                                                            El paciente tiene datos de frecuencia cardiaca por debajo de 40 bpm.
                                                        </div>
                                                    </div>
                                                `;
                                            }
                                            else if(!bandAlert1 && bandAlert2){
                                                bandAlert2 = 0;
                                                alertaDatos.innerHTML = `
                                                    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                                                        <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                                        </symbol>
                                                    </svg>
                                                    <div class="alert alert-warning align-items-center d-block" role="alert">
                                                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                                                        <div">
                                                            El paciente tiene datos de frecuencia cardiaca por encima de 120 bpm.
                                                        </div>
                                                    </div>
                                                `;
                                            }
                                            else if(!bandAlert1 && !bandAlert2 && bandAlert3){
                                                bandAlert3 = 0;
                                                alertaDatos.innerHTML = `
                                                    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                                                        <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                                        </symbol>
                                                    </svg>
                                                    <div class="alert alert-success align-items-center d-block" role="alert">
                                                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" style="text-align: center;" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
                                                        <div">
                                                            El paciente se encuentra dentro del rango de normalidad de frecuencia cardiaca.
                                                        </div>
                                                    </div>
                                                `;
                                            }
                                            else if(bandAlert1 && bandAlert2){
                                                bandAlert1 = 0;
                                                bandAlert2 = 0;
                                                alertaDatos.innerHTML = `
                                                    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                                                        <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                                        </symbol>
                                                    </svg>
                                                    <div class="alert alert-danger" role="alert">
                                                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                                                        <div">
                                                            De acuerdo a la edad, el paciente tiene datos de frecuencia cardiaca por encima y por debajo de los rangos normales. Se recomienda verificar en qué estado realizó la medición.
                                                        </div>
                                                    </div>
                                                `;
                                            }
                                        }

                                        
                                        if(band1 && band2 && band3){
                                            band1 = 0;
                                            band2 = 0;
                                            band3 = 0;
            
                                            inforoundedchart.innerHTML = `
                                                <h6>Este gráfico contiene la información del paciente, si estuvo en movimiento al momento de tomar la medición con la banda.</h6>
                                            `;
                                            console.log(calorias);
                                            console.log(distancia);
                                            console.log(pasos);
                                            var colorDanger = "#FF0606";
                                            var colorDanger2 = "#FF5E06";
                                            var colorDanger3 = "#FFD606";
                                            Morris.Donut({
                                            element: 'rounded-chart',
                                            resize: true,
                                            //labelColor:"#cccccc", // text color
                                            //backgroundColor: '#333333', // border color
                                            data: [
                                                {label: 'Calorías (cal)', value: calorias, color:colorDanger2},
                                                {label: 'Distancia (m)', value: distancia, color:colorDanger},
                                                {label: 'Pasos recorridos', value: pasos, color:colorDanger3}
                                                ]
                                            });
                                        }
                                        contboton.innerHTML = `
                                            <button type="button" class="btn btn-info" style="width: 100px;" onclick="guardarRep('${id1}', '${id2}', '${fecha}')">Enviar</button>
                                        `;
            
                                        if(id2 == 'Reporte'){
                                            
                                            // Mostrar reporte:
            
                                            if(reporte != ''){
                                                confirmar2.innerHTML = '';
                                                textrep.innerHTML = reporte;
                                            }
                                            else{
                                                textrep.innerHTML = '';
                                                confirmar2.innerHTML = `
                                                    <div class="alert alert-danger mt-3" role="alert" style="width: 300px;">
                                                        <h6 class="alert-heading">No hay un historial de reporte existente.</h6>
                                                    </div>
                                                `;
                                            }
                                        }
                                    })
                                })
                            }
                            else{
                                tabla2.innerHTML = '';
                                // linechart.innerHTML = '';
                                areachart.innerHTML = '';
                                roundedchart.innerHTML = '';
                                confirmar2.innerHTML = '';
                                textrep.innerHTML = '';
                                inforoundedchart.innerHTML = '';
                                fecha.innerHTML = '';
                                verifecha.innerHTML = `
                                    <div class="alert alert-danger mt-3" role="alert">
                                        <h6 class="alert-heading">No hay un reporte de medición para la fecha especificada.</h6>
                                    </div>
                                `;
                            }
                        });
                    }
                    else{
                        fecha.innerHTML = '';
                        verifecha.innerHTML = `
                            <div class="alert alert-danger mt-3" role="alert">
                                <h6 class="alert-heading">Formato de fecha erróneo. Por favor, ingrese nuevamente tal y como se muestra en el ejemplo.</h6>
                            </div>
                        `;
                    }
                    
                });

                confirmar.innerHTML = '';
                bandera = 1;
            }

            // Verifica si el paciente existe o no

            if (bandera == 1) {
                //console.log(bandera);
            }
            else {
                if(texto == ''){
                    bandera = 0;
                    document.getElementById('resultado0').value = '';
                    document.getElementById('resultado1').value = '';
                    document.getElementById('resultado2').value = '';
                    document.getElementById('resultado3').value = '';
                    document.getElementById('resultado4').value = '';
                    confirmar.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        <h6 class="alert-heading">Por favor, digite en el campo anterior un documento de identificación válido.</h6>
                    </div>
                    `;
                }
                else{
                    bandera = 0;
                    document.getElementById('resultado0').value = '';
                    document.getElementById('resultado1').value = '';
                    document.getElementById('resultado2').value = '';
                    document.getElementById('resultado3').value = '';
                    document.getElementById('resultado4').value = '';
                    botonload.innerHTML = '';
                    $('#boton').show();
                    confirmar.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        <h6 class="alert-heading">Paciente no encontrado o ingreso erróneo de documento. Por favor, vuelva a digitarlo.</h6>
                    </div>
                    `;
                }
            }

        });
    });  
}

boton.addEventListener('click', filtrar);

function guardarRep(id1, id2, fecha){

    var docPacientes = db.collection("pacientes");
    var text = document.getElementById("FormControlTextarea1").value;

    //Pregunta si existe un documento que contenga reporte
    if('Reporte' in docPacientes.doc(id1).collection(fecha)){
        
        // Guardar reporte
        
        docPacientes.doc(id1).collection(fecha).doc(id2).set({
            reporte: text
        },{merge: true})
        document.getElementById("FormControlTextarea1").value = '';
        document.getElementById("text-rep").value = text;

    }
    else{ //Si no existe, lo crea

        const newDocRef = docPacientes.doc(id1).collection(fecha).doc("Reporte");
        var newId = newDocRef.id;
        newDocRef.set({ 
            reporte: text
        });
        document.getElementById("FormControlTextarea1").value = '';
        document.getElementById("text-rep").value = text;
    }

    
}

function validarFormatoFecha(fecha) {
    var RegExPattern = /^\d{2,4}\-\d{1,2}\-\d{1,2}$/;
    if (fecha.match(RegExPattern)) {
          return true;
    } else {
          return false;
    }
}

function Alerta(fc, umin, umax, bandAlert1, bandAlert2, bandAlert3){

    for(var k = 0; k < fc.length; k++){
        if(fc[k]<umin){
            bandAlert1 = 1;
        }
        else if(fc[k]>umax){
            bandAlert2 = 1;
        }
        else {
            bandAlert3 = 1;
        }
    }
    return bandAlert1, bandAlert2, bandAlert3
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
