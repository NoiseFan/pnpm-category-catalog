import { writeFileSync } from 'node:fs'
import { cancel, isCancel } from '@clack/prompts'
import { Table } from 'console-table-printer'
import { parseDocument, YAMLMap } from 'yaml'

export const stringifyYamlWithTopLevelBlankLine = (value: string) => {
    const doc = parseDocument(value)

    if (doc.contents && doc.contents instanceof YAMLMap) {
        const items = doc.contents.items

        items.forEach((item: any, index: number) => {
            if (index > 0) {
                item.key.commentBefore = '\n'
            }
        })
    }

    return doc.toString()
}

export const writeFile = (path: string, content: string) => {
    writeFileSync(path, content, 'utf-8')
}

export const printTable = (data: any) => {
    const p = new Table()

    p.addColumns([
        { name: 'Dependencies', alignment: 'left' },
        { name: 'Catalog', alignment: 'left' },
    ])

    p.addRows(data)
    return p.printTable()
}

export const isCancelProcess = (value: unknown, message: string) => {
    if (isCancel(value)) {
        cancel(message)
        return process.exit(0)
    }
}
