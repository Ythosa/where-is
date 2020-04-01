#!/usr/bin/env node  
    // indicates that processing should be carried out NodeJS

// npm link --force   -   add module to cmd
// wis   -   command name
  
const commander = require('commander')
const FileFinder = require('./findfile')
const chalk = require('chalk')

commander.version('1.0.0').description('Files finder from current path.')  // Util name and description
// wis --version|-V
// wis --help|-h

let filefinder = new FileFinder() 

// wis find|f [options:--strict|-S] <fname> 
commander
    .command('find <fname>')  // Command name with props name 
    .description('Search for a file from the current path.')
    .option('-S,--strict', 'Strict finding files.')
    .alias('f')  // Short name of command
    .action((fname, cmd) => { // Action
            let valid_file_name = /[a-zA-Z0-9_.*]+$/
            if (valid_file_name.test(fname)) {
                if (fname.split('*').length > 2) {
                    filefinder.print_blank_line()
                    console.log(chalk.redBright('\nError! Incorrect file name.'))
                    filefinder.print_blank_line()
                    console.log()
                } else {
                    let strict_finding_mode = false
                    if (cmd.strict) {
                        strict_finding_mode = true
                        filefinder.find(fname, strict_finding_mode)
                    } else {
                        filefinder.find(fname.toLowerCase(), strict_finding_mode)
                    }
                } 
            }               
    })

// wis take|t <id>
commander
    .command('take <id>')
    .description('Go to file path with this id.')
    .alias('t')
    .action((id, cmd) => {
        filefinder.goto_path(id)
    })

commander.parse(process.argv)  // take array of string for parsing
