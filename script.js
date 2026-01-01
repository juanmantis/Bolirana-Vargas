let nombres = [];
let puntos = [];
let ganadores = [];

let turno = 0;
let bola = 0;
let metio = false;
let girando = false;

document.getElementById("btnAgregar").addEventListener("click", agregar);

function agregar() {
  const input = document.getElementById("nombre");
  const n = input.value.trim();
  if (!n) return;
  nombres.push(n);
  puntos.push(0);
  input.value = "";
  mostrar();
}

function lanzar(valor) {
  if (nombres.length === 0 || girando) return;
  if (ganadores.includes(turno)) { siguienteTurno(); return; }

  bola++;
  if (valor > 0) metio = true;
  puntos[turno] += valor;

  if (bola === 6) {
    if (!metio && !ganadores.includes(turno)) {
      ruleta(turno, siguienteTurno);
    } else {
      siguienteTurno();
    }
  }
  mostrar();
}

function siguienteTurno() {
  bola = 0;
  metio = false;
  do {
    turno = (turno + 1) % nombres.length;
  } while (ganadores.includes(turno) && ganadores.length < nombres.length);
  mostrar();
}

function mostrar() {
  const juego = document.getElementById("juego");
  juego.innerHTML = "";
  nombres.forEach((n,i)=>{
    juego.innerHTML += `
      <div class="jugador ${i===turno?'activo':''} ${ganadores.includes(i)?'ganador':''}">
        <b>${n}</b><br>
        Puntos: ${puntos[i]}<br>
        Bola: ${i===turno?bola:"-"}
      </div>
    `;
  });
  actualizarRanking();
  verificarObjetivo();
}

function actualizarRanking() {
  const ranking = document.getElementById("ranking");
  const orden = nombres.map((n,i)=>({n,p:puntos[i]})).sort((a,b)=>b.p - a.p);
  ranking.innerHTML = orden.map((x,i)=>`${i+1}° ${x.n} — ${x.p}`).join("<br>");
}

function verificarObjetivo() {
  const obj = Number(document.getElementById("objetivo").value);
  if (!obj) return;
  puntos.forEach((p,i)=>{
    if(p>=obj && !ganadores.includes(i)){
      ganadores.push(i);
      alert(`🏆 ${ganadores.length}° lugar: ${nombres[i]}`);
    }
  });
}

// RULETA PRECISA
function ruleta(jugador, callback){
  if(girando) return;
  girando = true;

  const opciones = [-30,-50,-100,-150,-200,-300]
  const numOpciones = opciones.length;
  const overlay = document.getElementById("overlay");
  const canvas = document.getElementById("canvas-ruleta");
  const ctx = canvas.getContext("2d");
  const resultado = document.getElementById("resultado");

  overlay.style.display = "flex";
  resultado.innerText = "Girando...";

  const arc = 2*Math.PI/numOpciones;
  const finalIndex = Math.floor(Math.random()*numOpciones);
  const vueltas = 5 + Math.floor(Math.random()*5);

  // Ángulo corregido: puntero arriba y rotación horaria
  const angleFinal = 2*Math.PI*vueltas - (finalIndex * arc + arc/2);

  let rotation = 0;
  const totalFrames = 150;
  let frame = 0;

  function drawRuleta(rot){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(150,150);
    ctx.rotate(rot);
    for(let i=0;i<numOpciones;i++){
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.arc(0,0,150,i*arc,(i+1)*arc);
      ctx.fillStyle = i%2===0?"#ff4081":"#ff80ab";
      ctx.fill();
      ctx.strokeStyle="#000";
      ctx.stroke();
      ctx.fillStyle="#000";
      ctx.font="16px Arial";
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      const angle = i*arc + arc/2;
      const x = Math.cos(angle)*100;
      const y = Math.sin(angle)*100;
      ctx.fillText(opciones[i],x,y);
    }
    ctx.restore();
  }

  function animate(){
    frame++;
    const t = frame/totalFrames;
    const ease = 1 - Math.pow(1-t,3);
    rotation = angleFinal * ease;
    drawRuleta(rotation);
    if(frame<totalFrames){
      requestAnimationFrame(animate);
    } else {
      const r = opciones[finalIndex];
      resultado.innerText = "Resultado: "+r;
      puntos[jugador]+=r;
      if(puntos[jugador]<0) puntos[jugador]=0;
      mostrar();
      setTimeout(()=>{
        overlay.style.display="none";
        girando = false;
        if(callback) callback();
      },500);
    }
  }

  animate();
}

