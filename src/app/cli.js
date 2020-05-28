const FileFinder = require('../libs/findFile'),
      Printer = require('../libs/printer'),
      Checker = require('../libs/checker'),
      gotoPath = require('../libs/gotoPath'),
      config = require('./config')

const configFindFileCommand = (cli) => {
    // wis find|f [options:--strict|-S] <fname> 
    cli.command('find <fname>')  // Command name with props name 
    .description('Search for a file from the current path.')
    .option('-s,--strict', 'Strict finding files.')
    .option('-p, --start-path <path>')
    .alias('f')  // Short name of command
    .action((fname, cmd) => { // Action
        const checker = new Checker()
        const printer = new Printer(config.fileListColors)

        if (checker.validateFileName(fname)) {
            const { strict, startPath } = cmd

            let strict_mode = false
            let path = ''

            if (strict)
                strict_mode = true

            if (startPath)
                if (checker.validatePath(startPath))
                    path = startPath
                else
                    printer.printError('Invalid start path')

            const fileFinder = new FileFinder(startPath)
            
            fileFinder.getSimilarFiles(fname, strict_mode)
        } else {
            printer.printError('Invalid file name')
        }
    })

    return cli
}

const configGotoPathCommand = (cli) => {
    // wis take|t <id>
    cli.command('take <id>')
    .description('Go to file path with this id.')
    .alias('t')
    .action((id) => {
        gotoPath(id)
    })

    return cli
}

const configCLI = (cli) => {
    // wis --version|-V
    // wis --help|-h
    cli.version('1.1.0')
        .description('Files finder from current path.')  // Util name and description

    cli = configFindFileCommand(cli)
    cli = configGotoPathCommand(cli)

    return cli
}

const Run = () => {
    let commander = require('commander')

    commander = configCLI(commander)
    commander.parse(process.argv)  // Take array of string for parsing
}

module.exports = Run