//Piezas

const allPiezas = [
    {
        nombre: "C",
        forma: [
            [1, 1, 1],
            [1, 0, 1]
        ],
        probabilidad: 0.2,
        color: "red"
    },

    {
        nombre: "|",
        forma: [[1, 1, 1, 1]],
        probabilidad: 0.1,
        color: "cyan"
    },

    {
        nombre: "L",
        forma: [
            [1, 1, 1],
            [1, 0, 0]
        ],
        probabilidad: 0.15,
        color: "orange"
    },

    {
        nombre: "J",
        forma: [
            [1, 1, 1],
            [0, 0, 1]
        ],
        probabilidad: 0.15,
        color: "blue"
    },

    {
        nombre: "Z",
        forma: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        probabilidad: 0.1,
        color: "red"
    },

    {
        nombre: "S",
        forma: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        probabilidad: 0.1,
        color: "green"
    },

    {
        nombre: "O",
        forma: [
            [1, 1],
            [1, 1]
        ],
        probabilidad: 0.1,
        color: "yellow"
    },

    {
        nombre: "T",
        forma: [
            [0, 1, 0],
            [1, 1, 1]

        ],
        probabilidad: 0.1,
        color: "purple"
    },
]

//iniciamos el canvas

const canvas = document.getElementById("tetris");
const lienzo = canvas.getContext("2d");

const filas = 20;
const columnas = 10;
const tamanoCeldas = 30;//Tamaño de las celdas;
lienzo.scale(tamanoCeldas, tamanoCeldas);

//segundo canvas con la siguiente pieza

const canvas2 = document.getElementById("pieza2");
const cuadrado = canvas2.getContext("2d");

const lineas = 5;
const col = 5;
const cuadros = 30;//Tamaño de las celdas;
cuadrado.scale(cuadros, cuadros);

//VARIABLES

let pieza = {};
let nextPieza = {};
let tablero = [];
let puntos = 0;
let velocidad = 500;
let turno = 0;
let primeraficha = true;

//Creamos el tablero con la longitud
creartablero(filas, columnas);

function creartablero(x, y) {
    for (let i = 0; i < x; i++) {
        let fila = [];
        for (let j = 0; j < y; j++) {
            //prueba de si hay algo pinta
            // fila.push(Math.random() < 0.5 ? 0 : 1);
            fila.push(0);

        }
        tablero.push(fila);
    }

}

function FinDelJuego(x, y) {
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            tablero[i][j] = 1;
        }
    }
}

//Creamos la piezaque juega primera

generarPieza()

function generarPieza() {

    // Creamos un "pool" de piezas basado en la probabilidad
    const poolDePiezas = [];

    // Rellenamos el "pool" según las probabilidades
    allPiezas.forEach(pieza => {
        const veces = Math.floor(pieza.probabilidad * 100); // Aumentamos la probabilidad de aparición
        for (let i = 0; i < veces; i++) {
            poolDePiezas.push(pieza);
        }
    });

    // Seleccionamos aleatoriamente una pieza del "pool"(es la primera)

    if (primeraficha) {
        //1º
        const nuevaPieza = poolDePiezas[Math.floor(Math.random() * poolDePiezas.length)];
        pieza = {
            nombre: nuevaPieza.nombre,
            forma: nuevaPieza.forma,
            color: nuevaPieza.color,
            posicion: {
                x: 4,
                y: 0
            },
        };
        primeraficha = false;

        //sacamos una pieza del poll
        nextPieza = poolDePiezas[Math.floor(Math.random() * poolDePiezas.length)];

        //siguiente pieza
        nextPieza = {
            nombre: nextPieza.nombre,
            forma: nextPieza.forma,
            color: nextPieza.color,
            posicion: {
                x: 2,
                y: 1
            },
        }
    } else {

        //2º,3º,4º,...
        const nuevaPieza = nextPieza;

        pieza = {
            nombre: nuevaPieza.nombre,
            forma: nuevaPieza.forma,
            color: nuevaPieza.color,
            posicion: {
                x: 4,
                y: 0
            },
        }

        //sacamos una pieza del poll
        nextPieza = poolDePiezas[Math.floor(Math.random() * poolDePiezas.length)];
        //siguiente pieza
        nextPieza = {
            nombre: nextPieza.nombre,
            forma: nextPieza.forma,
            color: nextPieza.color,
            posicion: {
                x: 2,
                y: 1
            },
        }
    };
}

//siguiente pieza dibujada

function dibujar2Pieza(pieza, x, y) {
    pieza.forma.forEach((linea, newY) => {
        linea.forEach((valor, newX) => {
            if (valor) {
                cuadrado.fillStyle = pieza.color; // Cambiar a cuadrado
                cuadrado.fillRect(newX + x, newY + y, 1, 1);
            }
        });
    });
}

//Loop 

let intervalo = setInterval(() => jugar(), velocidad);

function jugar() {

    dibujarTablero();
    dibujarPieza(pieza, pieza.posicion.x, pieza.posicion.y);
    dibujarCuadrado()
    dibujar2Pieza(nextPieza, nextPieza.posicion.x, nextPieza.posicion.y);
    document.getElementById("puntos").innerHTML = "<h2> Puntos: " + puntos + "</h2>"; //imprimimos por pantalla los puntos
    pieza.posicion.y++;

    if (turno % 5 === 0 && turno !== 0) {
        velocidad = Math.max(200, velocidad - 50); //reducimos el tiempo en que que hace cada loop (+rapido,minimo 200 milisegundos) 
        clearInterval(intervalo);//paramos el intervalo
        intervalo = setInterval(() => jugar(), velocidad);//seguimos jugando con el tiempo modificado
    }

    //si se llega arriba se para
    if (!actualizar()) {
        clearInterval(intervalo);
        FinDelJuego(filas, columnas);
        dibujarTablero();
    };


}

//comprobaciones

function actualizar() {

    if (chequearColisiones(pieza, pieza.posicion.x, pieza.posicion.y)) {
        pieza.posicion.y--;
        posicionaPieza(pieza, pieza.posicion.x, pieza.posicion.y);
        eliminarLinea();
        generarPieza();
        if (chequearColisiones(pieza, pieza.posicion.x, pieza.posicion.y)) {
            alert(`FIN DE LA PARTIDA, este juego ha sido desarrollado por Yesua Ibáñez`);
            return false;//paramos el juego
        }
    }
    return true;//se sigue jugando

}

//se pinta la matriz dependiendo si hay una pieza o no

function dibujarTablero() {

    lienzo.fillStyle = "black";
    lienzo.fillRect(0, 0, canvas.width, canvas.height);

    tablero.forEach((linea, y) => {
        linea.forEach((valor, x) => {
            if (valor) {
                lienzo.fillStyle = 'grey';
                lienzo.fillRect(x, y, 1, 1);
            }
        })
    });
}

//se pinta el cuadro con donde estara la siguiente pieza

function dibujarCuadrado() {
    cuadrado.fillStyle = "black";
    cuadrado.fillRect(0, 0, canvas2.width, canvas2.height);
}

//dibujamos la pieza (aux por ahora)

function dibujarPieza(pieza, x, y) {
    pieza.forma.forEach((linea, newY) => {
        linea.forEach((valor, newX) => {
            if (valor) {
                lienzo.fillStyle = pieza.color;
                lienzo.fillRect(newX + x, newY + y, 1, 1);
            }
        })
    });
}

//colisiones

function chequearColisiones(pieza, x, y) {

    for (let newY = 0; newY < pieza.forma.length; newY++) {
        for (let newX = 0; newX < pieza.forma[newY].length; newX++) {
            if (pieza.forma[newY][newX] !== 0) { //miram si la pocion de la pieza no es un campo vacio
                const filaTablero = tablero[newY + y];
                if (filaTablero && filaTablero[newX + x] !== 0) { //miramos que tanto en la linea como en la columna sean 0 (no hay ninguna pieza)
                    return true; // Hay colisión
                }
                if (newY + y >= tablero.length) {
                    return true; //Llego al limite
                }
            }
        }
    }
    return false; // No hay colisión
}

//llega al final de la columna

function posicionaPieza(pieza, x, y) {
    pieza.forma.forEach((linea, newY) => {
        linea.forEach((valor, newX) => {
            if (valor == 1) {
                tablero[newY + y][newX + x] = 1
            }
        })
    })

    pieza.posicion.x = 4;//cambiar pieza por pieza
    pieza.posicion.y = 0;
    turno++;//se suma 1 al marcador de turnos 
    eliminarLinea()//comprobamos si se lleno la linea
};

//controles

document.addEventListener('keypress', event => {

    if (event.key === 'w') {
        girarPieza(pieza);
    }
    if (event.key === 'a') {
        pieza.posicion.x--
        if (chequearColisiones(pieza, pieza.posicion.x, pieza.posicion.y)) {
            pieza.posicion.x++;
        }
    }
    if (event.key === 'd') {
        pieza.posicion.x++
        if (chequearColisiones(pieza, pieza.posicion.x, pieza.posicion.y)) {
            pieza.posicion.x--;
        }
    }
    if (event.key === 's') {
        pieza.posicion.y++
        if (chequearColisiones(pieza, pieza.posicion.x, pieza.posicion.y)) {
            pieza.posicion.y--;
        }
    }
    dibujarTablero();
    dibujarPieza(pieza, pieza.posicion.x, pieza.posicion.y);
})

//girar la pieza

function girarPieza(pieza) {
    const nuevaForma = [];

    // Crear la nueva matriz girada (transponer e invertir columnas)
    for (let col = 0; col < pieza.forma[0].length; col++) {
        const nuevaFila = [];
        for (let fila = pieza.forma.length - 1; fila >= 0; fila--) {
            nuevaFila.push(pieza.forma[fila][col]);
        }
        nuevaForma.push(nuevaFila);
    }

    let piezaAux = pieza.forma; //guardamos la forma original
    pieza.forma = nuevaForma; //le aplicamos la nueva

    if (chequearColisiones(pieza, pieza.posicion.x, pieza.posicion.y)) { //en caso de colision vuelve a la original
        pieza.forma = piezaAux;
    }

}

//Eliminamos la linea si esta llena

function eliminarLinea() {

    for (let fila = 0; fila < filas; fila++) {
        if (tablero[fila].every((casillas) => casillas === 1)) {
            tablero.splice(fila, 1);
            tablero.unshift(Array(columnas).fill(0));
            puntos += 100; //lod puntos van de 100 en 100
        }
    }

}

console.log(tablero);

//recargar la web
function reset() {
    location.reload()
}