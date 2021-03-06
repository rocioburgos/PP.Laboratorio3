/// <reference path="./producto.ts" />
/// <reference path="./televisor.ts" />
var PrimerParcial;
(function (PrimerParcial) {
    var Manejadora = /** @class */ (function () {
        function Manejadora() {
        }
        Manejadora.AgregarTelevisor = function () {
            if (Manejadora.AdministrarValidaciones()) {
                var opcion = document.getElementById("btn-agregar").value;
                var codigo = parseInt(document.getElementById("codigo").value);
                var marca = document.getElementById("marca").value;
                var precio = parseInt(document.getElementById("precio").value);
                var tipo = document.getElementById("tipo").value;
                var pais = document.getElementById("pais").value;
                var foto = document.getElementById("foto");
                //Manejadora.AdministrarValidaciones();
                alert("ok");
                var unTelevisor = new Entidades.Televisor(codigo, marca, precio, tipo, pais, foto.files[0].name); //(codigo,nombre,precio,talle,color,retJSON.ruta);
                var xhttp_1 = new XMLHttpRequest();
                xhttp_1.open("POST", "BACKEND/administrar.php", true);
                xhttp_1.setRequestHeader("enctype", "multipart/form-data");
                PrimerParcial.Manejadora.AdministrarSpinner(true);
                var form = new FormData();
                form.append('foto', foto.files[0]);
                console.log(unTelevisor.televisorToJson());
                form.append('cadenaJson', JSON.stringify(unTelevisor.televisorToJson()));
                if (opcion == "Agregar") {
                    form.append('caso', "agregar");
                    xhttp_1.send(form);
                    xhttp_1.onreadystatechange = function () {
                        if (xhttp_1.readyState == 4 && xhttp_1.status == 200) {
                            alert(xhttp_1.responseText);
                            var retJSON = JSON.parse(xhttp_1.responseText);
                            if (retJSON.TodoOK) {
                                PrimerParcial.Manejadora.LimpiarForm();
                                alert("operacion realizada");
                            }
                        }
                    };
                }
                else {
                    form.append('caso', "modificar");
                    xhttp_1.send(form);
                    xhttp_1.onreadystatechange = function () {
                        if (xhttp_1.readyState == 4 && xhttp_1.status == 200) {
                            alert(xhttp_1.responseText);
                            var retJSON = JSON.parse(xhttp_1.responseText);
                            if (retJSON.TodoOK) {
                                alert("operacion realizada");
                                PrimerParcial.Manejadora.MostrarTelevisores();
                            }
                        }
                    };
                }
                PrimerParcial.Manejadora.AdministrarSpinner(false);
                PrimerParcial.Manejadora.LimpiarForm();
            }
            else {
                alert("Hay errores.");
            }
        };
        Manejadora.MostrarTelevisores = function () {
            var xmlhttp = new XMLHttpRequest();
            var div = document.getElementById("divTabla");
            xmlhttp.open("POST", "./BACKEND/administrar.php", true);
            xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("caso=traer");
            PrimerParcial.Manejadora.AdministrarSpinner(true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var response = JSON.parse(xmlhttp.responseText);
                    div.innerHTML = "";
                    var tabla = "<table border='1'><tr>\n                <td>Codigo</td>\n                <td>Marca</td>\n                <td>Precio</td>\n                <td>Tipo</td>\n                <td>Pais</td>\n                <td>Foto</td></tr>";
                    for (var i = 0; i < response.length; i++) {
                        var tv = response[i];
                        tabla += "<tr><td>" + tv.codigo + "</td><td>" + tv.marca + "</td><td>" + tv.precio + "</td><td>" + tv.tipo + "</td><td>" + tv.pais + "</td><td><img src='./BACKEND/fotos/" + tv.pathFoto + "' height='50px' width='50px'> </td> <td><input type='button' value='Eliminar' onclick='PrimerParcial.Manejadora.EliminarTelevisor(" + JSON.stringify(tv) + ")'</td><td><input type='button' value='Modificar' onclick='PrimerParcial.Manejadora.ModificarTelevisor(" + JSON.stringify(tv) + ")'></td></tr>";
                    }
                    PrimerParcial.Manejadora.AdministrarSpinner(false);
                    div.innerHTML += tabla + "</table>";
                }
            };
        };
        //     
        Manejadora.GuardarEnLocalStorage = function () {
            var xmlhttp = new XMLHttpRequest();
            var div = document.getElementById("divTabla");
            xmlhttp.open("POST", "./BACKEND/administrar.php", true);
            xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("caso=traer");
            PrimerParcial.Manejadora.AdministrarSpinner(true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    localStorage.setItem("televisores_local_storage", xmlhttp.responseText);
                    PrimerParcial.Manejadora.AdministrarSpinner(false);
                    alert("Operacion realizada");
                }
            };
        };
        Manejadora.VerificarExistencia = function () {
            var codigo = parseInt(document.getElementById("codigo").value);
            var localJson = localStorage.getItem("televisores_local_storage");
            var existe = false;
            if (localJson != null) {
                var json = JSON.parse(localJson);
                for (var i = 0; i < json.length; i++) {
                    if (json[i].codigo == codigo) {
                        alert("El televisor ya existe");
                        console.log("El televisor ya existe");
                        existe = true;
                    }
                }
                if (!existe) {
                    PrimerParcial.Manejadora.AgregarTelevisor();
                    localStorage.setItem("televisores_local_storage", "");
                    PrimerParcial.Manejadora.GuardarEnLocalStorage();
                }
            }
            else {
                alert("El token esta vacio");
                console.log("El token esta vacio");
            }
            PrimerParcial.Manejadora.LimpiarForm();
        };
        Manejadora.EliminarTelevisor = function (eliminar) {
            var tvEliminar = eliminar;
            if (confirm("Desea eliminar a " + tvEliminar.codigo + " " + tvEliminar.tipo)) {
                PrimerParcial.Manejadora.AdministrarSpinner(true);
                var xmlhttp_1 = new XMLHttpRequest();
                xmlhttp_1.open("POST", "./BACKEND/administrar.php", true);
                xmlhttp_1.setRequestHeader("content-type", "application/x-www-form-urlencoded");
                xmlhttp_1.send("caso=eliminar&cadenaJson=" + JSON.stringify(eliminar));
                xmlhttp_1.onreadystatechange = function () {
                    if (xmlhttp_1.readyState == 4 && xmlhttp_1.status == 200) {
                        var retJson = JSON.parse(xmlhttp_1.responseText);
                        if (retJson.TodoOK) {
                            alert("eliminado");
                            PrimerParcial.Manejadora.AdministrarSpinner(false);
                            PrimerParcial.Manejadora.MostrarTelevisores();
                        }
                    }
                };
            }
            else {
                alert("Accion cancelada");
            }
        };
        Manejadora.ModificarTelevisor = function (modificar) {
            var tvModificar = modificar;
            document.getElementById("codigo").value = tvModificar.codigo;
            document.getElementById("marca").value = tvModificar.marca;
            (document.getElementById("precio").value) = tvModificar.precio;
            (document.getElementById("tipo").value) = tvModificar.tipo;
            (document.getElementById("codigo").readOnly) = true;
            document.getElementById("pais").value = tvModificar.pais;
            document.getElementById("imgFoto").src = "./BACKEND/fotos/" + tvModificar.pathFoto;
            //   ((<HTMLInputElement>document.getElementById("foto")).value)="./BACKEND/fotos/"+tvModificar.pathFoto;
            document.getElementById("btn-agregar").value = "Modificar";
        };
        Manejadora.FiltrarPorPais = function () {
            var paisSelec = document.getElementById("pais").value;
            var xmlhttp = new XMLHttpRequest();
            var div = document.getElementById("divTabla");
            xmlhttp.open("POST", "./BACKEND/administrar.php", true);
            xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("caso=traer");
            PrimerParcial.Manejadora.AdministrarSpinner(true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var response = JSON.parse(xmlhttp.responseText);
                    div.innerHTML = "";
                    var tabla = "<table border='1'><tr>\n                <td>Codigo</td>\n                <td>Marca</td>\n                <td>Precio</td>\n                <td>Tipo</td>\n                <td>Pais</td>\n                <td>Foto</td></tr>";
                    for (var i = 0; i < response.length; i++) {
                        var tv = response[i];
                        if (tv.pais == paisSelec) {
                            tabla += "<tr><td>" + tv.codigo + "</td><td>" + tv.marca + "</td><td>" + tv.precio + "</td><td>" + tv.tipo + "</td><td>" + tv.pais + "</td><td><img src='./BACKEND/fotos/" + tv.pathFoto + "' height='50px' width='50px'> </td> <td><input type='button' value='Eliminar' onclick='PrimerParcial.Manejadora.EliminarTelevisor(" + JSON.stringify(tv) + ")'</td><td><input type='button' value='Modificar' onclick='PrimerParcial.Manejadora.ModificarTelevisor(" + JSON.stringify(tv) + ")'></td></tr>";
                        }
                    }
                    PrimerParcial.Manejadora.AdministrarSpinner(false);
                    div.innerHTML += tabla + "</table>";
                }
            };
            /*   let xmlhttp : XMLHttpRequest = new XMLHttpRequest();
               xmlhttp.open("POST", "./BACKEND/administrar.php", true);
               xmlhttp.setRequestHeader("content-type","application/x-www-form-urlencoded");
               xmlhttp.send("caso=taer");
               
           //    Test.Manejadora.AdministrarSpinner(true);
               
               let div= (<HTMLDivElement>document.getElementById("divTabla"));
               xmlhttp.onreadystatechange = function() {
                   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                       alert(xmlhttp.responseText);
                       let response=JSON.parse( xmlhttp.responseText);
                       alert(response);
                       div.innerHTML=""
                       var tabla =`<table border='1'><tr>
                       <td>Codigo</td>
                       <td>Marca</td>
                       <td>Precio</td>
                       <td>Tipo</td>
                       <td>Pais</td>
                       <td>Foto</td></tr>`;
                       for(let i=0; i< response.length; i++){
                           
                           let tv= response[i];
                           if(tv.pais==paisSelec)
                           {
                              tabla+="<tr><td>"+tv.codigo +"</td><td>"+tv.marca+"</td><td>"+tv.precio+"</td><td>"+tv.tipo+"</td><td>"+tv.pais+"</td><td><img src='./BACKEND/fotos/"+ tv.pathFoto+"' height='50px' width='50px'> </td> <td><input type='button' value='Eliminar' onclick='PrimerParcial.Manejadora.EliminarTelevisor("+JSON.stringify(tv)+")'</td><td><input type='button' value='Modificar' onclick='PrimerParcial.Manejadora.ModificarTelevisor("+JSON.stringify(tv)+")'></td></tr>";
                           }
                       }
                 
                     
                     // Test.Manejadora.AdministrarSpinner(false);
                       div.innerHTML+=tabla+"</table>";
                   }
               }*/
        };
        Manejadora.CargarPaises = function () {
            var paisSelec = document.getElementById("pais");
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "./BACKEND/administrar.php", true);
            xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("caso=paises");
            PrimerParcial.Manejadora.AdministrarSpinner(true);
            xmlhttp.onreadystatechange = function () {
                paisSelec.innerHTML = "";
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var response = JSON.parse(xmlhttp.responseText);
                    for (var i = 0; i < response.length; i++) {
                        paisSelec.innerHTML += "<option>" + response[i].descripcion + "</option>";
                    }
                    PrimerParcial.Manejadora.AdministrarSpinner(false);
                }
            };
        };
        Manejadora.LimpiarForm = function () {
            document.getElementById("codigo").value = "";
            document.getElementById("marca").value = "";
            (document.getElementById("precio").value) = "";
            (document.getElementById("tipo").value) = "";
            (document.getElementById("imgFoto").src) = "./BACKEND/fotos/tv_defecto.jpg";
            document.getElementById("pais").value = "Argentina";
        };
        Manejadora.AdministrarSpinner = function (mostrar) {
            if (mostrar) {
                document.getElementById("divSpinner").style.display = "block";
                //  (<HTMLImageElement>document.getElementById("imgSpinner")).src="./BACKEND/gif-load.gif";
            }
            else {
                document.getElementById("divSpinner").style.display = "none";
            }
        };
        //codigo - marca- precio-tipo - pais- foto
        Manejadora.AdministrarValidaciones = function () {
            var retorno = true;
            //codigo
            var codigo = parseInt(document.getElementById("codigo").value);
            if (!this.ValidarCamposVacios("codigo") || !this.ValidarCodigo(codigo)) {
                Manejadora.AdministrarSpanErrores("codigo", true);
                retorno = false;
            }
            else {
                Manejadora.AdministrarSpanErrores("codigo", false);
            }
            //marca
            if (!this.ValidarCamposVacios("marca")) {
                Manejadora.AdministrarSpanErrores("marca", true);
                retorno = false;
            }
            else {
                Manejadora.AdministrarSpanErrores("marca", false);
            }
            //precio
            if (!this.ValidarCamposVacios("precio")) {
                Manejadora.AdministrarSpanErrores("precio", true);
                retorno = false;
            }
            else {
                Manejadora.AdministrarSpanErrores("precio", false);
            }
            //foto
            if (!this.ValidarCamposVacios("foto")) {
                Manejadora.AdministrarSpanErrores("foto", true);
                retorno = false;
            }
            else {
                Manejadora.AdministrarSpanErrores("foto", false);
            }
            //tipo
            var tipo = document.getElementById("tipo").value;
            var permitidos = ["Tubo", "Plasma", "Led", "Smart", "4K", "8K"];
            if (!this.ValidarCamposVacios("tipo") || !this.ValidarTipo(tipo, permitidos)) {
                Manejadora.AdministrarSpanErrores("tipo", true);
                retorno = false;
            }
            else {
                Manejadora.AdministrarSpanErrores("tipo", false);
            }
            return retorno;
        };
        /*ValidarCamposVacios(string): boolean. Recibe como parámetro el valor del atributo
        id del campo a ser validado. Retorna true si no está vacío o false caso contrario. */
        Manejadora.ValidarCamposVacios = function (id) {
            var valor = (document.getElementById(id).value);
            if (valor.length > 0) {
                return true;
            }
            else {
                return false;
            }
        };
        /*ValidarTipo(string, string[]): boolean. Recibe como parámetro el valor a ser validado
        y los valores permitidos para los tipos (Tubo, Plasma, Led, Smart, 4K, 8K). Retorna true
        si el valor pertenece a los tipos o false caso contrario. */
        Manejadora.ValidarTipo = function (valor, tiposPermiditos) {
            for (var i = 0; i < tiposPermiditos.length; i++) {
                if (tiposPermiditos[i] == valor) {
                    return true;
                }
            }
            return false;
        };
        /*ValidarCodigo(number): boolean. Recibe como parámetro el valor del código a ser validado y
        retorna true si el mismo es mayor o igual a 523 y menor a 1000. False caso contrario. */
        Manejadora.ValidarCodigo = function (valor) {
            if (valor >= 523 && valor < 1000) {
                return true;
            }
            else {
                return false;
            }
        };
        Manejadora.AdministrarSpanErrores = function (id, mostrar) {
            if (mostrar) {
                document.getElementById(id).nextElementSibling.style.display = "block";
            }
            else {
                document.getElementById(id).nextElementSibling.style.display = "none";
            }
        };
        Manejadora.VerificarSpan = function () {
            var boolRetorno = true;
            var todoSpan = document.querySelectorAll("span");
            for (var i = 0; i < todoSpan.length; i++) {
                if (todoSpan[i].style.display == "block") {
                    boolRetorno = false;
                    break;
                }
            }
            return boolRetorno;
        };
        return Manejadora;
    }());
    PrimerParcial.Manejadora = Manejadora;
})(PrimerParcial || (PrimerParcial = {}));
