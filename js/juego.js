/*
Tutorial Game of Life (Coding train)
https://www.youtube.com/watch?v=FWSR_7kZuYg

Más información sobre Conway's Game of Life
http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life#Patterns

*/

var canvas;
var ctx;
var fps= 50;

var canvasX = 700;
var canvasY = 700;

var tileX;
var tileY;


//Variable para el tablero junto con sus dimensiones
var tablero;
var filas = 100;
var columnas = 100;

var negro = '#000000';
var blanco = '#FFFFFF';



//CADA CASILLA TENDRÁ UN AGENTE
var Agente = function(y,x,vivo){

	this.x = x;
	this.y = y;
	this.vivo = vivo;	//vivo=1 / muerto=0

	this.estadoProx = this.vivo;	//indica el estado que tendrá el agente en la siguiente generación

	this.vecinos = [];

	
	//Método que determina sus vecinos (se usa la primera vez, al crear el agente)
	this.addVecinos = function(){
		
		var xVecino;
		var yVecino;
		
		for(var i=-1; i<2; i++){
			for(var j=-1; j<2; j++){
				
				//Usamos el operador módulo para continuar por los márgenes opuestos al salirnos de la pantalla
				xVecino = (j + this.x + columnas) % columnas;
				yVecino = (i + this.y + filas) % filas;
				
				//siempre que no estemos en (0,0) ya que seríamos nosotros mismos
				if(i!=0 || j!=0){
					this.vecinos.push(tablero[yVecino][xVecino]);
				}
				
			}
		}
		
	}
	
	
	//Método que calcula el estado siguiente en función de sus vecinos
	this.nuevoCiclo = function(){
		
		var suma = 0;
		
		for(var i=0; i<this.vecinos.length; i++){
			
			//Si el vecino está vivo, sumamos
			if(this.vecinos[i].vivo == 1){
				suma++;
			}

		}//for
		
		//--------------------------------------
		//REGLAS PARA SABER EL PRÓXIMO VALOR
		
		//valor por defecto (se queda como estaba)
		this.estadoProx = this.vivo;
		
		//Reproducción: si la casilla está vacía (muerto) y hay justo 3 vecinos, se crea vida
		if(this.vivo == 0 && suma == 3){
			this.estadoProx = 1;
		}
		
		//Muerte: si hay sobrepoblación (más de 3 vecinos) o se está aislado (menos de 2 vecinos) no se sobrevive
		if(this.vivo == 1 && (suma <2 || suma >3)){
			this.estadoProx = 0;
		}
		
	}
	
	
	//Método para cambiar al ciclo siguiente
	this.mutacion = function(){
		this.vivo = this.estadoProx;
	}
	
	
	//Método que dibuja el agente en el tablero
	this.dibuja = function(){
		
		if(this.vivo == 1)
			color = negro;
		else
			color = blanco;
		
		ctx.fillStyle = color;
		ctx.fillRect(this.x*tileX,this.y*tileY,tileX,tileY);
	}

}



//Función que crea un array 2D y devuelve el objeto
function creaArray2D(rows,cols){
	var obj = new Array(rows);
	for(y=0;y<rows;y++){
		obj[y] = new Array(cols);
	}
	return obj;
}


//Crea un agente para cada casilla del tablero
function inicializaTablero(obj){
	
	var estado;
	
	for(y=0;y<filas;y++){
		for(x=0;x<columnas;x++){
			
			estado = Math.floor(Math.random()*2);
			obj[y][x] = new Agente(y,x,estado);
		}
	}
	
	
	for(y=0;y<filas;y++){
		for(x=0;x<columnas;x++){
			obj[y][x].addVecinos();
		}
	}
	
}



function borraCanvas(){
  canvas.width=canvas.width;
  canvas.height=canvas.height;
}



function inicia(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	canvas.width=canvasX;
	canvas.height=canvasY;
	
	//Calculamos el tamaño de los tiles para que sea proporcionado
	tileX = Math.floor(canvasX/filas);
	tileY = Math.floor(canvasY/columnas);
	
	//Creamos el tablero
	tablero = creaArray2D(filas,columnas);

	inicializaTablero(tablero);
	

	setInterval(function(){principal();},1000/fps);

}



function dibujaTablero(obj){
	
	//DIBUJAMOS
	for(y=0;y<filas;y++){
		for(x=0;x<columnas;x++){
			
			obj[y][x].dibuja();
		
		}
	}
	
	//CALCULAMOS EL SIGUIENTE CICLO
	for(y=0;y<filas;y++){
		for(x=0;x<columnas;x++){
			obj[y][x].nuevoCiclo();
		}
	}
	

	//APLICAMOS LOS DATOS DEL CICLO NUEVO (Actualizamos)
	for(y=0;y<filas;y++){
		for(x=0;x<columnas;x++){
			obj[y][x].mutacion();
		}
	}
}




function principal(){
	borraCanvas();
	dibujaTablero(tablero);
}