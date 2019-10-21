import path from 'path'
import Excel from 'exceljs'
import { ArgumentParser } from 'argparse'
import DataStore from 'nedb'
import Database, { DB_SCORES_PATH } from '../server/database'
import { FieldLabels } from '../server/database/fields'

const parser = new ArgumentParser({
  description: `QWQUIVER v${process.env.npm_package_version} Command Line Interface`,
  version: `v${process.env.npm_package_version}`,
  addHelp: true
})

const subparsers = parser.addSubparsers({
  title: 'Actions',
  dest: 'action'
})

const toolBar = subparsers.addParser('tool', { help: '工具', addHelp: true })
toolBar.addArgument('toolName', {
  action: 'store',
  type: 'string',
  help: '工具名'
})

const configBar = subparsers.addParser('config', {
  help: '配置',
  addHelp: true
})

const importBar = subparsers.addParser('import', {
  help: '导入',
  addHelp: true
})
importBar.addArgument('fileName', {
  action: 'store',
  type: 'string',
  help: '文件路径'
})

const args = parser.parseArgs()
console.dir(args)

Object.keys(FieldLabels).forEach((o) => {
  console.log(o)
})

if (args.action === 'import' && !!args.fileName) {
  const db = new DataStore({
    filename: path.join(DB_SCORES_PATH, path.basename(args.fileName).replace(path.extname(args.fileName), '') + '.db'),
    autoload: true
  })

  const tableHeadRowPos = 1
  const workbook = new Excel.Workbook()

  workbook.xlsx.readFile(args.fileName).then((w) => {
    w.getWorksheet(1)
      .getRow(tableHeadRowPos)
      .eachCell((cell, colNumber) => {
        console.dir(cell.text)
        db.insert({ text: cell.text })
      })
  })
}
