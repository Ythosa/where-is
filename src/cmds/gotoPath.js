const childProcess = require('child_process'),
      { prompt } = require('inquirer')


const DataWorker = require('../data/dataWorker'),
      Printer = require('../libs/printer'),
      config = require('../configs/config')


class GotoPath {
    constructor() {
        this.dataList = config.dataList
    }

    _openFile(printer, dataWorker, id, program) {
        const files = this.dataList.file_list
        let path
        if (id >= 0 && id <= files.length - 1) {
            path = files[id].join('')

            this.dataList = {
                file_list: files,
                file_list_has_updated: false
            }
            dataWorker.setData(this.dataList)

            if (program) {
                printer.printSuccess(`Opening file from path: ${path} with ${program}...`)
                try {
                    childProcess.execSync(`${program} "${path}"`)
                } catch (e) {
                    printer.printError('Such a program does not exist in PATH')
                }
            } else {
                printer.printSuccess(`Opening file from path: ${path}...`)
                childProcess.execSync(`"${path}"`)
            }
        } else {
            printer.printError('Invalid file ID from the file list')
        }
    }

    go(id, program=null) {
        const dataWorker = new DataWorker()
        const printer = new Printer(config.cliColors)

        this.dataList = dataWorker.getData()

        if (this.dataList.file_list_has_updated) {
            this._openFile(printer, dataWorker, id, program)
        } else {
            printer.printWarning(
                'You should update file list',
                'Use <wis find|f> or <wis last|l> command to update list',
                '\n'
            )
            prompt(
                [
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: 'Are you sure you want to do this?'
                    }
                ]
            ).then(({ confirm }) => {
                if (confirm)
                    this._openFile(printer, dataWorker, id, program)
            })
        }
    }
}

module.exports = GotoPath
