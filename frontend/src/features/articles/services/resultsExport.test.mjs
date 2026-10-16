import test from 'node:test'
import assert from 'node:assert/strict'
import ExcelJS from 'exceljs'
import { articleExport, ofExport, createWorkbook } from './resultsExport.mjs'

test('article workbook preserves identifiers, literal formulas, quantities and missing locations', async () => {
  const buffer = await createWorkbook(articleExport([
    { ITMREF: '00123', LOT: '=1+1', SERNUM: '00009', QTYSTU: '2.5', LOC: { zone: 'Z1', alee: '02' } },
    { ITMREF: 'Other', QTYSTU: 0 },
  ]))
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const sheet = workbook.getWorksheet('Articles')
  assert.equal(sheet.rowCount, 3)
  assert.equal(sheet.getCell('A2').value, '00123')
  assert.equal(sheet.getCell('B2').value, '=1+1')
  assert.equal(sheet.getCell('B2').type, ExcelJS.ValueType.String)
  assert.equal(sheet.getCell('D2').value, '00009')
  assert.equal(sheet.getCell('F2').value, 2.5)
  assert.equal(sheet.getCell('F3').value, 0)
  assert.equal(sheet.getCell('I2').value, '02')
  assert.ok([null, ''].includes(sheet.getCell('H3').value))
})

test('OF workbook includes all groups with their OF and stock fields', async () => {
  const data = ofExport([
    { of: 'OF01', items: [{ 'No ligne': 1, 'Quantité allouée': 3, 'Quantité US': '1.5', 'stock infos': { ITMREF: '001', ITMDES1: 'Désignation', QTYSTU: 7, LOC: { niveau: '04' } } }] },
    { of: 'OF02', items: [{ 'No ligne': 2 }] },
    { of: 'OF03', items: [] },
  ])
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(await createWorkbook(data))
  const sheet = workbook.worksheets[0]
  assert.equal(sheet.rowCount, 3)
  assert.equal(sheet.getCell('A2').value, 'OF01')
  assert.equal(sheet.getCell('A3').value, 'OF02')
  assert.equal(sheet.getCell('D2').value, 'Désignation')
  assert.equal(sheet.getCell('E2').value, 3)
  assert.equal(sheet.getCell('F2').value, 1.5)
  assert.equal(sheet.getCell('J2').value, 7)
  assert.equal(sheet.getCell('P2').value, '04')
})
