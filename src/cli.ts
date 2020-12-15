#!/usr/bin/env node

import escapeStringRegexp from 'escape-string-regexp';
import { createReadStream } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';
import yargs from 'yargs';

const args = yargs.options({
  'changelog-path': { type: 'string', demandOption: true, alias: 'c' },
  prefix: { type: 'string', demandOption: false, alias: 'p' },
}).argv;

const changelogPath = args['changelog-path'];
const prefix = args.prefix || '';
const filePath = join(process.cwd(), changelogPath);

async function processLineByLine() {
  const readLine = createInterface({
    input: createReadStream(filePath),
  });

  for await (let line of readLine) {
    line = escapeStringRegexp(line);
    console.log(`Line from file: ${line}`);
    const match = '[v0.1.1]'.match(`\[(v[0-9]{+}\.[0-9]{+}\.[0-9]{+})\]`);
    console.log('match =>', match);
    if (match?.length) {
      console.log(match.groups);
      return;
    }
  }
}

// processLineByLine();
const reg = new RegExp('\[(\\b' + prefix + '\\b[0-9]{+}.[0-9]{+}.[0-9]{+})\]');
reg.test('[v0.1.1]');
//.match(/\[(v[0-9]{+}\.[0-9]{+}\.[0-9]{+})\]/);
