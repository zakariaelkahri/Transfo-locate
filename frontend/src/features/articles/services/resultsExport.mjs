const locationHeaders = ['Zone', 'Allée', 'Rack', 'Travée', 'Niveau']
const locationValues = (loc) => ['zone', 'alee', 'rack', 'travee', 'niveau'].map(key => text(loc?.[key]))
const text = (value) => value == null ? '' : String(value)
const quantity = (value) => {
  if (value == null || value === '') return ''
  const number = Number(value)
  return Number.isFinite(number) ? number : text(value)
}

export function articleExport(loc) {
  return {
    name: 'Articles',
    headers: ['ITMREF', 'LOT', 'SLO', 'N° Série', 'Type', 'Qté', 'Site', ...locationHeaders],
    rows: loc.map(item => [
      text(item.ITMREF), text(item.LOT), text(item.SLO), text(item.SERNUM),
      text(item.LOCTYP), quantity(item.QTYSTU), text(item.STOFCY), ...locationValues(item.LOC),
    ]),
  }
}

export function ofExport(groups) {
  return {
    name: 'Matières par OF',
    headers: ['OF', 'N° Ligne', 'Article (ITMREF)', 'Désignation', 'Qté allouée', 'Qté US', 'LOT', 'SLO', 'Statut', 'Qté stock', 'Site', ...locationHeaders],
    rows: groups.flatMap(({ of, items }) => items.map(item => {
      const stock = item['stock infos'] ?? {}
      return [
        text(of), text(item['No ligne']), text(stock.ITMREF), text(stock.ITMDES1),
        quantity(item['Quantité allouée']), quantity(item['Quantité US']),
        text(stock.LOT), text(stock.SLO), text(stock.STA), quantity(stock.QTYSTU),
        text(stock.STOFCY), ...locationValues(stock.LOC),
      ]
    })),
  }
}

export async function createWorkbook({ name, headers, rows }) {
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet(name)
  sheet.columns = headers.map(header => ({ header, width: Math.max(16, header.length + 4) }))
  sheet.addRows(rows)
  sheet.views = [{ state: 'frozen', ySplit: 1 }]
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: rows.length + 1, column: headers.length } }
  sheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } }
  })
  return workbook.xlsx.writeBuffer()
}

export async function downloadResults(data, filename) {
  const buffer = await createWorkbook(data)
  const url = URL.createObjectURL(new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.xlsx`
  document.body.appendChild(link)
  try {
    link.click()
  } finally {
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
