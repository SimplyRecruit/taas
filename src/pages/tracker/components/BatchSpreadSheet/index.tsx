import { useEffect, useRef } from 'react'
import type {
  JspreadsheetInstanceElement,
  JSpreadsheetOptions,
} from 'jspreadsheet-ce'
import 'jspreadsheet-ce/dist/jspreadsheet.css'
import 'jsuites/dist/jsuites.css'
import styles from './index.module.css'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import { TTBatchCreateBody, TTCreateBody } from 'models'

interface Props {
  clientAbbrs: string[]
  projectAbbrs: string[]
  onChange: (body: TTBatchCreateBody) => void
}

export default function BatchSpreadSheet({
  clientAbbrs,
  projectAbbrs,
  onChange,
}: Props) {
  const ref = useRef(null as unknown as JspreadsheetInstanceElement)
  const spreadSheetLoaded = useRef(false)
  useEffect(() => {
    const options: JSpreadsheetOptions = {
      tableOverflow: true,
      columnResize: false,
      columnSorting: false,
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
        { title: 'Hour', type: 'numeric', mask: '000', width: 20 },
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
        if (data[data.length - 1].every(e => !e)) data.pop()
        const body = TTBatchCreateBody.create({
          bodies: data.map(e =>
            TTCreateBody.create({
              date: new Date(e[0] as string),
              clientAbbr: e[1] as string,
              hour: Number(e[2]),
              description: e[3] as string,
              billable: e[4] as boolean,
              ticketNo: e[5] as string,
              projectAbbr: e[6] as string,
            })
          ),
        })
        onChange(body)
      },
    }
    ;(async () => {
      if (!spreadSheetLoaded.current) {
        spreadSheetLoaded.current = true
        const jspreadsheet = (await import('jspreadsheet-ce')).default
        const instance = jspreadsheet(ref.current, options)
        // Setting index column width
        ref.current
          .querySelector('table>colgroup>col')
          ?.setAttribute('width', '15')
        console.log(ref.current)
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
