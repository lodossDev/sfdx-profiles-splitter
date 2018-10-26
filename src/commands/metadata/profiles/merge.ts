/* tslint:disable */
import {core, flags, SfdxCommand} from '@salesforce/command';
import * as _ from 'lodash';
import fs = require('fs-extra');
import convert = require('xml-js');
import path = require('path');
import config = require('../../../shared/config.json');
import chalk from 'chalk';

function createModel() {
    const data = {
        _declaration: {
            _attributes: {
                version: '1.0',
                encoding: 'UTF-8'
            }
        },
        Profile: {
            _attributes: {
                xmlns: 'http://soap.sforce.com/2006/04/metadata'
            }
        }
    };

    return data;
}

async function getDirs(location) {
    let dirs = [];

    for (const file of await fs.readdir(location)) {
        if ((await fs.stat(path.join(location, file))).isDirectory()) {
            dirs = [...dirs, path.join(location, file)];
        }
    }

    return dirs;
}

export default class Merge extends SfdxCommand {
    public static description = 'Merge profiles that were split.';

    public static examples = [`
        sfdx metadata:profiles:merge -i force-app/main/default/profiles -o force-app/main/default/test
        //Merges profiles located in specified input dir and copies them into the output dir.
    `];

    protected static flagsConfig = {
        input: flags.string({char: 'i', default: 'force-app/main/default/profiles', required: true, description: 'the input directory where the splitted profiles exist.'}),
        output: flags.string({char: 'o', default: 'force-app/main/default/profiles', required: true, description: 'the output directory to store the full profiles.'}),
        delete: flags.boolean({char: 'd', default: false, description: 'Delete the splitted profiles once merged?'}) 
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    public async merge(inputDir: string, outputDir: string, deleteProfile: boolean): Promise<any> {
        try {
            const root = path.resolve(inputDir);

            const location = path.resolve(outputDir);
            await fs.ensureDir(location);

            const rootDirs = await getDirs(root);

            for (const rootDir of rootDirs) {
                this.ux.log(chalk.bold(chalk.black(('Merging profile: ' + path.basename(rootDir)))));
                
                const model = createModel();
                const metaDirs = await getDirs(rootDir);

                for (const metaDir of metaDirs) {
                    const metadataType = path.basename(metaDir);
                    model.Profile[metadataType] = [];

                    const fileNames = await fs.readdir(metaDir);

                    for (const fileName of fileNames) {
                        const filePath = metaDir + '/' + fileName;

                        const file = await fs.readFile(filePath);
                        const stream = convert.xml2js(file.toString(), config.jsonExport);

                        // Is this needed here??
                        if (stream['Profile'][metadataType] === undefined) {
                            continue;
                        }

                        model.Profile[metadataType] = [...model.Profile[metadataType], stream['Profile'][metadataType]];
                    }

                    model.Profile[metadataType] = _.flatten(model.Profile[metadataType]);
                }

                await fs.writeFile( 
                    location + '/' + path.basename(rootDir) + '.profile',
                    convert.json2xml(JSON.stringify(model), config.xmlExport)
                );

                if (deleteProfile === true) {
                    await fs.remove(rootDir);
                }
            }
        } catch(ex) {
            this.ux.error(chalk.bold(chalk.red(ex)));
            return 1;
        }

        return 0;
    }

    public async run(): Promise<core.AnyJson> {
        const inputDir = this.flags.input;
        const outputDir = this.flags.output;
        const deleteProfile = this.flags.delete;
        
        await this.merge(inputDir, outputDir, deleteProfile);

        // Return an object to be displayed with --json
        return {};
    }
}