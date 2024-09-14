/* -------------------------------------------------------------------------- */
/*                                ELEMENTOS DOM                               */
/* -------------------------------------------------------------------------- */
const headerElem = document.querySelector("#header") as HTMLDivElement;
const resultsElem = document.querySelector(".results") as HTMLDivElement;
const inputElem = document.querySelector("#input") as HTMLInputElement;
const nuevoBtn = document.querySelector("#nuevo") as HTMLButtonElement;

if (!headerElem || !resultsElem || !inputElem || !nuevoBtn) {
  throw new Error("Elemento no encontrado");
}

/* -------------------------------------------------------------------------- */
/*                             VARIABLES GLOBALES                             */
/* -------------------------------------------------------------------------- */

let numSecretoArr: number[] = [];
let numSecretoStr: string = "";
let numSecretoLength: number = 0; // Longitud del número secreto

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

function main() {
  headerElem.innerText = "Ingresa tu número secreto";

  inputElem.addEventListener("keydown", handleInput);
  nuevoBtn.addEventListener("click", resetGame);
  initializeInput();
}

/** Gestiona el input de `inputElem` al presionar Enter. */
function handleInput(event: KeyboardEvent) {
  if (event.key === "Enter") {
    const inputValue = inputElem.value.trim();

    if (isNaN(Number(inputValue))) {
      // inputElem.placeholder = "Valor incorrecto";
      inputElem.value = "";
      return;
    }

    // Si numSecretoArr aún no está definido, define el número secreto
    if (numSecretoArr.length === 0) {
      if (inputValue.length === 0) return;
      numSecretoArr = [...inputValue].map(Number);
      numSecretoStr = numSecretoArr.join("");
      numSecretoLength = numSecretoArr.length; // Establece la longitud del número secreto
      headerElem.innerText = `Tu número secreto: ${numSecretoStr}`;
      inputElem.value = ""; // Limpia el input después de establecer el número secreto
      return;
    }

    // Valida que la entrada tenga la longitud correcta según el primer número ingresado
    if (inputValue.length !== numSecretoLength) {
      inputElem.value = "";
      return;
    }

    // inputElem.placeholder = "...";
    // Maneja la entrada del usuario después de haber definido numSecretoArr
    let inputAsArray = [...inputValue].map(Number);
    console.log(`---- Input: ${inputValue} ---`);

    addResult(calculate(numSecretoArr, inputAsArray));
    inputElem.value = "";
  }
}

/* -------------------------------------------------------------------------- */
/*                                   CÁLCULO                                  */
/* -------------------------------------------------------------------------- */

/** Función de cálculo principal. */
function calculate(arrSecreto: number[], arrPreguntado: number[]): string {
  let results = "";

  if (arrSecreto.toString() == arrPreguntado.toString()) {
    return "Bien";
  }

  for (let i = 0; i < arrSecreto.length; i++) {
    let occurrencesCount = countOccurrences(numSecretoStr, arrPreguntado[i].toString());
    let cifraArriba = arrSecreto[i];
    let cifraAbajo = arrPreguntado[i];

    let esBien = cifraArriba === cifraAbajo;
    let esRegular = arrSecreto.includes(cifraAbajo);
    let esPerfecto = cifraArriba + cifraAbajo === 9;
    let seRepite = occurrencesCount > 1;

    let listaVecinos: number[] = [];

    if (i === 0) {
      listaVecinos.push(arrPreguntado[i + 1]);
    } else if (i === arrSecreto.length - 1) {
      listaVecinos.push(arrPreguntado[i - 1]);
    } else {
      listaVecinos.push(arrPreguntado[i - 1]);
      listaVecinos.push(arrPreguntado[i + 1]);
    }
    console.log(`vecinos de ${arrPreguntado[i]}(i${i}): ${listaVecinos}`);

    let esVecino = listaVecinos.includes(Math.abs(cifraArriba - cifraAbajo));

    if (esBien) {
      results += seRepite ? "D" : "B";
      continue;
    }

    if (esRegular) {
      results += seRepite ? "F" : "R";
      continue;
    }

    if (esPerfecto) {
      results += "P";
      continue;
    }

    if (esVecino) {
      results += "V";
      continue;
    }
  }

  return results || "Mal";
}

/** Añade un nuevo resultado al elemento `resultsElem`. */
function addResult(calculation_result: string) {
  let answer = document.createElement("p");
  answer.innerHTML = `<p class="result">${inputElem.value}: ${calculation_result}</p>`;
  resultsElem.appendChild(answer);
  resultsElem.scrollBy(0, resultsElem.scrollHeight);
}

/** Limpia y enfoca `inputElem`. */
function initializeInput() {
  inputElem.value = "";
  inputElem.focus();
}

/** Cuenta cantidad de ocurrencias de un carácter en una cadena. */
function countOccurrences(str: string, characterToCount: string) {
  return str.split(characterToCount).length - 1;
}

/** Reinicia el juego, elimina resultados y pide al usuario ingresar un nuevo número secreto. */
function resetGame() {
  numSecretoArr = [];
  numSecretoStr = "";
  numSecretoLength = 0;
  headerElem.innerText = "Ingresa tu número secreto";

  // Limpia todos los resultados anteriores
  resultsElem.innerHTML = "";

  inputElem.value = "";
  inputElem.focus();

  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  nuevoBtn.style.backgroundColor = computedStyle.getPropertyValue("--main-color").trim();
  nuevoBtn.style.color = computedStyle.getPropertyValue("--text-color").trim();
}

function doTests() {
  let arr1 = Array.from("9689").map(Number);
  let arr2 = Array.from("4444").map(Number);
  console.assert(calculate(arr1, arr2) === "V");
}

main();
