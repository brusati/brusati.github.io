class Objeto3D{

	constructor(buffer){
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.matrizModelado = mat4.create();
		this.posicion = vec3.from_values(0, 0, 0);
		this.rotacion = vec3.from_values(0, 0, 0);
		this.escala = vec3.from_values(1, 1, 1);
		this.hijos = [];
	}

	actualizarMatrizDeModelado(){
		mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
		mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion);
		mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
	}

	dibujar(matPadre){
		var m = mat4.create();
		actualizarMatrizDeModelado();
		//concatenamos la matriz de transformación del padre con la del hijo
		mat4.multiply(m, matPadre, this.matrizModelado)

		if (this.vertexBuffer && this.indexBuffer){
			//acá
		}

		for (var i = 0; i < this.hijos.length; i++){
			hijos[i].dibujar(m)
		}
	}

	setGeometria(vertexBuffer, indexBuffer){
		this.vertexBuffer = vertexBuffer;
		this.indexBuffer = indexBuffer;		
	}

	agregarHijo(hijo){
		this.hijos.push(hijo);
	}

	setPosicion(x, y, z){
		this.posicion = vec3.fromValues(x, y, z);
	}

	setRotacion(x, y, z){
		this.rotacion = vec3.fromValues(x, y, z);
	}

	setEscala(x, y, z){
		this.escala = vec3.fromValues(x, y, z);
	}
}