
import {download, generateCsv, mkConfig} from 'export-to-csv';
import moment from 'moment'
import * as XLSX from 'xlsx'

export function ExportExcelFile(data, title, header, headerDisplay) {
  var newData = [headerDisplay, ...data];
  var sheet =
      XLSX.utils.json_to_sheet(newData, {header: header, skipHeader: true})
  var wb = XLSX.utils.book_new()

  // 生成sheet
  // 二进制文件
  XLSX.utils.book_append_sheet(wb, sheet, title)
  var blob = sheet2blob(wb, title)
  var start = moment().format('yyyyMMddHHmmss')
  openDownloadDialog(blob, title + '.xlsx')
}

export function ExortCSVFile(data, fileName, header, headerDisplay) {
  var newData = [headerDisplay, ...data];
  var sheet =
      XLSX.utils.json_to_sheet(newData, {header: header, skipHeader: true})
  var jsonData = XLSX.utils.sheet_to_json(sheet)
  //以上代码是借助xlsx的包把表头替换进去。
  const csvConfig =
      mkConfig({useKeysAsHeaders: true, filename: fileName, columnHeaders: []});

  // Converts your Array<Object> to a CsvOutput string based on the configs
  const csv = generateCsv(csvConfig)(jsonData);
  download(csvConfig)(csv);
}


function sheet2blob(workbook, title) {
  // 生成excel的配置项
  var wopts = {
    bookType: 'xlsx',  // 要生成的文件类型
    bookSST: false,
    type: 'binary'
  }

  var wbout = XLSX.write(workbook, wopts)
  var blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'})
  // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }

  return blob
}

function openDownloadDialog(blob, fileName) {
  if (typeof blob == 'object' && blob instanceof Blob) {
    blob = URL.createObjectURL(blob)  // 创建blob地址
  }
  var aLink = document.createElement('a')
  aLink.href = blob
  aLink.download = fileName ||
      ''  // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event
  if (window.MouseEvent) event = new MouseEvent('click')
  else {event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  }
  aLink.dispatchEvent(event)
}
