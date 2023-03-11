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
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

interface Props {
  ssData: any[][]
  clientAbbrs: string[]
  projectAbbrs: string[]
  onChange: (body: TTBatchCreateBody, error: boolean) => void
}

const propToIndexMap: { [key: string]: number } = {
  date: 0,
  clientAbbr: 1,
  hour: 2,
  description: 3,
  billable: 4,
  ticketNo: 5,
  projectAbbr: 6,
}

function convertBillableCell(yesNoString: string) {
  switch (yesNoString.toUpperCase()) {
    case 'YES':
      return 'true'
    case 'NO':
      return 'false'
    default:
      return 'false'
  }
}

export default function BatchSpreadSheet({
  ssData,
  clientAbbrs,
  projectAbbrs,
  onChange,
}: Props) {
  const ref = useRef(null as unknown as JspreadsheetInstanceElement)
  const spreadSheetLoaded = useRef(false)

  async function onSsDataChange() {
    if (!ref.current.jspreadsheet) return
    const data = ref.current.jspreadsheet.getData()
    for (let r = data.length - 1; r > 0; r--) {
      if (data[r].every(e => !e)) data.pop()
      else break
    }
    if (data[data.length - 1].every(e => !e)) data.pop()
    // Constructing the batch create body and validating
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
    const bodyToValidate = plainToClass(
      TTBatchCreateBody,
      JSON.parse(JSON.stringify(body))
    )
    const validationErrors = await validate(bodyToValidate)
    // Clearing invalid-cell class from all cells
    for (const row in ssData) {
      for (const col in ssData[row]) {
        ref.current.jspreadsheet
          .getCell([col, row] as unknown as [number, number])
          .classList.remove('invalid-cell')
      }
    }
    // Adding invalid-cell class to invalid cells
    let error = false
    if (validationErrors.length) {
      error = true
      const invalidRows = validationErrors[0].children!
      const invalidCells: [number, number][] = []
      for (const row of invalidRows) {
        for (const col of row.children!) {
          invalidCells.push([
            propToIndexMap[col.property],
            Number.parseInt(row.property),
          ])
        }
      }
      for (const cell of invalidCells) {
        ref.current.jspreadsheet.getCell(cell).classList.add('invalid-cell')
      }
    }
    // Emitting the body
    onChange(body, error)
  }

  useEffect(() => {
    if (spreadSheetLoaded.current && ref.current.jspreadsheet) {
      ref.current.jspreadsheet.setData(ssData)
      onSsDataChange()
    }
  }, [ssData])

  useEffect(() => {
    const columns: jspreadsheet.Column[] = [
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
    ]
    const options: JSpreadsheetOptions = {
      rowDrag: false,
      tableOverflow: true,
      columnResize: false,
      columnSorting: false,
      allowInsertColumn: false,
      data: ssData,
      columns,
      allowManualInsertColumn: false,
      allowManualInsertRow: false,
      minSpareRows: 1,
      allowDeleteColumn: false,
      contextMenu: false as any,
      onbeforepaste: (e, copiedText, col) => {
        if (copiedText[0] === '\t') copiedText = copiedText.substring(1)
        if (copiedText[copiedText.length - 1] === '\t')
          copiedText = copiedText.substring(0, copiedText.length - 1)
        const billableColIndex = 4 - Number(col)
        console.log(billableColIndex)
        console.log(copiedText.split('\r\n')[0].length)
        console.log(copiedText.split('\r\n')[0].split('\t'))
        if (
          billableColIndex < 0 ||
          billableColIndex >= copiedText.split('\r\n')[0].split('\t').length
        )
          return copiedText
        const pastedRows = copiedText.split('\r\n').map(r => {
          const split = r.split('\t')
          console.log({ split })
          split[billableColIndex] = convertBillableCell(split[billableColIndex])
          return split.join('\t')
        })
        return pastedRows.join('\n')
      },
      onchange: onSsDataChange,
      ondeleterow: onSsDataChange,
    }
    ;(async () => {
      if (!spreadSheetLoaded.current) {
        spreadSheetLoaded.current = true
        const jspreadsheet = (await import('jspreadsheet-ce')).default
        jspreadsheet(ref.current, options)
        ref.current
          .querySelector('table>colgroup>col')
          ?.setAttribute('width', '15')
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
