class Objeto3D{

	constructor(mallaTriangulos){
		this.malla = mallaTriangulos;
		console.log(this.malla);

		this.matrizModelado = mat4.create();
		this.normalMatrix = mat4.create();

		this.posicion = vec3.fromValues(0, 0, 0);
		this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;
		this.escala = vec3.fromValues(1, 1, 1);

		this.hijos = [];
		this.color = [0, 0, 1];
	}

	actualizarMatrizDeModelado(){
		mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
		mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotX, [1, 0, 0]);
		mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotY, [0, 1, 0]);
		mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotZ, [0, 0, 1]);
		mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
	}

	dibujar(matrizPadre){
		var m = mat4.create();

		this.actualizarMatrizDeModelado();

		if (matrizPadre != null){
			mat4.multiply(m, matrizPadre, this.matrizModelado)
		}

		if (this.malla){
			dibujarMalla(this.malla);
		}

		for (var i = 0; i < this.hijos.length; i++){
			this.hijos[i].dibujar(m)
		}
	}

	setGeometria(mallaTriangulos){
		this.malla = mallaTriangulos;	
	}

	agregarHijo(hijo){
		this.hijos.push(hijo);
	}

	setPosicion(x, y, z){
		this.posicion = vec3.fromValues(x, y, z);
	}

	setRotacion(x, y, z){
		this.rotX = x;
		this.rotY = y;
		this.rotZ = z;
	}

	setEscala(x, y, z){
		this.escala = vec3.fromValues(x, y, z);
	}
}
