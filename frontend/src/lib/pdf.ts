import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

export function exportarReportePDF({
  titulo,
  subtitulo,
  columnas,
  filas,
  nombreArchivo,
}: {
  titulo: string
  subtitulo?: string
  columnas: string[]
  filas: (string | number)[][]
  nombreArchivo: string
}) {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text(titulo, 14, 18)
  doc.setFontSize(10)
  doc.setTextColor(120)
  doc.text(subtitulo || `Generado el ${new Date().toLocaleString('es-AR')}`, 14, 25)

  autoTable(doc, {
    startY: 32,
    head: [columnas],
    body: filas,
    headStyles: { fillColor: [220, 38, 38] },
    styles: { fontSize: 9 },
  })

  doc.save(nombreArchivo.endsWith('.pdf') ? nombreArchivo : `${nombreArchivo}.pdf`)
}
