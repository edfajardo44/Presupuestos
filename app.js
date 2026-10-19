const STORAGE_KEY = 'presupuestos-pintura';
const EMPRESA_KEY = 'presupuestos-pintura-empresa';
const TRABAJADORES_KEY = 'presupuestos-pintura-trabajadores';
const FACTURA_CONTADOR_KEY = 'presupuestos-pintura-factura-contador';
const ANIO_PRIMER_NUMERO_FACTURA = 2026;
const PRIMER_NUMERO_FACTURA = 10;

const el = (id) => document.getElementById(id);

const IGIC_RATE = 0.07;

function capitulo(desc) { return { desc, esCapitulo: true, esSeccion: false }; }
function tarea(desc) { return { desc, esCapitulo: false, esSeccion: false }; }
function seccion(desc) { return { desc, esCapitulo: false, esSeccion: true }; }
function capitalizar(texto) { return texto.charAt(0).toUpperCase() + texto.slice(1); }

function autoResizeTextarea(ta) {
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 'px';
}

function etapasInterior() {
  return [
    capitulo('Raspado y limpieza'),
    tarea('Limpieza y raspado de las superficies, retirando restos de pintura suelta, polvo y suciedad para garantizar una correcta adherencia de los materiales'),
    tarea('Reparación de grietas mediante pasta de interior, rellenando y nivelando la zona dañada para dejarla lista para el acabado final'),
    tarea('Reparación de desperfectos mayores mediante mortero impermeabilizante, aportando mayor resistencia y evitando futuras filtraciones de humedad'),
    capitulo('Lijado'),
    tarea('Lijado de empastes y superficies —ya sean lisas, rugosas o con gotelé— para conseguir un acabado uniforme, eliminar irregularidades y favorecer la correcta adherencia de la pintura'),
    capitulo('Pintura'),
    tarea('Aplicación de dos manos de pintura interior de la casa JUNO: pintura acrílica lavable, de gran cobertura y acabado uniforme, adecuada tanto para paredes lisas como rugosas o con gotelé, aportando durabilidad y fácil mantenimiento'),
  ];
}

function etapasHierros() {
  return [
    capitulo('Preparación de superficies'),
    tarea('Raspado y cepillado, eliminando el óxido suelto y la pintura mal adherida hasta alcanzar el grado de limpieza St-2 (norma UNE-EN ISO 8501-1), dejando la superficie lista'),
    capitulo('Pintura antioxidante'),
    tarea('Aplicación de dos manos de esmalte Junolac Antioxidante de la casa JUNO, certificado según la norma UNE 48316:2014 para esmaltes anticorrosivos de altas prestaciones, disponible en acabado brillante —mayor brillo y viveza de color— o satinado —aspecto más elegante y con menor reflejo—. Se aplica directamente sobre el hierro sin necesidad de imprimación, con secado rápido, gran dureza y adherencia, y una probada resistencia a la intemperie y la corrosión'),
  ];
}

function etapasExterior() {
  return [
    capitulo('Raspado y limpieza'),
    tarea('Limpieza y raspado de las superficies'),
    tarea('Apertura y profundización de grietas'),
    capitulo('Reparación de grietas y desperfectos'),
    tarea('Relleno de grietas y arreglo de desperfectos mediante pasta de exteriores de la casa JUNO'),
    tarea('Reparación de desperfectos mayores mediante mortero impermeabilizante'),
    capitulo('Sellador'),
    tarea('Aplicación de emulsión selladora de la casa JUNO: imprimación consolidante a base de agua que penetra en el soporte, sellando los poros y endureciéndolo. Mejora la adherencia del nuevo revestimiento y aumenta su durabilidad e impermeabilidad'),
    capitulo('Pintura'),
    tarea('Aplicación de dos manos de pintura de la casa JUNO: pintura al agua acrílico-vinílica, de gran flexibilidad y adherencia. Impermeable al agua de lluvia y permeable al vapor de agua, evitando la formación de moho. Gran resistencia y durabilidad frente a la intemperie'),
  ];
}

const ETAPAS_TEMPLATES = {
  impermeabilizacion: [
    capitulo('Diagnóstico y preparación'),
    tarea('Inspección y localización de filtraciones antes de iniciar los trabajos'),
    tarea('Limpieza y raspado de las superficies para garantizar una correcta adherencia'),
    tarea('Apertura y profundización de grietas, dejándolas listas para su reparación'),
    capitulo('Reparación de grietas y desperfectos'),
    tarea('Relleno de grietas y desperfectos mediante pasta de exteriores de la casa JUNO'),
    tarea('Reparación de desperfectos mayores con mortero impermeabilizante, evitando futuras filtraciones'),
    capitulo('Imprimación'),
    tarea('Aplicación de imprimación de la casa JUNO sobre las zonas reparadas, mejorando la adherencia de la fibra de vidrio'),
    capitulo('Colocación de fibra de vidrio'),
    tarea('Colocación de fibra de vidrio Mat 100 con pegamento especial: refuerza la superficie, evita nuevas grietas y garantiza una barrera impermeable duradera'),
    capitulo('Sellado y pintura'),
    tarea('Aplicación de 4 a 5 manos de pintura elástica impermeabilizante Junoteras de la casa JUNO: sella por completo la superficie, resiste la intemperie sin agrietarse y protege la vivienda de la absorción del calor'),
  ],
  suelo_azotea: [
    capitulo('Diagnóstico y preparación'),
    tarea('Inspección y localización de filtraciones antes de iniciar los trabajos'),
    tarea('Limpieza y raspado de las superficies para garantizar una correcta adherencia'),
    tarea('Apertura y profundización de grietas, dejándolas listas para su reparación'),
    capitulo('Reparación de grietas y desperfectos'),
    tarea('Relleno de grietas y desperfectos mediante pasta de exteriores de la casa JUNO'),
    tarea('Reparación de desperfectos mayores con mortero impermeabilizante, evitando futuras filtraciones'),
    capitulo('Imprimación'),
    tarea('Aplicación de imprimación de la casa JUNO sobre las zonas reparadas, mejorando la adherencia de la pintura'),
    capitulo('Pintura'),
    tarea('Aplicación de dos manos de pintura elástica impermeabilizante Junoteras de la casa JUNO: sella por completo la superficie, resiste la intemperie sin agrietarse y protege la vivienda de la absorción del calor'),
  ],
};

const TITULOS_TIPO_TRABAJO = {
  impermeabilizacion: 'Impermeabilización de azotea',
  suelo_azotea: 'Pintura de suelo de azotea',
};

const CONDICIONES_DEFAULT = '50% al inicio y 50% a la finalización de obra.\nIncluye IGIC.\nGarantía de 3 años.';
const CONDICIONES_FACTURA_DEFAULT = 'Garantía de 3 años.';

const PRINT_OFFSET_DEFAULT = 0;

let etapaRows = [];
let empleadoRows = [];
let equipoRows = [];
let extraRows = [];
let trabajadoresHabituales = [];
let esFactura = false;
let esRecibo = false;
let facturaNumero = null;
let facturaFecha = new Date().toISOString();
let currentId = null;
let cargandoDatos = false;
let autoguardadoTimeout = null;
let estadoGuardadoTimeout = null;

// Deshacer en las etapas: antes de cada cambio (cargar etapas, añadir o borrar filas) se guarda una foto.
const MAX_PASOS_ETAPAS = 30;
let pasosEtapas = [];

function guardarPasoEtapas() {
  pasosEtapas.push({ filas: JSON.stringify(etapaRows), titulo: el('tituloTipoTrabajo').value });
  if (pasosEtapas.length > MAX_PASOS_ETAPAS) pasosEtapas.shift();
}

function deshacerEtapas() {
  const paso = pasosEtapas.pop();
  if (!paso) return;
  etapaRows = JSON.parse(paso.filas);
  el('tituloTipoTrabajo').value = paso.titulo;
  el('tituloTipoTrabajo').classList.toggle('hidden', !paso.titulo);
  renderEtapas();
}

function marcarCambio() {
  if (cargandoDatos) return;
  clearTimeout(autoguardadoTimeout);
  autoguardadoTimeout = setTimeout(guardarEnHistorial, 600);
}

function mostrarEstadoGuardado() {
  const indicador = el('estadoGuardado');
  indicador.classList.remove('hidden');
  clearTimeout(estadoGuardadoTimeout);
  estadoGuardadoTimeout = setTimeout(() => indicador.classList.add('hidden'), 2000);
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

function money(n) {
  return currencyFormatter.format(Number(n) || 0);
}

function num(id) {
  const input = el(id);
  const raw = parseFloat(input.value) || 0;
  const clamped = Math.max(0, raw);
  if (raw !== clamped) input.value = clamped;
  return clamped;
}

function costoNoNegativo(input) {
  const raw = parseFloat(input.value) || 0;
  const clamped = Math.max(0, raw);
  if (raw !== clamped) input.value = clamped;
  return clamped;
}

function renderDynamicRow(container, row, onRemove, { descPlaceholder = '', costLabel = 'Coste (€)' } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'dynamic-row';
  wrap.innerHTML = `
    <div class="field">
      <label>Descripción</label>
      <input type="text" value="${row.desc.replace(/"/g, '&quot;')}" data-role="desc" placeholder="${descPlaceholder}">
    </div>
    <div class="field" style="max-width:110px">
      <label>${costLabel}</label>
      <input type="number" min="0" step="0.01" value="${row.cost}" data-role="cost">
    </div>
    <button type="button" class="btn-danger-icon" title="Eliminar">✕</button>
  `;
  const [descInput, costInput] = wrap.querySelectorAll('input');
  descInput.addEventListener('input', () => { row.desc = descInput.value; });
  costInput.addEventListener('input', () => { row.cost = costoNoNegativo(costInput); calcular(); });
  wrap.querySelector('button').addEventListener('click', () => onRemove(row));
  container.appendChild(wrap);
}

function renderEtapas() {
  const container = el('etapas');
  container.innerHTML = '';
  let capituloNum = 0;
  let tareaNum = 0;
  etapaRows.forEach((row) => {
    const wrap = document.createElement('div');
    if (row.esSeccion) {
      capituloNum = 0;
      tareaNum = 0;
      wrap.className = 'dynamic-row etapa-row etapa-seccion-row';
      wrap.innerHTML = `
        <div class="field">
          <textarea rows="1" data-role="desc" placeholder="Nombre de la sección (ej: Fachada)"></textarea>
          <div class="etapa-desc-print"></div>
        </div>
        <button type="button" class="btn-danger-icon" title="Eliminar">✕</button>
      `;
    } else if (row.esCapitulo) {
      capituloNum += 1;
      tareaNum = 0;
      wrap.className = 'dynamic-row etapa-row etapa-capitulo-row';
      wrap.innerHTML = `
        <span class="capitulo-numero-texto">${capituloNum}.</span>
        <div class="field">
          <textarea rows="1" data-role="desc" placeholder="Título del capítulo (ej: Preparación de la superficie)"></textarea>
          <div class="etapa-desc-print"></div>
        </div>
        <button type="button" class="btn-danger-icon" title="Eliminar">✕</button>
      `;
    } else {
      tareaNum += 1;
      const numero = capituloNum > 0 ? `${capituloNum}.${String(tareaNum).padStart(2, '0')}` : `${tareaNum}`;
      wrap.className = 'dynamic-row etapa-row';
      wrap.innerHTML = `
        <span class="etapa-numero">${numero}</span>
        <div class="field">
          <textarea rows="1" data-role="desc" placeholder="Ej: Imprimación de la fachada"></textarea>
          <div class="etapa-desc-print"></div>
        </div>
        <button type="button" class="btn-danger-icon" title="Eliminar">✕</button>
      `;
    }
    const descInput = wrap.querySelector('textarea');
    const descPrint = wrap.querySelector('.etapa-desc-print');
    descInput.value = row.desc;
    descPrint.textContent = row.desc;
    descInput.addEventListener('input', () => {
      row.desc = descInput.value;
      descPrint.textContent = descInput.value;
      autoResizeTextarea(descInput);
      if (row.esCapitulo || row.esSeccion) actualizarFacturaContenido();
    });
    wrap.querySelector('button').addEventListener('click', () => {
      guardarPasoEtapas();
      etapaRows = etapaRows.filter((x) => x !== row);
      renderEtapas();
    });
    container.appendChild(wrap);
    autoResizeTextarea(descInput);
  });
  actualizarFacturaContenido();
  el('btnDeshacerEtapas').disabled = pasosEtapas.length === 0;
  marcarCambio();
}

function cargarEmpresa() {
  let empresa = {};
  try {
    empresa = JSON.parse(localStorage.getItem(EMPRESA_KEY)) || {};
  } catch {
    empresa = {};
  }
  el('empresaNombre').value = empresa.nombre ?? 'Trabajos Verticales';
  el('empresaActividad').value = empresa.actividad ?? 'Pinturas en general e impermeabilizaciones';
  el('empresaTelefono').value = empresa.telefono ?? '655-016-215';
  el('empresaNifNombre').value = empresa.nifNombre ?? '';
  el('empresaNif').value = empresa.nif ?? '';
  el('empresaDireccion').value = empresa.direccion ?? '';
}

function guardarEmpresa() {
  localStorage.setItem(EMPRESA_KEY, JSON.stringify({
    nombre: el('empresaNombre').value,
    actividad: el('empresaActividad').value,
    telefono: el('empresaTelefono').value,
    nifNombre: el('empresaNifNombre').value,
    nif: el('empresaNif').value,
    direccion: el('empresaDireccion').value,
  }));
  actualizarModoFactura();
}

function toggleEquipoUI() {
  const activo = el('incluirEquipo').checked;
  el('equipoAltura').classList.toggle('hidden', !activo);
  el('btnAddEquipo').classList.toggle('hidden', !activo);
}

function toggleFibraUI() {
  const activo = el('incluirFibra').checked;
  el('camposFibra').classList.toggle('hidden', !activo);
}

function togglePrecioManualUI() {
  const activo = el('precioManual').checked;
  el('campoSubtotalManual').classList.toggle('hidden', !activo);
}

function valorPorDefectoContadorFactura(anio) {
  return anio === ANIO_PRIMER_NUMERO_FACTURA ? (PRIMER_NUMERO_FACTURA - 1) : 0;
}

function obtenerSiguienteNumeroFactura(anio) {
  const actual = parseInt(localStorage.getItem(`${FACTURA_CONTADOR_KEY}-${anio}`), 10) || valorPorDefectoContadorFactura(anio);
  return actual + 1;
}

function registrarNumeroFacturaUsado(numero, anio) {
  const actual = parseInt(localStorage.getItem(`${FACTURA_CONTADOR_KEY}-${anio}`), 10) || valorPorDefectoContadorFactura(anio);
  if (numero > actual) localStorage.setItem(`${FACTURA_CONTADOR_KEY}-${anio}`, numero);
}

function actualizarModoFactura() {
  document.body.classList.toggle('factura-activa', esFactura);
  document.body.classList.toggle('recibo-activo', esRecibo);
  el('campoClienteNif').classList.toggle('hidden', !esFactura && !esRecibo);
  el('campoClienteDireccion').classList.toggle('hidden', !esFactura);
  el('badgeModoFactura').classList.toggle('hidden', !esFactura);
  const numeroCompleto = facturaNumero && facturaFecha ? `${facturaNumero}/${new Date(facturaFecha).getFullYear()}` : (facturaNumero ?? '');
  el('badgeModoFacturaNumero').textContent = numeroCompleto;
  el('documentoTituloTexto').textContent = esFactura ? `Factura Nº ${numeroCompleto}` : (esRecibo ? 'Recibí' : 'Presupuesto');
  el('facturaFechaTexto').textContent = facturaFecha ? new Date(facturaFecha).toLocaleDateString('es-ES') : '';
  el('fechaDocumento').value = facturaFecha ? new Date(facturaFecha).toISOString().slice(0, 10) : '';
  el('facturaEmisorNombre').textContent = el('empresaNifNombre').value;
  el('facturaEmisorNif').textContent = el('empresaNif').value;
  el('facturaEmisorDireccion').textContent = el('empresaDireccion').value;
  el('facturaClienteNombreTexto').textContent = el('clienteNombre').value;
  el('facturaClienteNifTexto').textContent = el('clienteNif').value;
  el('facturaClienteDireccionTexto').textContent = el('clienteDireccion').value;
  el('facturaSelloNombre').textContent = el('empresaNifNombre').value;
  el('facturaSelloNif').textContent = `NIF: ${el('empresaNif').value}`;
  el('facturaSelloDireccion').textContent = el('empresaDireccion').value;
  actualizarRecibo();
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function fechaEnPalabras(fechaIso) {
  const d = new Date(fechaIso);
  return `${d.getDate()} de ${capitalizar(MESES[d.getMonth()])} de ${d.getFullYear()}`;
}

function numeroALetras(entero) {
  const UNIDADES = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const ESPECIALES = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const DECENAS = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const CENTENAS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  function trescientos(n) {
    if (n === 0) return '';
    if (n === 100) return 'cien';
    let texto = '';
    const c = Math.floor(n / 100);
    const resto = n % 100;
    if (c > 0) texto += CENTENAS[c];
    if (resto > 0) {
      if (texto) texto += ' ';
      if (resto < 10) texto += UNIDADES[resto];
      else if (resto < 20) texto += ESPECIALES[resto - 10];
      else {
        const d = Math.floor(resto / 10);
        const u = resto % 10;
        if (d === 2 && u > 0) texto += 'veinti' + UNIDADES[u];
        else {
          texto += DECENAS[d];
          if (u > 0) texto += ' y ' + UNIDADES[u];
        }
      }
    }
    return texto;
  }

  if (entero === 0) return 'cero';
  const millones = Math.floor(entero / 1000000);
  const miles = Math.floor((entero % 1000000) / 1000);
  const resto = entero % 1000;
  const partes = [];
  if (millones > 0) partes.push(millones === 1 ? 'un millón' : `${trescientos(millones)} millones`);
  if (miles > 0) partes.push(miles === 1 ? 'mil' : `${trescientos(miles)} mil`);
  if (resto > 0) partes.push(trescientos(resto));
  return partes.join(' ');
}

function aplicarApocope(texto) {
  return texto.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un');
}

function importeEnPalabrasCompleto(importe) {
  const entero = Math.floor(importe);
  const centimos = Math.round((importe - entero) * 100);
  let palabras = aplicarApocope(numeroALetras(entero));
  if (centimos > 0) {
    palabras += ` con ${aplicarApocope(numeroALetras(centimos))} céntimos`;
  }
  const numeroFormateado = `${new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' }).format(importe)}€`;
  const esUnEuro = entero === 1 && centimos === 0;
  return `${palabras} (${numeroFormateado}) ${esUnEuro ? 'euro' : 'euros'}`;
}

function actualizarRecibo() {
  if (!esRecibo) return;
  const emisorNombre = el('empresaNifNombre').value.trim();
  const emisorNif = el('empresaNif').value.trim();
  const emisorDireccion = el('empresaDireccion').value.trim();
  const clienteNombre = el('clienteNombre').value.trim();
  const clienteNif = el('clienteNif').value.trim();
  const importe = num('reciboImporte');
  const concepto = el('reciboConcepto').value.trim();
  const porcentaje = el('reciboPorcentaje').value.trim();
  const lugar = el('reciboLugar').value.trim() || 'S/C de Tenerife';
  const fecha = facturaFecha || new Date().toISOString();

  el('reciboCuerpo').innerHTML = `
    <p>Yo, <strong>${emisorNombre}</strong>, con NIF: <strong>${emisorNif}</strong>, residente en ${emisorDireccion}.</p>
    <p>He recibido de <strong>${clienteNombre}</strong>, con NIF: <strong>${clienteNif}</strong>, en concepto de ${concepto}.</p>
    <p class="recibo-etiqueta-importe">La cantidad de:</p>
    <p class="recibo-importe-destacado">${importeEnPalabrasCompleto(importe)}</p>
    ${porcentaje ? `<p>Dicha cantidad es el ${porcentaje}.</p>` : ''}
    <p class="recibo-fecha-lugar">En ${lugar} a ${fechaEnPalabras(fecha)}</p>
  `;

  el('reciboSelloNombre').textContent = emisorNombre;
  el('reciboSelloNif').textContent = `NIF: ${emisorNif}`;
  el('reciboSelloDireccion').textContent = emisorDireccion;
}

function nuevoRecibo() {
  nuevoPresupuesto();
  esRecibo = true;
  actualizarModoFactura();
  marcarCambio();
}

function actualizarFacturaContenido() {
  const contenido = el('facturaContenido');
  contenido.innerHTML = '';
  etapaRows.filter((row) => row.esCapitulo || row.esSeccion).forEach((row) => {
    const p = document.createElement('p');
    p.className = row.esSeccion ? 'factura-linea factura-linea-seccion' : 'factura-linea';
    p.textContent = row.desc;
    contenido.appendChild(p);
  });
}

function nuevaFactura() {
  const anio = new Date().getFullYear();
  const sugerido = obtenerSiguienteNumeroFactura(anio);
  const respuesta = prompt(`Número de factura (año ${anio}):`, sugerido);
  if (respuesta === null) return;
  const numero = parseInt(respuesta, 10);
  if (!numero || numero <= 0) {
    alert('Número de factura no válido.');
    return;
  }
  nuevoPresupuesto();
  esFactura = true;
  facturaNumero = numero;
  facturaFecha = new Date().toISOString();
  el('condiciones').value = CONDICIONES_FACTURA_DEFAULT;
  actualizarVisibilidadCondiciones();
  registrarNumeroFacturaUsado(numero, anio);
  actualizarModoFactura();
  marcarCambio();
}

function actualizarVisibilidadCliente() {
  const vacio = !el('clienteNombre').value.trim();
  el('campoCliente').classList.toggle('cliente-vacio', vacio);
}

function actualizarVisibilidadCondiciones() {
  const vacio = !el('condiciones').value.trim();
  el('cardCondiciones').classList.toggle('cliente-vacio', vacio);
}

function actualizarOffsetImpresion() {
  el('printOffsetX').value = PRINT_OFFSET_DEFAULT;
  el('printOffsetXLabel').textContent = PRINT_OFFSET_DEFAULT;
  document.documentElement.style.setProperty('--print-offset-x', `${PRINT_OFFSET_DEFAULT}mm`);
}

function resetPrintScale() {
  el('printScale').value = 100;
  el('printScaleLabel').textContent = 100;
  document.documentElement.style.setProperty('--print-scale', 1);
  actualizarOffsetImpresion();
  actualizarAjusteUnaPaginaUI();
}

// "Ajustar a una sola página": se mide el documento con las reglas de impresión (print.css puesto
// temporalmente en media="all") y el ancho útil de un A4, y se busca el mayor tamaño que quepa en una hoja.
const PRINT_ANCHO_PX = 733; // A4 (21 cm) menos 2 × 0,8 cm de margen
const PRINT_ALTO_PX = 1009; // A4 (29,7 cm) menos 2 × 1,5 cm de margen
const PRINT_ESCALA_MIN = 0.5;
const PRINT_MARGEN_SEGURIDAD = 0.97;
const TEXTO_AJUSTE_UNA_PAGINA = 'Al imprimir, reduce el tamaño solo lo necesario para que todo quepa en una hoja.';

function calcularEscalaUnaPagina() {
  const hoja = el('cssImpresion');
  const contenido = document.querySelector('.container');
  if (!hoja || !contenido) return null;
  const raiz = document.documentElement;
  const escalaAntes = raiz.style.getPropertyValue('--print-scale');
  const anchoAntes = document.body.style.width;
  const mediaAntes = hoja.media;
  // Al medir, la página pasa un instante a su versión de impresión (mucho más corta) y el navegador
  // te sube arriba: se guarda dónde estabas para volver exactamente ahí.
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  try {
    hoja.media = 'all';
    document.body.style.width = `${PRINT_ANCHO_PX}px`;
    const cabe = (escala) => {
      raiz.style.setProperty('--print-scale', escala);
      return contenido.getBoundingClientRect().height <= PRINT_ALTO_PX * PRINT_MARGEN_SEGURIDAD;
    };
    if (cabe(1)) return { escala: 1, cabe: true };
    if (!cabe(PRINT_ESCALA_MIN)) return { escala: PRINT_ESCALA_MIN, cabe: false };
    let bajo = PRINT_ESCALA_MIN;
    let alto = 1;
    for (let i = 0; i < 12; i++) {
      const medio = (bajo + alto) / 2;
      if (cabe(medio)) bajo = medio; else alto = medio;
    }
    return { escala: Math.floor(bajo * 100) / 100, cabe: true };
  } finally {
    hoja.media = mediaAntes;
    document.body.style.width = anchoAntes;
    raiz.style.setProperty('--print-scale', escalaAntes || 1);
    window.scrollTo(scrollX, scrollY);
  }
}

function actualizarAjusteUnaPaginaUI(resultado) {
  const activo = el('ajustarUnaPagina').checked;
  el('printScale').disabled = activo;
  const aviso = el('estadoAjusteUnaPagina');
  if (!activo) {
    aviso.textContent = TEXTO_AJUSTE_UNA_PAGINA;
  } else if (!resultado) {
    aviso.textContent = 'Activado: al imprimir se calcula el tamaño para que todo quepa en una hoja.';
  } else {
    const pct = Math.round(resultado.escala * 100);
    if (!resultado.cabe) aviso.textContent = `Ni reduciendo al ${pct} % cabe en una hoja: saldrá en dos páginas. Acorta algún texto o quita alguna tarea.`;
    else if (pct === 100) aviso.textContent = 'Cabe en una hoja sin reducir nada (100 %).';
    else aviso.textContent = `Se imprimirá al ${pct} % para que quepa en una hoja.`;
  }
}

function aplicarAjusteUnaPagina() {
  if (!el('ajustarUnaPagina').checked) return;
  const resultado = calcularEscalaUnaPagina();
  if (!resultado) return;
  const pct = Math.round(resultado.escala * 100);
  el('printScale').value = pct;
  el('printScaleLabel').textContent = pct;
  document.documentElement.style.setProperty('--print-scale', resultado.escala);
  actualizarAjusteUnaPaginaUI(resultado);
}

function conDe(texto) {
  return /^el\s/i.test(texto) ? `del ${texto.slice(3)}` : `de ${texto}`;
}

function actualizarTituloTipoTrabajo() {
  const tipo = el('tipoTrabajo').value;
  let titulo;
  if (tipo === 'exterior') {
    titulo = `Reparación y pintura ${conDe(el('exteriorElemento').value.trim() || 'la superficie')}`;
  } else if (tipo === 'interior') {
    titulo = `Reparación y pintura ${conDe(el('interiorElemento').value.trim() || 'la vivienda')}`;
  } else if (tipo === 'hierros') {
    titulo = `Reparación y pintura ${conDe(el('hierrosElemento').value.trim() || 'los hierros')}`;
  } else {
    titulo = TITULOS_TIPO_TRABAJO[tipo];
  }
  const elTitulo = el('tituloTipoTrabajo');
  elTitulo.value = titulo ?? '';
  elTitulo.classList.toggle('hidden', !titulo);
}

function toggleElementoUI() {
  el('campoExteriorElemento').classList.toggle('hidden', el('tipoTrabajo').value !== 'exterior');
  el('campoInteriorElemento').classList.toggle('hidden', el('tipoTrabajo').value !== 'interior');
  el('campoHierrosElemento').classList.toggle('hidden', el('tipoTrabajo').value !== 'hierros');
  el('campoNombreSeccion').classList.toggle('hidden', !el('tipoTrabajo').value);
}

function renderEmpleados() {
  const container = el('empleados');
  container.innerHTML = '';
  empleadoRows.forEach((row, index) => {
    const wrap = document.createElement('div');
    wrap.className = 'dynamic-row';
    wrap.innerHTML = `
      <div class="field">
        <label>Empleado ${index + 1} — Coste/día (€)</label>
        <input type="number" min="0" step="0.01" value="${row.cost}" data-role="cost">
      </div>
      <button type="button" class="btn-danger-icon" title="Eliminar">✕</button>
    `;
    const costInput = wrap.querySelector('input');
    costInput.addEventListener('input', () => { row.cost = costoNoNegativo(costInput); calcular(); });
    wrap.querySelector('button').addEventListener('click', () => {
      empleadoRows = empleadoRows.filter((x) => x !== row);
      renderEmpleados();
      calcular();
    });
    container.appendChild(wrap);
  });
  marcarCambio();
}

function cargarTrabajadoresHabituales() {
  try {
    trabajadoresHabituales = JSON.parse(localStorage.getItem(TRABAJADORES_KEY)) || [];
  } catch {
    trabajadoresHabituales = [];
  }
}

function guardarTrabajadoresHabituales() {
  localStorage.setItem(TRABAJADORES_KEY, JSON.stringify(trabajadoresHabituales));
}

function renderTrabajadoresHabituales() {
  const container = el('trabajadoresHabituales');
  container.innerHTML = '';
  trabajadoresHabituales.forEach((t) => {
    const wrap = document.createElement('div');
    wrap.className = 'dynamic-row';
    wrap.innerHTML = `
      <div class="field">
        <label>Nombre</label>
        <input type="text" value="${t.nombre.replace(/"/g, '&quot;')}" data-role="nombre" placeholder="Ej: Juan">
      </div>
      <div class="field" style="max-width:90px">
        <label>Normal (€)</label>
        <input type="number" min="0" step="0.01" value="${t.costeNormal}" data-role="normal">
      </div>
      <div class="field" style="max-width:90px">
        <label>Altura (€)</label>
        <input type="number" min="0" step="0.01" value="${t.costeAltura}" data-role="altura">
      </div>
      <button type="button" class="btn-danger-icon" title="Eliminar">✕</button>
    `;
    const [nombreInput, normalInput, alturaInput] = wrap.querySelectorAll('input');
    nombreInput.addEventListener('input', () => {
      t.nombre = nombreInput.value;
      guardarTrabajadoresHabituales();
      renderAccesoRapidoTrabajadores();
    });
    normalInput.addEventListener('input', () => {
      t.costeNormal = costoNoNegativo(normalInput);
      guardarTrabajadoresHabituales();
      renderAccesoRapidoTrabajadores();
    });
    alturaInput.addEventListener('input', () => {
      t.costeAltura = costoNoNegativo(alturaInput);
      guardarTrabajadoresHabituales();
      renderAccesoRapidoTrabajadores();
    });
    wrap.querySelector('button').addEventListener('click', () => {
      trabajadoresHabituales = trabajadoresHabituales.filter((x) => x !== t);
      guardarTrabajadoresHabituales();
      renderTrabajadoresHabituales();
      renderAccesoRapidoTrabajadores();
    });
    container.appendChild(wrap);
  });
}

function renderAccesoRapidoTrabajadores() {
  const container = el('accesoRapidoTrabajadores');
  container.innerHTML = '';
  trabajadoresHabituales.forEach((t) => {
    if (!t.nombre.trim()) return;
    const btnNormal = document.createElement('button');
    btnNormal.type = 'button';
    btnNormal.className = 'btn-chip';
    btnNormal.textContent = `+ ${t.nombre} (Normal ${money(t.costeNormal)})`;
    btnNormal.addEventListener('click', () => {
      empleadoRows.push({ cost: t.costeNormal });
      renderEmpleados();
      calcular();
      marcarCambio();
    });
    container.appendChild(btnNormal);

    const btnAltura = document.createElement('button');
    btnAltura.type = 'button';
    btnAltura.className = 'btn-chip';
    btnAltura.textContent = `+ ${t.nombre} (Altura ${money(t.costeAltura)})`;
    btnAltura.addEventListener('click', () => {
      empleadoRows.push({ cost: t.costeAltura });
      renderEmpleados();
      calcular();
      marcarCambio();
    });
    container.appendChild(btnAltura);
  });
}

function renderEquipo() {
  const container = el('equipoAltura');
  container.innerHTML = '';
  equipoRows.forEach((row) => {
    renderDynamicRow(container, row, (r) => {
      equipoRows = equipoRows.filter((x) => x !== r);
      renderEquipo();
      calcular();
    }, { descPlaceholder: 'Ej: Alquiler andamio' });
  });
  marcarCambio();
}

function renderExtras() {
  const container = el('extras');
  container.innerHTML = '';
  extraRows.forEach((row) => {
    renderDynamicRow(container, row, (r) => {
      extraRows = extraRows.filter((x) => x !== r);
      renderExtras();
      calcular();
    }, { descPlaceholder: 'Ej: Transporte' });
  });
  marcarCambio();
}

function calcular() {
  const dias = num('dias');
  el('diasLabel').textContent = dias;

  const costoManoObraDia = empleadoRows.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
  el('costoManoObraDia').textContent = money(costoManoObraDia);
  const totalManoObra = costoManoObraDia * dias;

  const totalPintura = num('precioMateriales');

  const incluirEquipo = el('incluirEquipo').checked;
  const totalEquipo = incluirEquipo
    ? equipoRows.reduce((sum, r) => sum + (Number(r.cost) || 0), 0)
    : 0;
  const totalExtras = extraRows.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);

  const incluirFibra = el('incluirFibra').checked;
  const totalFibra = incluirFibra ? num('fibraPrecioM2') * num('fibraMetros') : 0;

  const totalMargen = num('margen');
  const precioManual = el('precioManual').checked;
  const subtotal = precioManual ? num('subtotalManual') : (totalPintura + totalManoObra + totalEquipo + totalExtras + totalMargen + totalFibra);
  const exentoIgic = el('exentoIgic').checked;
  const totalIgic = exentoIgic ? 0 : subtotal * IGIC_RATE;
  const totalFinal = subtotal + totalIgic;
  el('labelIgic').textContent = exentoIgic ? 'Exento de IGIC' : 'IGIC (7%)';

  el('avisoPrecioManual').classList.toggle('hidden', !precioManual);
  el('totalPintura').textContent = money(totalPintura);
  el('totalManoObra').textContent = money(totalManoObra);
  el('totalEquipo').textContent = money(totalEquipo);
  el('totalFibra').textContent = money(totalFibra);
  el('totalExtras').textContent = money(totalExtras);
  el('totalMargen').textContent = money(totalMargen);
  el('subtotal').textContent = money(subtotal);
  el('totalIgic').textContent = money(totalIgic);
  el('totalFinal').textContent = money(totalFinal);

  return { totalPintura, totalManoObra, totalEquipo, totalFibra, totalExtras, totalMargen, subtotal, totalIgic, totalFinal };
}

function nuevoPresupuesto() {
  cargandoDatos = true;
  currentId = null;
  esFactura = false;
  esRecibo = false;
  facturaNumero = null;
  facturaFecha = new Date().toISOString();
  document.getElementById('formPresupuesto').reset();
  el('clienteNombre').value = '';
  el('clienteNif').value = '';
  el('clienteDireccion').value = '';
  el('dias').value = 1;
  el('margen').value = 0;
  el('incluirEquipo').checked = false;
  el('incluirFibra').checked = false;
  el('fibraPrecioM2').value = 0;
  el('fibraMetros').value = 0;
  el('exteriorElemento').value = '';
  el('interiorElemento').value = '';
  el('hierrosElemento').value = '';
  etapaRows = [];
  pasosEtapas = [];
  empleadoRows = [];
  equipoRows = [];
  extraRows = [];
  toggleEquipoUI();
  toggleFibraUI();
  togglePrecioManualUI();
  toggleElementoUI();
  actualizarModoFactura();
  actualizarVisibilidadCliente();
  actualizarVisibilidadCondiciones();
  actualizarTituloTipoTrabajo();
  resetPrintScale();
  renderEtapas();
  renderEmpleados();
  renderEquipo();
  renderExtras();
  calcular();
  cargandoDatos = false;
}

function recolectarDatos() {
  if (!currentId) currentId = Date.now().toString(36);
  return {
    id: currentId,
    fechaActualizacion: new Date().toISOString(),
    clienteNombre: el('clienteNombre').value,
    clienteNif: el('clienteNif').value,
    clienteDireccion: el('clienteDireccion').value,
    esFactura,
    esRecibo,
    facturaNumero,
    facturaFecha,
    condiciones: el('condiciones').value,
    titulo: el('tituloTipoTrabajo').value,
    tipoTrabajo: el('tipoTrabajo').value,
    exteriorElemento: el('exteriorElemento').value,
    interiorElemento: el('interiorElemento').value,
    hierrosElemento: el('hierrosElemento').value,
    etapaRows: JSON.parse(JSON.stringify(etapaRows)),
    dias: num('dias'),
    empleadoRows: JSON.parse(JSON.stringify(empleadoRows)),
    precioMateriales: num('precioMateriales'),
    incluirEquipo: el('incluirEquipo').checked,
    equipoRows: JSON.parse(JSON.stringify(equipoRows)),
    incluirFibra: el('incluirFibra').checked,
    fibraPrecioM2: num('fibraPrecioM2'),
    fibraMetros: num('fibraMetros'),
    extraRows: JSON.parse(JSON.stringify(extraRows)),
    margen: num('margen'),
    precioManual: el('precioManual').checked,
    subtotalManual: num('subtotalManual'),
    exentoIgic: el('exentoIgic').checked,
    ajustarUnaPagina: el('ajustarUnaPagina').checked,
    reciboConcepto: el('reciboConcepto').value,
    reciboImporte: num('reciboImporte'),
    reciboPorcentaje: el('reciboPorcentaje').value,
    reciboLugar: el('reciboLugar').value,
    totales: calcular(),
  };
}

function cargarDatos(data) {
  cargandoDatos = true;
  currentId = data.id;
  el('clienteNombre').value = data.clienteNombre ?? '';
  el('clienteNif').value = data.clienteNif ?? '';
  el('clienteDireccion').value = data.clienteDireccion ?? '';
  esFactura = data.esFactura ?? false;
  esRecibo = data.esRecibo ?? false;
  facturaNumero = data.facturaNumero ?? null;
  facturaFecha = data.facturaFecha ?? data.fechaActualizacion ?? new Date().toISOString();
  el('condiciones').value = data.condiciones ?? (esFactura ? CONDICIONES_FACTURA_DEFAULT : CONDICIONES_DEFAULT);
  el('dias').value = data.dias ?? 1;
  el('precioMateriales').value = data.precioMateriales ?? 0;
  el('margen').value = data.margen ?? 0;
  el('incluirEquipo').checked = data.incluirEquipo ?? false;
  el('incluirFibra').checked = data.incluirFibra ?? false;
  el('fibraPrecioM2').value = data.fibraPrecioM2 ?? 0;
  el('fibraMetros').value = data.fibraMetros ?? 0;
  el('precioManual').checked = data.precioManual ?? false;
  el('subtotalManual').value = data.subtotalManual ?? 0;
  el('exentoIgic').checked = data.exentoIgic ?? false;
  el('ajustarUnaPagina').checked = data.ajustarUnaPagina ?? false;
  el('reciboConcepto').value = data.reciboConcepto ?? '';
  el('reciboImporte').value = data.reciboImporte ?? 0;
  el('reciboPorcentaje').value = data.reciboPorcentaje ?? '50% inicial';
  el('reciboLugar').value = data.reciboLugar ?? 'S/C de Tenerife';
  let tipoTrabajo = data.tipoTrabajo ?? '';
  let exteriorElemento = data.exteriorElemento ?? '';
  let interiorElemento = data.interiorElemento ?? '';
  let hierrosElemento = data.hierrosElemento ?? '';
  if (tipoTrabajo === 'exterior_fachada') { tipoTrabajo = 'exterior'; exteriorElemento = exteriorElemento || 'la fachada'; }
  if (tipoTrabajo === 'exterior_batientes') { tipoTrabajo = 'exterior'; exteriorElemento = exteriorElemento || 'los batientes'; }
  if (tipoTrabajo === 'exterior' && !exteriorElemento) exteriorElemento = 'la fachada';
  if (tipoTrabajo === 'interior_vivienda') { tipoTrabajo = 'interior'; interiorElemento = interiorElemento || 'la vivienda'; }
  if (tipoTrabajo === 'interior_techo') { tipoTrabajo = 'interior'; interiorElemento = interiorElemento || 'el techo'; }
  if (tipoTrabajo === 'interior_escaleras') { tipoTrabajo = 'interior'; interiorElemento = interiorElemento || 'la caja de escaleras'; }
  if (tipoTrabajo === 'interior' && !interiorElemento) interiorElemento = 'la vivienda';
  if (tipoTrabajo === 'hierros' && !hierrosElemento) hierrosElemento = 'los hierros';
  el('tipoTrabajo').value = tipoTrabajo;
  el('exteriorElemento').value = exteriorElemento;
  el('interiorElemento').value = interiorElemento;
  el('hierrosElemento').value = hierrosElemento;
  etapaRows = data.etapaRows ? JSON.parse(JSON.stringify(data.etapaRows)) : [];
  pasosEtapas = [];
  el('nombreSeccion').value = '';
  empleadoRows = data.empleadoRows ? JSON.parse(JSON.stringify(data.empleadoRows)) : [];
  equipoRows = data.equipoRows ? JSON.parse(JSON.stringify(data.equipoRows)) : [];
  extraRows = data.extraRows ? JSON.parse(JSON.stringify(data.extraRows)) : [];
  toggleEquipoUI();
  toggleFibraUI();
  togglePrecioManualUI();
  toggleElementoUI();
  actualizarModoFactura();
  actualizarVisibilidadCliente();
  actualizarVisibilidadCondiciones();
  if (data.titulo !== undefined) {
    el('tituloTipoTrabajo').value = data.titulo;
    el('tituloTipoTrabajo').classList.toggle('hidden', !data.titulo);
  } else {
    actualizarTituloTipoTrabajo();
  }
  resetPrintScale();
  renderEtapas();
  renderEmpleados();
  renderEquipo();
  renderExtras();
  calcular();
  cargandoDatos = false;
}

const ULTIMA_COPIA_KEY = 'presupuestos-pintura-ultima-copia';

function obtenerContadoresFactura() {
  const contadores = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(`${FACTURA_CONTADOR_KEY}-`)) {
      contadores[key.slice(FACTURA_CONTADOR_KEY.length + 1)] = parseInt(localStorage.getItem(key), 10);
    }
  }
  return contadores;
}

function crearCopiaSeguridad() {
  return {
    app: 'presupuestos-pintura',
    version: 1,
    fecha: new Date().toISOString(),
    presupuestos: getHistorial(),
    empresa: {
      nombre: el('empresaNombre').value,
      actividad: el('empresaActividad').value,
      telefono: el('empresaTelefono').value,
      nifNombre: el('empresaNifNombre').value,
      nif: el('empresaNif').value,
      direccion: el('empresaDireccion').value,
    },
    trabajadores: trabajadoresHabituales,
    facturaContadores: obtenerContadoresFactura(),
  };
}

function actualizarTextoUltimaCopia() {
  const texto = el('textoUltimaCopia');
  const guardada = localStorage.getItem(ULTIMA_COPIA_KEY);
  if (!guardada) {
    texto.textContent = 'Todavía no has guardado ninguna copia.';
    return;
  }
  const dias = Math.floor((Date.now() - new Date(guardada).getTime()) / 86400000);
  texto.textContent = `Última copia: ${new Date(guardada).toLocaleDateString('es-ES')}` + (dias >= 7 ? ` (hace ${dias} días, conviene hacer otra)` : '');
}

async function guardarCopia() {
  const nombre = `presupuestos-copia-${new Date().toLocaleDateString('sv-SE')}.json`;
  const blob = new Blob([JSON.stringify(crearCopiaSeguridad(), null, 2)], { type: 'application/json' });
  const archivo = new File([blob], nombre, { type: 'application/json' });
  let hecho = false;
  if (navigator.maxTouchPoints > 1 && navigator.canShare && navigator.canShare({ files: [archivo] })) {
    try {
      await navigator.share({ files: [archivo], title: nombre });
      hecho = true;
    } catch (e) {
      if (e && e.name === 'AbortError') return;
    }
  }
  if (!hecho) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  localStorage.setItem(ULTIMA_COPIA_KEY, new Date().toISOString());
  actualizarTextoUltimaCopia();
}

function restaurarCopia(archivo) {
  const lector = new FileReader();
  lector.onload = () => {
    let copia;
    try {
      copia = JSON.parse(lector.result);
    } catch {
      alert('El archivo no es una copia válida.');
      return;
    }
    if (!copia || copia.app !== 'presupuestos-pintura' || !Array.isArray(copia.presupuestos)) {
      alert('El archivo no es una copia de Presupuestos de Pintura.');
      return;
    }

    const actual = getHistorial();
    let nuevos = 0;
    let actualizados = 0;
    copia.presupuestos.forEach((p) => {
      if (!p || !p.id) return;
      const i = actual.findIndex((x) => x.id === p.id);
      if (i < 0) {
        actual.push(p);
        nuevos += 1;
      } else if (new Date(p.fechaActualizacion) > new Date(actual[i].fechaActualizacion)) {
        actual[i] = p;
        actualizados += 1;
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actual));

    const empresa = copia.empresa || {};
    const campos = { nombre: 'empresaNombre', actividad: 'empresaActividad', telefono: 'empresaTelefono', nifNombre: 'empresaNifNombre', nif: 'empresaNif', direccion: 'empresaDireccion' };
    Object.entries(campos).forEach(([clave, id]) => {
      if (!el(id).value.trim() && empresa[clave]) el(id).value = empresa[clave];
    });
    guardarEmpresa();

    if (Array.isArray(copia.trabajadores)) {
      copia.trabajadores.forEach((t) => {
        if (!t || !t.nombre) return;
        if (!trabajadoresHabituales.some((x) => (x.nombre || '').trim().toLowerCase() === t.nombre.trim().toLowerCase())) {
          trabajadoresHabituales.push({ nombre: t.nombre, costeNormal: t.costeNormal || 0, costeAltura: t.costeAltura || 0 });
        }
      });
      guardarTrabajadoresHabituales();
      renderTrabajadoresHabituales();
      renderAccesoRapidoTrabajadores();
    }

    Object.entries(copia.facturaContadores || {}).forEach(([anio, numero]) => {
      if (numero > 0) registrarNumeroFacturaUsado(numero, anio);
    });

    renderHistorial();
    alert(`Copia restaurada ✅\n${nuevos} documento(s) añadido(s) y ${actualizados} actualizado(s).`);
  };
  lector.readAsText(archivo);
}

function getHistorial() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function guardarEnHistorial() {
  const datos = recolectarDatos();
  const historial = getHistorial();
  const idx = historial.findIndex((p) => p.id === datos.id);
  if (idx >= 0) historial[idx] = datos; else historial.unshift(datos);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
  mostrarEstadoGuardado();
}

function renderHistorial() {
  const lista = el('listaHistorial');
  const historial = getHistorial();
  lista.innerHTML = '';
  if (historial.length === 0) {
    lista.innerHTML = '<div class="historial-vacio">Todavía no hay nada guardado.</div>';
    return;
  }
  historial
    .slice()
    .sort((a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion))
    .forEach((p) => {
      const item = document.createElement('div');
      item.className = 'historial-item';
      const fecha = new Date(p.fechaActualizacion).toLocaleDateString('es-ES');
      let badge = '';
      let totalMostrado = money(p.totales?.totalFinal || 0);
      let titulo;
      if (p.esFactura) {
        const numeroCompleto = p.facturaFecha ? `${p.facturaNumero}/${new Date(p.facturaFecha).getFullYear()}` : p.facturaNumero;
        badge = `<span class="badge-factura">Factura Nº ${numeroCompleto}</span>`;
        titulo = p.clienteNombre || 'Factura';
      } else if (p.esRecibo) {
        badge = '<span class="badge-recibo">Recibí</span>';
        totalMostrado = money(p.reciboImporte || 0);
        titulo = p.clienteNombre || 'Recibí';
      } else {
        titulo = p.clienteNombre || p.titulo || 'Presupuesto';
      }
      item.innerHTML = `
        <div class="info">
          <div class="nombre">${badge}${titulo}</div>
          <div class="meta">${fecha}</div>
        </div>
        <div class="total">${totalMostrado}</div>
        <button class="btn-danger-icon" title="Eliminar">✕</button>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        cargarDatos(p);
        el('modalHistorial').classList.add('hidden');
      });
      item.querySelector('.btn-danger-icon').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('¿Eliminar este documento del historial?')) {
          const nuevo = getHistorial().filter((x) => x.id !== p.id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo));
          if (p.id === currentId) currentId = null;
          renderHistorial();
        }
      });
      lista.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  cargarEmpresa();
  ['empresaNombre', 'empresaActividad', 'empresaTelefono', 'empresaNifNombre', 'empresaNif', 'empresaDireccion'].forEach((id) => el(id).addEventListener('input', guardarEmpresa));

  cargarTrabajadoresHabituales();
  renderTrabajadoresHabituales();
  renderAccesoRapidoTrabajadores();
  el('btnAddTrabajadorHabitual').addEventListener('click', () => {
    trabajadoresHabituales.push({ nombre: '', costeNormal: 0, costeAltura: 0 });
    guardarTrabajadoresHabituales();
    renderTrabajadoresHabituales();
    renderAccesoRapidoTrabajadores();
  });

  ['dias', 'precioMateriales', 'margen', 'fibraPrecioM2', 'fibraMetros'].forEach((id) => el(id).addEventListener('input', calcular));

  el('clienteNombre').addEventListener('input', actualizarVisibilidadCliente);
  el('clienteNombre').addEventListener('input', marcarCambio);
  el('clienteNombre').addEventListener('input', actualizarModoFactura);
  el('clienteNif').addEventListener('input', marcarCambio);
  el('clienteNif').addEventListener('input', actualizarModoFactura);
  el('clienteDireccion').addEventListener('input', marcarCambio);
  el('clienteDireccion').addEventListener('input', actualizarModoFactura);
  el('condiciones').addEventListener('input', actualizarVisibilidadCondiciones);

  el('printScale').addEventListener('input', () => {
    const valor = el('printScale').value;
    el('printScaleLabel').textContent = valor;
    document.documentElement.style.setProperty('--print-scale', valor / 100);
  });
  el('printOffsetX').addEventListener('input', () => {
    const valor = el('printOffsetX').value;
    el('printOffsetXLabel').textContent = valor;
    document.documentElement.style.setProperty('--print-offset-x', `${valor}mm`);
  });
  actualizarVisibilidadCliente();
  actualizarVisibilidadCondiciones();
  actualizarTituloTipoTrabajo();
  toggleElementoUI();
  actualizarModoFactura();
  el('tipoTrabajo').addEventListener('change', toggleElementoUI);

  el('incluirEquipo').addEventListener('change', () => {
    toggleEquipoUI();
    calcular();
  });
  el('incluirFibra').addEventListener('change', () => {
    toggleFibraUI();
    calcular();
  });
  el('precioManual').addEventListener('change', () => {
    togglePrecioManualUI();
    calcular();
  });
  el('subtotalManual').addEventListener('input', calcular);
  el('exentoIgic').addEventListener('change', () => {
    const exento = el('exentoIgic').checked;
    const de = exento ? 'Incluye IGIC.' : 'Exento de IGIC.';
    const a = exento ? 'Exento de IGIC.' : 'Incluye IGIC.';
    el('condiciones').value = el('condiciones').value.split('\n').map((l) => (l.trim() === de ? a : l)).join('\n');
    actualizarVisibilidadCondiciones();
    calcular();
  });

  el('btnCargarEtapas').addEventListener('click', () => {
    const tipo = el('tipoTrabajo').value;
    if (!tipo) {
      alert('Primero elige un tipo de trabajo.');
      return;
    }
    let plantilla;
    let etiquetaSeccion;
    if (tipo === 'exterior') {
      const elemento = el('exteriorElemento').value.trim() || 'la superficie';
      plantilla = etapasExterior();
      etiquetaSeccion = capitalizar(elemento);
    } else if (tipo === 'interior') {
      const elemento = el('interiorElemento').value.trim() || 'la vivienda';
      plantilla = etapasInterior();
      etiquetaSeccion = capitalizar(elemento);
    } else if (tipo === 'hierros') {
      const elemento = el('hierrosElemento').value.trim() || 'los hierros';
      plantilla = etapasHierros();
      etiquetaSeccion = capitalizar(elemento);
    } else {
      plantilla = ETAPAS_TEMPLATES[tipo];
      etiquetaSeccion = TITULOS_TIPO_TRABAJO[tipo] || tipo;
    }
    guardarPasoEtapas();
    const nombreSeccion = el('nombreSeccion').value.trim();
    if (nombreSeccion) etiquetaSeccion = capitalizar(nombreSeccion);
    el('nombreSeccion').value = '';
    const esPrimeraCarga = etapaRows.length === 0;
    const nuevasFilas = [seccion(etiquetaSeccion), ...plantilla.map((row) => ({ ...row }))];
    etapaRows = etapaRows.concat(nuevasFilas);
    if (esPrimeraCarga) actualizarTituloTipoTrabajo();
    actualizarOffsetImpresion();
    renderEtapas();
  });
  el('btnDeshacerEtapas').addEventListener('click', deshacerEtapas);
  el('btnAddCapitulo').addEventListener('click', () => {
    guardarPasoEtapas();
    etapaRows.push(capitulo(''));
    renderEtapas();
  });
  el('btnAddEtapa').addEventListener('click', () => {
    guardarPasoEtapas();
    etapaRows.push(tarea(''));
    renderEtapas();
  });
  el('btnAddEmpleado').addEventListener('click', () => {
    empleadoRows.push({ cost: 0 });
    renderEmpleados();
  });
  el('btnAddEquipo').addEventListener('click', () => {
    equipoRows.push({ desc: '', cost: 0 });
    renderEquipo();
  });
  el('btnAddExtra').addEventListener('click', () => {
    extraRows.push({ desc: '', cost: 0 });
    renderExtras();
  });

  el('ajustarUnaPagina').addEventListener('change', () => {
    if (el('ajustarUnaPagina').checked) {
      aplicarAjusteUnaPagina();
    } else {
      document.documentElement.style.setProperty('--print-scale', el('printScale').value / 100);
      actualizarAjusteUnaPaginaUI();
    }
    marcarCambio();
  });
  el('btnImprimir').addEventListener('click', () => {
    aplicarAjusteUnaPagina();
    document.title = nombreDocumentoParaImprimir();
    window.print();
  });
  el('btnNuevaFactura').addEventListener('click', nuevaFactura);
  el('btnNuevoRecibo').addEventListener('click', nuevoRecibo);
  el('btnVistaPrevia').addEventListener('click', () => {
    document.body.classList.add('modo-vista-previa');
    el('barraVistaPrevia').classList.remove('hidden');
    window.scrollTo(0, 0);
  });
  el('btnCerrarVistaPrevia').addEventListener('click', () => {
    document.body.classList.remove('modo-vista-previa');
    el('barraVistaPrevia').classList.add('hidden');
  });
  el('btnNuevo').addEventListener('click', nuevoPresupuesto);
  el('btnHistorial').addEventListener('click', () => {
    renderHistorial();
    actualizarTextoUltimaCopia();
    el('modalHistorial').classList.remove('hidden');
  });
  el('btnCerrarHistorial').addEventListener('click', () => {
    el('modalHistorial').classList.add('hidden');
  });
  el('btnGuardarCopia').addEventListener('click', guardarCopia);
  el('btnRestaurarCopia').addEventListener('click', () => el('inputRestaurarCopia').click());
  el('inputRestaurarCopia').addEventListener('change', () => {
    const archivo = el('inputRestaurarCopia').files[0];
    if (archivo) restaurarCopia(archivo);
    el('inputRestaurarCopia').value = '';
  });

  el('fechaDocumento').addEventListener('change', () => {
    const valor = el('fechaDocumento').value;
    facturaFecha = valor ? new Date(valor).toISOString() : new Date().toISOString();
    actualizarModoFactura();
    marcarCambio();
  });

  ['reciboConcepto', 'reciboImporte', 'reciboPorcentaje', 'reciboLugar'].forEach((id) => el(id).addEventListener('input', actualizarRecibo));

  el('formPresupuesto').addEventListener('input', marcarCambio);
  el('formPresupuesto').addEventListener('change', marcarCambio);

  toggleEquipoUI();
  toggleFibraUI();
  togglePrecioManualUI();
  calcular();
});


function nombreDocumentoParaImprimir() {
  const cliente = el('clienteNombre').value.trim();
  let base;
  if (esFactura) {
    const anio = facturaFecha ? new Date(facturaFecha).getFullYear() : new Date().getFullYear();
    base = `Factura ${facturaNumero}-${anio}`;
  } else if (esRecibo) {
    base = 'Recibí';
  } else {
    base = 'Presupuesto';
  }
  if (cliente) base += ` - ${cliente}`;
  return base.replace(/[/\\:*?"<>|]/g, '-');
}

window.addEventListener('beforeprint', () => {
  aplicarAjusteUnaPagina();
  document.title = nombreDocumentoParaImprimir();
});

window.addEventListener('afterprint', () => {
  document.title = 'Presupuestos de Pintura';
});
