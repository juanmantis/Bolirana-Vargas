let nombres = [];
let puntos = [];
let ganadores = [];

let turno = 0;
let bola = 0;
let metio = false;

// AGREGAR JUGADOR
document.getElementById("btnAgregar").addEventListener("click", () => {
  const n = nombre.value.trim();
  if (!n) return;
  nombres.push(n);
  puntos.push(0);
  nombre.value = "";
  mostrar();
});

function lanzar(valor) {
  if (ganadores.includes(turno)) {
    siguienteTurno();
    return;
  }

  bola++;
  if (valor > 0) metio = true;

  puntos[turno] += valor;

  if (bola === 6) siguienteTurno();
  mostrar();
}

function siguienteTurno() {
  if (!metio && !ganadores.includes(turno)) ruleta();

  bola = 0;
  metio = false;
  turno = (turno + 1) % nombres.length;
}

function mostrar() {
  juego.innerHTML = "";
  nombres.forEach((n, i) => {
    juego.innerHTML += `
      <div class="jugador ${i === turno ? 'activo' : ''}">
        <b>${n}</b><br>
        ${puntos[i]} pts<br>
        Bola: ${i === turno ? bola : "-"}
      </div>`;
  });

  ranking.innerHTML = nombres
    .map((n,i)=>({n,p:puntos[i]}))
    .sort((a,b)=>b.p-a.p)
    .map((x,i)=>`${i+1}° ${x.n} — ${x.p}`)
    .join("<br>");
}

// RULETA REAL
function ruleta() {
  const opciones = [-100, -150, -200, -300];
  const resultadoFinal = opciones[Math.floor(Math.random()*opciones.length)];

  overlay.style.display = "flex";
  resultado.innerText = "Girando...";

  setTimeout(() => {
    resultado.innerText = "Resultado: " + resultadoFinal;
    puntos[turno] += resultadoFinal;
    if (puntos[turno] < 0) puntos[turno] = 0;
    mostrar();

    setTimeout(() => {
      overlay.style.display = "none";
    }, 2000);
  }, 3000);
}
