'use strict';

/* ---------- Datos ---------- */
const DESTINOS = [
  { id: 'condor',  nombre: 'Cerro del Cóndor',    dif: 'Alta',  tipo: 'Trekking',  dur: '2 días',  precio: 58000, c: ['#7aa6c9', '#3d6b8c', '#2d5a27'] },
  { id: 'laguna',  nombre: 'Laguna Esmeralda',    dif: 'Media', tipo: 'Trekking',  dur: '1 día',   precio: 32000, c: ['#bfe3f2', '#4f9a8a', '#2d5a27'] },
  { id: 'canon',   nombre: 'Cañón de los Colores',dif: 'Baja',  tipo: 'Caminata',  dur: 'Medio día', precio: 18000, c: ['#f2c9a8', '#c86d51', '#8a3f2b'] },
  { id: 'valle',   nombre: 'Valle de las Nubes',  dif: 'Media', tipo: 'Cabalgata', dur: '1 día',   precio: 36000, c: ['#e0f2fe', '#8fb9a0', '#2d5a27'] },
  { id: 'glaciar', nombre: 'Glaciar Perito',      dif: 'Alta',  tipo: 'Trekking',  dur: '3 días',  precio: 79000, c: ['#cfe8f7', '#7aa6c9', '#35506b'] },
  { id: 'termas',  nombre: 'Termas del Río',      dif: 'Baja',  tipo: 'Termas',    dur: '1 día',   precio: 22000, c: ['#fbe3d3', '#c86d51', '#2d5a27'] }
];
const EXTRAS = { almuerzo: 6000, equipo: 9000 };
const SALIDAS = [
  { dias: 4, id: 'canon' }, { dias: 9, id: 'laguna' }, { dias: 14, id: 'termas' },
  { dias: 19, id: 'valle' }, { dias: 26, id: 'condor' }, { dias: 33, id: 'glaciar' }
];
const MONEDA = n => '$' + Math.round(n).toLocaleString('es-AR');
const $ = id => document.getElementById(id);
const porId = id => DESTINOS.find(d => d.id === id);

/* Paisaje SVG panorámico liviano (se puede reemplazar por fotos reales .webp) */
let uid = 0;
const PICOS = [
  [[0,270],[110,190],[230,255],[380,95],[520,235],[650,135],[800,255]],
  [[0,245],[150,120],[265,235],[420,175],[565,85],[700,225],[800,185]],
  [[0,285],[130,205],[300,130],[455,245],[600,115],[800,265]]
];
function paisaje([cielo, monte, pino], v = 0) {
  const id = 'g' + (++uid), pts = PICOS[v % PICOS.length];
  const poly = (arr, dx, dy) => 'M0 400 ' + arr.map(([x, y]) => `L${x + dx} ${y + dy}`).join(' ') + ' L800 400Z';
  const nieve = pts.filter(([, y]) => y < 150).map(([x, y]) =>
    `<path d="M${x} ${y} L${x - 36} ${y + 50} L${x - 14} ${y + 40} L${x + 2} ${y + 58} L${x + 16} ${y + 42} L${x + 36} ${y + 50}Z" fill="#fff" opacity=".92"/>`).join('');
  let s = v * 7 + 3, pinos = '';
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 26; i++) {
    const x = rnd() * 800, y = 330 + rnd() * 50, h = 28 + rnd() * 34, w = h * 0.55;
    pinos += `<path d="M${x} ${y - h} L${x - w} ${y} L${x + w} ${y}Z" fill="#1f3f1b"/><path d="M${x} ${y - h * 0.75} L${x - w * 1.1} ${y - h * 0.15} L${x + w * 1.1} ${y - h * 0.15}Z" fill="#265021"/>`;
  }
  return `<svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cielo}"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient>
    <radialGradient id="${id}s"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <rect width="800" height="400" fill="url(#${id})"/>
    <circle cx="640" cy="95" r="90" fill="url(#${id}s)" opacity=".8"/><circle cx="640" cy="95" r="34" fill="#fff8e1"/>
    <g fill="#fff" opacity=".85"><ellipse cx="160" cy="80" rx="60" ry="14"/><ellipse cx="205" cy="70" rx="40" ry="12"/><ellipse cx="470" cy="55" rx="55" ry="12"/><ellipse cx="520" cy="46" rx="34" ry="10"/></g>
    <path d="${poly(pts, 90, 45)}" fill="${monte}" opacity=".45"/>
    <path d="${poly(pts, 0, 0)}" fill="${monte}"/>${nieve}
    <path d="M0 330 Q200 285 400 325 T800 305 L800 400 L0 400Z" fill="${pino}"/>${pinos}
    <path d="M0 385 Q250 350 500 380 T800 365 L800 400 L0 400Z" fill="#183615"/></svg>`;
}

/* ---------- 1. Slider ---------- */
const SLIDES = [
  { c: ['#9fd0f0', '#3d6b8c', '#2d5a27'], t: 'Cordillera al amanecer' },
  { c: ['#f6d5bd', '#c86d51', '#2d5a27'], t: 'Cañón de los Colores' },
  { c: ['#e0f2fe', '#4f9a8a', '#2d5a27'], t: 'Laguna Esmeralda' }
];
const slider = {
  i: 0, timer: null, delay: 5000,
  init() {
    $('slides').innerHTML = SLIDES.map((s, k) =>
      `<div class="slide" aria-hidden="true">${paisaje(s.c, k)}<span class="cap">${s.t}</span></div>`).join('');
    $('dots').innerHTML = SLIDES.map((_, k) =>
      `<button aria-label="Ir a la foto ${k + 1}" data-i="${k}"></button>`).join('');
    this.slides = document.querySelectorAll('.slide');
    this.dots = document.querySelectorAll('#dots button');
    $('next').addEventListener('click', () => { this.go(this.i + 1); this.play(); });
    $('prev').addEventListener('click', () => { this.go(this.i - 1); this.play(); });
    $('dots').addEventListener('click', e => {
      if (e.target.dataset.i) { this.go(+e.target.dataset.i); this.play(); }
    });
    const box = $('slider');
    box.addEventListener('mouseenter', () => this.stop());
    box.addEventListener('mouseleave', () => this.play());
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { this.go(this.i + 1); this.play(); }
      if (e.key === 'ArrowLeft') { this.go(this.i - 1); this.play(); }
    });
    this.go(0); this.play();
  },
  go(n) {
    this.i = (n + SLIDES.length) % SLIDES.length; // módulo: vuelve al inicio o al final
    this.slides.forEach((s, k) => {
      s.classList.toggle('active', k === this.i);
      s.setAttribute('aria-hidden', k !== this.i);
    });
    this.dots.forEach((d, k) => d.classList.toggle('active', k === this.i));
  },
  play() { this.stop(); this.timer = setInterval(() => this.go(this.i + 1), this.delay); },
  stop() { clearInterval(this.timer); }
};

/* ---------- 2. Destinos + filtro ---------- */
const filtro = { dif: 'todas', tipo: 'todas' };
function renderDestinos() {
  const lista = DESTINOS.filter(d =>
    (filtro.dif === 'todas' || d.dif === filtro.dif) &&
    (filtro.tipo === 'todas' || d.tipo === filtro.tipo));
  $('count').textContent = lista.length
    ? `${lista.length} excursión(es) disponibles`
    : 'No hay excursiones con esos filtros. Probá con otra combinación.';
  $('cards').innerHTML = lista.map((d, k) => `
    <article class="card">${paisaje(d.c, k)}
      <div class="card-body">
        <h3>${d.nombre}</h3>
        <div class="tags"><span class="tag ${d.dif}">${d.dif}</span><span class="tag">${d.tipo}</span><span class="tag">${d.dur}</span></div>
        <p class="price">Desde ${MONEDA(d.precio)} por persona</p>
        <button class="btn" data-pick="${d.id}">Calcular y reservar</button>
      </div></article>`).join('');
}
$('filters').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === b));
  filtro.dif = b.dataset.dif; filtro.tipo = 'todas'; renderDestinos();
});
$('cards').addEventListener('click', e => {
  const b = e.target.closest('[data-pick]'); if (!b) return;
  $('cDestino').value = b.dataset.pick; $('fDestino').value = b.dataset.pick;
  calcular(); $('simulador').scrollIntoView();
});
$('quick').addEventListener('submit', e => {
  e.preventDefault();
  filtro.dif = $('qDif').value; filtro.tipo = $('qTipo').value;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.dif === filtro.dif));
  renderDestinos(); $('destinos').scrollIntoView();
});

/* ---------- 3. Calculadora ---------- */
function descuento(pax) { return pax >= 11 ? 0.15 : pax >= 7 ? 0.10 : pax >= 4 ? 0.05 : 0; }
function calcular() {
  const d = porId($('cDestino').value);
  const pax = Math.min(30, Math.max(1, parseInt($('cPax').value, 10) || 1));
  const extra = ($('cAlmuerzo').checked ? EXTRAS.almuerzo : 0) + ($('cEquipo').checked ? EXTRAS.equipo : 0);
  const bruto = (d.precio + extra) * pax;
  const pct = descuento(pax), desc = bruto * pct;
  $('breakdown').innerHTML =
    `<div><dt>${d.nombre} × ${pax}</dt><dd>${MONEDA(d.precio * pax)}</dd></div>` +
    `<div><dt>Adicionales × ${pax}</dt><dd>${MONEDA(extra * pax)}</dd></div>` +
    `<div class="discount"><dt>Descuento grupal (${pct * 100}%)</dt><dd>-${MONEDA(desc)}</dd></div>`;
  $('total').textContent = MONEDA(bruto - desc);
  $('fPax').value = pax;
}
['cDestino', 'cPax', 'cAlmuerzo', 'cEquipo'].forEach(id => {
  $(id).addEventListener('input', calcular);
  $(id).addEventListener('change', calcular);
});
$('toReserva').addEventListener('click', () => { $('fDestino').value = $('cDestino').value; });

/* ---------- 4. Calendario de salidas (fechas relativas a hoy) ---------- */
function fechaISO(d) {
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; // hora local, no UTC
}
function renderSalidas() {
  const hoy = new Date();
  $('dates').innerHTML = SALIDAS.map(s => {
    const f = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + s.dias);
    const d = porId(s.id);
    return `<div class="date"><time datetime="${fechaISO(f)}"><b>${f.getDate()}</b>${f.toLocaleDateString('es-AR', { month: 'short' })}</time>
      <div><h3>${d.nombre}</h3><small>${d.dif} · ${d.dur}</small>
      <button data-fecha="${fechaISO(f)}" data-dest="${d.id}">Reservar esta salida</button></div></div>`;
  }).join('');
}
$('dates').addEventListener('click', e => {
  const b = e.target.closest('[data-fecha]'); if (!b) return;
  $('fDestino').value = b.dataset.dest; $('fFecha').value = b.dataset.fecha;
  $('reserva').scrollIntoView();
});

/* ---------- 5. Formulario con fecha mínima dinámica ---------- */
const fecha = $('fFecha');
fecha.min = fechaISO(new Date()); // hoy: bloquea días pasados en el calendario nativo
$('booking').addEventListener('submit', e => {
  e.preventDefault();
  const err = $('formError'); err.textContent = ''; $('formOk').textContent = '';
  document.querySelectorAll('.booking input').forEach(i => i.classList.remove('invalid'));
  let msg = '';
  if ($('fNombre').value.trim().length < 3) { msg = 'Ingresá tu nombre completo.'; $('fNombre').classList.add('invalid'); }
  else if (!$('fEmail').validity.valid || !$('fEmail').value) { msg = 'Ingresá un email válido.'; $('fEmail').classList.add('invalid'); }
  else if (!fecha.value) { msg = 'Elegí una fecha de salida.'; fecha.classList.add('invalid'); }
  else if (fecha.value < fecha.min) { msg = 'La fecha no puede ser anterior a hoy.'; fecha.classList.add('invalid'); } // revalida por si se escribió a mano
  if (msg) { err.textContent = msg; return; }
  const d = porId($('fDestino').value);
  $('formOk').textContent = `¡Listo, ${$('fNombre').value.trim().split(' ')[0]}! Reserva tentativa de ${$('fPax').value} pasajero(s) a ${d.nombre} el ${fecha.value}. Te escribimos a ${$('fEmail').value} para confirmar.`;
  e.target.reset(); fecha.min = fechaISO(new Date());
});

/* ---------- Inicio ---------- */
const opciones = DESTINOS.map(d => `<option value="${d.id}">${d.nombre}</option>`).join('');
$('cDestino').innerHTML = opciones; $('fDestino').innerHTML = opciones;
$('year').textContent = new Date().getFullYear();
slider.init(); renderDestinos(); renderSalidas(); calcular();
