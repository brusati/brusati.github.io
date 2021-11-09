class MiObjeto{

	constructor(){
		this.malla_de_triangulos = generarSuperficie(new Esfera(3), 100, 100);
		this.esfera = new Objeto3D(this.malla_de_triangulos);
	}

	setPosicion(x, y, z){
		this.esfera.setPosicion(x, y, z);
	}

	setRotacion(x, y, z){
		this.esfera.setRotacion(x, y, z);
	}

	dibujar(matrizPadre){
		this.esfera.dibujar(matrizPadre);
	}
}