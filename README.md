sfdx-profiles-splitter
==

A plugin for splitting and merging Salesforce profiles.

[[https://github.com/lodossDev/sfdx-profiles-splitter/blob/master/images/Screenshot%202018-10-28%20at%2021.47.43.png?raw=true]]

## Setup

### Install from source

1. Install the SDFX CLI.

2. Clone the repository: `git clone git@github.com:lodossDev/sfdx-profiles-splitter.git`

3. (Yarn)Install npm modules: `yarn install`

4. Link the plugin: `sfdx plugins:link .`

### Install as plugin

1. Install plugin: `sfdx plugins:install sfdx-profiles-splitter`

## Usage
<!-- usage -->
```sh-session
$ npm install -g sfdx-profiles-splitter
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-profiles-splitter/0.1.0 darwin-x64 node-v8.9.4
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->

<!-- commands -->
* [`sfdx metadata:profiles:convert`](#sfdx-metadataprofilesconvert)
* [`sfdx metadata:profiles:merge`](#sfdx-metadataprofilesmerge)
* [`sfdx metadata:profiles:split`](#sfdx-metadataprofilessplit)

## `sfdx metadata:profiles:convert`

Converts full profiles into json or xml format.

```
USAGE
  $ sfdx metadata:profiles:convert

OPTIONS
  -d, --delete                                    Delete the profiles once converted?
  -f, --format=format                             (required) the output format i.e. json|xml.

  -i, --input=input                               (required) [default: force-app/main/default/profiles] the input
                                                  directory.

  -o, --output=output                             (required) [default: force-app/main/default/profiles] the output
                                                  directory.

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE

           sfdx metadata:profiles:convert -f json -i force-app/main/default/profiles -o force-app/main/default/test
           //Converts full profiles into json or xml, !!!! does not split !!!!.
```

_See code: [src/commands/metadata/profiles/convert.ts](https://github.com/lodossDev/sfdx-profiles-splitter/blob/v0.1.0/src/commands/metadata/profiles/convert.ts)_

## `sfdx metadata:profiles:merge`

Merge profiles that were split.

```
USAGE
  $ sfdx metadata:profiles:merge

OPTIONS
  -d, --delete                                    Delete the splitted profiles once merged?

  -i, --input=input                               (required) [default: force-app/main/default/profiles] the input
                                                  directory where the splitted profiles exist.

  -o, --output=output                             (required) [default: force-app/main/default/profiles] the output
                                                  directory to store the full profiles.

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE

           sfdx metadata:profiles:merge -i force-app/main/default/profiles -o force-app/main/default/test
           //Merges profiles located in specified input dir and copies them into the output dir.
```

_See code: [src/commands/metadata/profiles/merge.ts](https://github.com/lodossDev/sfdx-profiles-splitter/blob/v0.1.0/src/commands/metadata/profiles/merge.ts)_

## `sfdx metadata:profiles:split`

Split profiles into smaller parts.

```
USAGE
  $ sfdx metadata:profiles:split

OPTIONS
  -d, --delete                                    Delete the existing profiles once converted?

  -i, --input=input                               (required) [default: force-app/main/default/profiles] the input
                                                  directory where the full profiles exist.

  -o, --output=output                             (required) [default: force-app/main/default/profiles] the output
                                                  directory to store the chunked profiles.

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE

           sfdx metadata:profiles:split -i force-app/main/default/profiles -o force-app/main/default/test
           //Splits profiles located in specified input dir and copies them into the output dir.
```

_See code: [src/commands/metadata/profiles/split.ts](https://github.com/lodossDev/sfdx-profiles-splitter/blob/v0.1.0/src/commands/metadata/profiles/split.ts)_
<!-- commandsstop -->
