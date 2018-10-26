/* tslint:disable */
import {core, flags, SfdxCommand} from '@salesforce/command';
import chalk from 'chalk';
import config = require('../../../shared/config.json');
import fs = require('fs-extra');
import path = require('path');
import convert = require('xml-js'); 

export default class Convert extends SfdxCommand {
    public static description = 'Converts full profiles into json or xml format.';

    public static examples = [`
        sfdx metadata:profiles:convert -f json -i force-app/main/default/profiles -o force-app/main/default/test
        //Converts full profiles into json or xml, !!!! does not split !!!!.
    `];   

    protected static flagsConfig = {
        format: flags.string({char: 'f', required: true, description: 'the output format i.e. json|xml.'}),
        input: flags.string({char: 'i', default: 'force-app/main/default/profiles', required: true, description: 'the input directory.'}),
        output: flags.string({char: 'o', default: 'force-app/main/default/profiles', required: true, description: 'the output directory.'}),
        delete: flags.boolean({char: 'd', default: false, description: 'Delete the profiles once converted?'}) 
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    public async convert(format: string, inputDir: string, outputDir: string, deleteProfile: boolean): Promise<any> {
        try {
            const target = (format === 'xml' ? '.json' : '.profile');
            const output = (format === 'xml' ? '.profile' : '.json');
            const root = path.resolve(inputDir);

            const fileNames = (await fs.readdir(root)).filter(file => {
                return file.includes(target);
            });

            this.ux.log(chalk.bold(chalk.black(('Found ' + fileNames.length + ' matching profiles'))));

            if (fileNames.length > 0) {
                const location = path.resolve(outputDir);
                await fs.ensureDir(location);

                for (const fileName of fileNames) {
                    this.ux.log(chalk.bold(chalk.black(('Converting profile: ' + fileName))));

                    const file = await fs.readFile(root + '/' + fileName);
                    const newPath = location + '/' + fileName.replace(target, output);

                    if (format === 'xml') {
                        const stream = convert.js2xml(JSON.parse(file.toString()), config.xmlExport);
                        await fs.writeFile(newPath, stream);
                    } else {
                        const stream = convert.xml2js(file.toString(), config.jsonExport);
                        await fs.writeFile(newPath, JSON.stringify(stream));
                    }

                    if (deleteProfile === true) {
                        await fs.remove(root + '/' + fileName);
                    }
                }
            }
        } catch(ex) { 
            this.ux.error(chalk.bold(chalk.red(ex)));
            return 1;
        }

        return 0;
    }

    public async run(): Promise<core.AnyJson> {
        const format = this.flags.format;
        const inputDir = this.flags.input;
        const outputDir = this.flags.output;
        const deleteProfile = this.flags.delete;

        await this.convert(format, inputDir, outputDir, deleteProfile);

        // Return an object to be displayed with --json
        return {};
    }
}
