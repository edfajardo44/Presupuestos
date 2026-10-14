// Versión móvil: genera el PDF del presupuesto directamente (sin pasar por la impresión de Safari,
// que en iPhone añade pie con URL/fecha/página y puede recortar el documento).
(function () {
  const ML = 12;
  const W = 186;
  const MT = 12;
  const YB = 283;
  const PAD = 4;
  const PT = 0.3528;
  const C = {
    verde: [22, 163, 74],
    verdeOsc: [15, 122, 55],
    texto: [28, 37, 48],
    muted: [100, 116, 139],
    borde: [226, 232, 240],
    resFondo: [240, 250, 243],
    resBorde: [191, 230, 204],
    negro: [0, 0, 0],
  };

  function dinero(n) {
    return money(n).replace(/ /g, ' ');
  }

  function imagenMuneco() {
    const img = document.querySelector('.muneco-icon');
    if (!img || !img.naturalWidth) return null;
    const escala = 4;
    const c = document.createElement('canvas');
    c.width = img.naturalWidth * escala;
    c.height = img.naturalHeight * escala;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return { data: c.toDataURL('image/png'), proporcion: img.naturalWidth / img.naturalHeight };
  }

  function crearPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    let y = MT;
    const x0 = ML + PAD;
    const cw = W - 2 * PAD;

    function fuente(size, estilo = 'normal', color = C.texto) {
      doc.setFont('helvetica', estilo);
      doc.setFontSize(size);
      doc.setTextColor(...color);
    }
    function lineas(texto, ancho) {
      return doc.splitTextToSize(texto, ancho);
    }
    function nuevaPagina() {
      doc.addPage();
      y = MT;
    }

    // ---------- Membrete ----------
    const nombreEmpresa = el('empresaNombre').value.trim();
    const actividad = el('empresaActividad').value.trim();
    const telefono = el('empresaTelefono').value.trim();
    const cliente = el('clienteNombre').value.trim();
    const fecha = (facturaFecha ? new Date(facturaFecha) : new Date()).toLocaleDateString('es-ES');

    const membreteTop = y;
    const badgeX = ML + PAD;
    const badgeY = membreteTop + PAD;
    const badgeH = 19;
    fuente(17, 'bold', C.negro);
    const textoJbmW = doc.getTextWidth('JBM');
    const muneco = imagenMuneco();
    const munecoH = 15;
    const munecoW = muneco ? munecoH * muneco.proporcion : 0;
    const badgeW = 3 + textoJbmW + (muneco ? munecoW - 1.5 : 0) + 3;
    doc.setFillColor(...C.verde);
    doc.setDrawColor(...C.negro);
    doc.setLineWidth(0.5);
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 3.2, 3.2, 'FD');
    fuente(17, 'bold', C.negro);
    doc.text('JBM', badgeX + 3, badgeY + 12.3);
    if (muneco) {
      doc.addImage(muneco.data, 'PNG', badgeX + 3 + textoJbmW - 1.5, badgeY + (badgeH - munecoH) / 2, munecoW, munecoH);
    }

    const nombreX = badgeX + badgeW + 5;
    fuente(15, 'bold', C.verde);
    doc.setDrawColor(...C.negro);
    doc.setLineWidth(0.18);
    doc.text(nombreEmpresa, nombreX, badgeY + 8.4, { renderingMode: 'fillThenStroke' });
    fuente(9, 'bold');
    doc.text(actividad, nombreX, badgeY + 14.4);

    let yMeta = badgeY + badgeH + 6;
    fuente(10.5, 'bold');
    doc.text('Presupuesto', ML + W - PAD, yMeta, { align: 'right' });
    fuente(9, 'normal');
    doc.text(`Fecha: ${fecha}`, ML + W - PAD, yMeta + 4.6, { align: 'right' });

    let yFila = yMeta + 7;
    fuente(8, 'normal', C.muted);
    doc.text('Teléfono', x0, yFila + 3);
    fuente(11, 'normal');
    doc.text(telefono, x0, yFila + 8.4);
    let alturaFila = 11;
    if (cliente) {
      const colX = ML + W / 2;
      fuente(8, 'normal', C.muted);
      doc.text('Cliente', colX, yFila + 3);
      fuente(11, 'normal');
      const ls = lineas(cliente, W / 2 - PAD);
      doc.text(ls, colX, yFila + 8.4);
      alturaFila = 8.4 + (ls.length - 1) * 4.8 + 3;
    }
    const membreteBottom = yFila + alturaFila + PAD;
    doc.setDrawColor(...C.borde);
    doc.setLineWidth(0.3);
    doc.roundedRect(ML, membreteTop, W, membreteBottom - membreteTop, 2.5, 2.5, 'S');
    y = membreteBottom + 3;

    // ---------- Tarjeta principal (título + etapas) ----------
    let tarjetaInicio = null;
    function abrirTarjeta() {
      tarjetaInicio = y;
      y += PAD;
    }
    function cerrarTarjeta() {
      if (tarjetaInicio === null) return;
      y += PAD - 1;
      doc.setDrawColor(...C.borde);
      doc.setLineWidth(0.3);
      doc.roundedRect(ML, tarjetaInicio, W, y - tarjetaInicio, 2.5, 2.5, 'S');
      tarjetaInicio = null;
      y += 3;
    }
    function asegurarEspacio(h) {
      if (y + h <= YB) return;
      const habiaTarjeta = tarjetaInicio !== null;
      cerrarTarjeta();
      nuevaPagina();
      if (habiaTarjeta) abrirTarjeta();
    }

    abrirTarjeta();

    const titulo = el('tituloTipoTrabajo').value.trim();
    if (titulo) {
      fuente(10.5, 'bold');
      const ls = lineas(titulo.toUpperCase(), cw);
      ls.forEach((l, i) => doc.text(l, ML + W / 2, y + 4.2 + i * 4.8, { align: 'center' }));
      y += 4.2 + (ls.length - 1) * 4.8 + 2.6;
      doc.setDrawColor(...C.verde);
      doc.setLineWidth(0.5);
      doc.line(x0, y, x0 + cw, y);
      y += 3;
    }

    function bloqueSeccion(texto) {
      fuente(9.5, 'bold', C.verde);
      const ls = lineas(texto.toUpperCase(), cw);
      return {
        h: 3.5 + ls.length * 4.4 + 2,
        keepNext: true,
        draw(yy) {
          doc.setDrawColor(...C.verde);
          doc.setLineWidth(0.5);
          doc.setLineDashPattern([1.4, 1], 0);
          doc.line(x0, yy + 2, x0 + cw, yy + 2);
          doc.setLineDashPattern([], 0);
          fuente(9.5, 'bold', C.verde);
          ls.forEach((l, i) => doc.text(l, ML + W / 2, yy + 2 + 4.4 + i * 4.4, { align: 'center' }));
        },
      };
    }

    function bloqueCapitulo(texto) {
      fuente(10, 'bold', C.negro);
      const ls = lineas(texto, cw - 7);
      const barH = ls.length * 4.6 + 3.4;
      return {
        h: 1.5 + barH + 2,
        keepNext: true,
        draw(yy) {
          doc.setFillColor(...C.verde);
          doc.roundedRect(x0, yy + 1.5, cw, barH, 1.8, 1.8, 'F');
          fuente(10, 'bold', C.negro);
          ls.forEach((l, i) => doc.text(l, x0 + 3, yy + 1.5 + 4.4 + i * 4.6));
        },
      };
    }

    function bloqueTarea(numero, texto) {
      fuente(9.5, 'normal');
      const ls = lineas(texto, cw - 14.5);
      return {
        h: Math.max(ls.length * 4.3, 4.6) + 3,
        keepNext: false,
        draw(yy) {
          doc.setFillColor(...C.verde);
          doc.setDrawColor(...C.negro);
          doc.setLineWidth(0.35);
          doc.roundedRect(x0, yy + 0.3, 10.5, 4.4, 2.2, 2.2, 'FD');
          fuente(6.5, 'bold', C.negro);
          doc.text(numero, x0 + 5.25, yy + 3.3, { align: 'center' });
          fuente(9.5, 'normal');
          ls.forEach((l, i) => doc.text(l, x0 + 14.5, yy + 3.5 + i * 4.3));
        },
      };
    }

    const bloques = [];
    let capNum = 0;
    let tareaNum = 0;
    etapaRows.forEach((row) => {
      const desc = (row.desc || '').trim();
      if (row.esSeccion) {
        if (desc) bloques.push(bloqueSeccion(desc));
      } else if (row.esCapitulo) {
        capNum += 1;
        tareaNum = 0;
        if (desc) bloques.push(bloqueCapitulo(`${capNum}.  ${desc}`));
      } else {
        tareaNum += 1;
        const numero = capNum > 0 ? `${capNum}.${String(tareaNum).padStart(2, '0')}` : String(tareaNum);
        if (desc) bloques.push(bloqueTarea(numero, desc));
      }
    });

    bloques.forEach((b, i) => {
      const sig = bloques[i + 1];
      const necesita = b.h + (b.keepNext && sig ? sig.h : 0) + PAD;
      asegurarEspacio(necesita);
      b.draw(y);
      y += b.h;
    });
    cerrarTarjeta();

    // ---------- Resumen ----------
    const totales = calcular();
    const exento = el('exentoIgic').checked;
    const hRes = 35;
    if (y + hRes > YB) nuevaPagina();
    doc.setFillColor(...C.resFondo);
    doc.setDrawColor(...C.resBorde);
    doc.setLineWidth(0.3);
    doc.roundedRect(ML, y, W, hRes, 2.5, 2.5, 'FD');
    fuente(10.5, 'bold', C.verdeOsc);
    doc.text('Resumen', x0, y + 7.5);
    doc.setDrawColor(...C.borde);
    doc.setLineWidth(0.25);
    doc.line(x0, y + 10, x0 + cw, y + 10);
    fuente(9.5, 'bold');
    doc.text('Subtotal', x0, y + 16);
    doc.text(dinero(totales.subtotal), x0 + cw, y + 16, { align: 'right' });
    fuente(9, 'normal');
    doc.text(exento ? 'Exento de IGIC' : 'IGIC (7%)', x0, y + 21.2);
    doc.text(dinero(totales.totalIgic), x0 + cw, y + 21.2, { align: 'right' });
    doc.setDrawColor(...C.negro);
    doc.setLineWidth(0.5);
    doc.line(x0, y + 24, x0 + cw, y + 24);
    fuente(12.5, 'bold');
    doc.text('TOTAL', x0, y + 30.8);
    doc.text(dinero(totales.totalFinal), x0 + cw, y + 30.8, { align: 'right' });
    y += hRes + 3;

    // ---------- Condiciones ----------
    const textoCondiciones = el('condiciones').value.trim();
    if (textoCondiciones) {
      fuente(9.5, 'normal');
      const ls = textoCondiciones.split('\n').flatMap((l) => lineas(l, cw));
      const hCond = PAD + 6.5 + ls.length * 4.3 + PAD - 1;
      if (y + hCond > YB) nuevaPagina();
      doc.setDrawColor(...C.borde);
      doc.setLineWidth(0.3);
      doc.roundedRect(ML, y, W, hCond, 2.5, 2.5, 'S');
      fuente(10.5, 'bold', C.verdeOsc);
      doc.text('Condiciones', x0, y + PAD + 3.6);
      fuente(9.5, 'normal');
      ls.forEach((l, i) => doc.text(l, x0, y + PAD + 9.4 + i * 4.3));
      y += hCond + 3;
    }

    // ---------- Firmas ----------
    if (y + 21 > YB + 3) nuevaPagina();
    y += 3;
    const colW = (W - 5) / 2;
    fuente(9.5, 'normal');
    doc.text('Conforme empresa:', ML, y + 4);
    doc.text('Conforme Cliente:', ML + colW + 5, y + 4);
    doc.setDrawColor(51, 51, 51);
    doc.setLineWidth(0.3);
    doc.line(ML, y + 15, ML + colW, y + 15);
    doc.line(ML + colW + 5, y + 15, ML + W, y + 15);

    return doc;
  }

  async function crearYCompartir() {
    const nombre = `${nombreDocumentoParaImprimir()}.pdf`;
    let doc;
    try {
      doc = crearPdf();
      doc.setProperties({ title: nombre.replace(/\.pdf$/, '') });
    } catch (e) {
      alert('No se pudo crear el PDF: ' + e.message);
      return;
    }
    const blob = doc.output('blob');
    const archivo = new File([blob], nombre, { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
      try {
        await navigator.share({ files: [archivo], title: nombre });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  window.__crearPdfPresupuesto = crearPdf;

  document.addEventListener('DOMContentLoaded', () => {
    const boton = el('btnImprimir');
    const nuevo = boton.cloneNode(true);
    boton.replaceWith(nuevo);
    nuevo.addEventListener('click', crearYCompartir);
  });
})();
