import { useEffect, useRef } from 'react'
import type {
  JspreadsheetInstanceElement,
  JSpreadsheetOptions,
} from 'jspreadsheet-ce'
import 'jspreadsheet-ce/dist/jspreadsheet.css'
import 'jsuites/dist/jsuites.css'
import styles from './index.module.css'
import { DEFAULT_DATE_FORMAT } from '@/constants'

interface Props {
  clientAbbrs: string[]
  projectAbbrs: string[]
}

export default function BatchSpreadSheet({ clientAbbrs, projectAbbrs }: Props) {
  const ref = useRef(null as unknown as JspreadsheetInstanceElement)
  const spreadSheetLoaded = useRef(false)
  useEffect(() => {
    const options: JSpreadsheetOptions = {
      tableOverflow: true,
      columnResize: false,
      sorting: false as any,
      data: [[]],
      columns: [
        {
          title: 'Date',
          type: 'calendar',
          options: {
            format: DEFAULT_DATE_FORMAT,
            today: true,
          },
        },
        {
          title: 'Client',
          type: 'autocomplete',
          source: clientAbbrs.map(e => ({ id: e, name: e })),
        },
        { title: 'Hour', type: 'numeric', mask: '000' },
        { title: 'Description', type: 'text' },
        { title: 'Billable', type: 'checkbox' },
        { title: 'Ticket No', type: 'text' },
        {
          title: 'Project',
          type: 'autocomplete',
          source: projectAbbrs.map(e => ({ id: e, name: e })),
        },
      ],
      allowManualInsertColumn: false,
      allowManualInsertRow: false,
      minSpareRows: 1,
      allowDeleteColumn: false,
      contextMenu: false as any,
      onbeforepaste: (e, copiedText, col, row) => {
        const pastingCell = e.jspreadsheet.getValueFromCoords(
          Number(col),
          Number(row)
        )
        if (typeof pastingCell === 'boolean') {
          switch (copiedText.toUpperCase()) {
            case 'YES':
              copiedText = 'true'
              break
            case 'NO':
              copiedText = 'false'
              break
            default:
              return false
          }
        }
        return copiedText
      },
      onchange: e => {
        if (!e.jspreadsheet) return
        const data = e.jspreadsheet.getData()
        console.log(data)
      },
    }
    ;(async () => {
      if (!spreadSheetLoaded.current) {
        spreadSheetLoaded.current = true
        const jspreadsheet = (await import('jspreadsheet-ce')).default
        const instance = jspreadsheet(ref.current, options)
        // instance.hideIndex()
      }
    })()
  }, [])

  return (
    <>
      <div>
        <div className={styles.spreadsheet} ref={ref} />
      </div>
    </>
  )
}
