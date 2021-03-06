/*

    Tareas:
    ------

    1) Modificar a función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)
        
        
    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
    
*/

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }

var forma= getUrlVars()["forma"]

var SUPERFICIES = {
    plano: new Plano(3, 3),
    esfera: new Esfera(3),
    tubosenoidal: new TuboSenoidal(0.3, 0.2, 3, 3),
    cilindro: new Cilindro(3),
    paraboloide: new ParaboloideHiperbolico()
};


var superficie3D;
var mallaDeTriangulos;

var filas=100;
var columnas=100;


function crearGeometria(){
    superficie3D= SUPERFICIES[forma];
    mallaDeTriangulos=generarSuperficie(superficie3D,filas,columnas);
}

function dibujarGeometria(){
    dibujarMalla(mallaDeTriangulos);
}

function productoVectorial(v1, v2){
    var resultado = [];
    resultado[0] = v1[1] * v2[2] - v1[2] * v2[1];
    resultado[1] = v1[2] * v2[0] - v1[0] * v2[2];
    resultado[2] = v1[0] * v2[1] - v1[1] * v2[0];
    return resultado;
}

function restarArrays(v1, v2){
    var resultado = [];
    for (var i = 0; i < v1.length; i++){
        resultado[i] = v1[i] - v2[i];
    }
    return resultado;
}

function ParaboloideHiperbolico(){

    this.getPosicion=function(u,v){

        var x = (u - 0.5) * 3;
        var z = (v - 0.5) * 3;
        var y = z * z - x * x;
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        let p0 = this.getPosicion(u, v);
        let p1 = this.getPosicion(u + 0.001, v);
        let p2 = this.getPosicion(u, v + 0.001);
        return productoVectorial(restarArrays(p1, p0), restarArrays(p2, p0));
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Plano(ancho,largo){

    this.getPosicion=function(u,v){

        var x=(u-0.5)*ancho;
        var z=(v-0.5)*largo;
        return [x,0,z];
    }

    this.getNormal=function(u,v){
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Esfera(radio){

    this.getPosicion=function(u,v){

        var x = radio * Math.sin(v * Math.PI) * Math.cos(u * Math.PI * 2);
        var y = radio * Math.sin(v * Math.PI) * Math.sin(u * Math.PI * 2);
        var z = radio * Math.cos(v * Math.PI);
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        let p0 = this.getPosicion(u, v);
        let p1 = this.getPosicion(u + 0.001, v);
        let p2 = this.getPosicion(u, v + 0.001);
        return productoVectorial(restarArrays(p1, p0), restarArrays(p2, p0));
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Cilindro(radio){

    this.getPosicion=function(u,v){

        var x = radio * Math.cos(u * Math.PI * 2);
        var z = radio * Math.sin(u * Math.PI * 2);
        var y = (v - 0.5) * 3;
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        let p0 = this.getPosicion(u, v);
        let p1 = this.getPosicion(u + 0.001, v);
        let p2 = this.getPosicion(u, v + 0.001);
        return productoVectorial(restarArrays(p1, p0), restarArrays(p2, p0));
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function TuboSenoidal(amplitud, longitud_de_onda, radio, altura){

    this.getPosicion=function(u,v){
        var aux = amplitud * Math.sin((2 * Math.PI * v) / longitud_de_onda);

        var x = (radio + aux) * Math.cos(u * Math.PI * 2);
        var z = (radio + aux) * Math.sin(u * Math.PI * 2);
        var y = (v - 0.5) * altura;
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        let p0 = this.getPosicion(u, v);
        let p1 = this.getPosicion(u + 0.001, v);
        let p2 = this.getPosicion(u, v + 0.001);
        return productoVectorial(restarArrays(p1, p0), restarArrays(p2, p0));
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}



function generarSuperficie(superficie,filas,columnas){
    
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    // Buffer de indices de los triángulos
    
    indexBuffer=[];  
    columnas++;
    filas++;

    // completar la lógica necesaria para llenar el indexbuffer en funcion de filas y columnas
    // teniendo en cuenta que se va a dibujar todo el buffer con la primitiva "triangle_strip"

    for (i=0; i < filas - 1; i++) {
        for (j=0; j < columnas; j++) {
            indexBuffer.push(i * columnas + j);
            indexBuffer.push((i + 1) * columnas + j);
        }

        if (i != filas - 2){
        indexBuffer.push((i + 1) * columnas + (columnas - 1));
        indexBuffer.push((i + 1) * columnas);
        }
    }
    console.dir(indexBuffer); //imprimo el arreglo por consola

    // Creación e Inicialización de los buffers

    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
       
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
        /*
            Aqui es necesario modificar la primitiva por triangle_strip
        */
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}

