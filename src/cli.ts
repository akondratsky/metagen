import { program } from 'commander';
import { MetaGenerator } from './MetaGenerator';
import fs from 'node:fs';

if (parseInt(process.version.slice(1), 10) < 18) {
  console.error('NodeJS 18+ is required to run Metagen');
  process.exit(1);
}


const tryRun = <T extends (...args: any) => any>(msg: string, fn: T): ReturnType<T> => {
  try {
    return fn();
  } catch (e) {
    console.error(msg);
    process.exit(1);
  }
};


program
  .name('metagen')

  .description(
    'Generates files and folders with Metagen template engine\n' +
    'https://github.com/akondratsky/metagen'
  )
  .usage('-t <template-directory> -p <payload-json-file> -o <output-directory>')

  .requiredOption('-t, --template <directory>', 'meta template folder')

  .requiredOption('-o, --output <directory>', 'output folder')

  .requiredOption('-p, --payload <json file>', 'payload (context) to render templates in JSON format')

  .option('-d, --dry-run', 'dry run mode')
  .option('-v, --verbose', 'enable debugging mode (detailed output)')

  .allowUnknownOption(false)
  .allowExcessArguments(false)
  .showHelpAfterError()

  .action(({ template, output, payload, dryRun, verbose }) => {
    const payloadContent = tryRun(`Error while reading the file "${payload}". Check if it exists`,
      () => fs.readFileSync(payload, 'utf-8')
    );
    const payloadObject = tryRun(`Error while parsing the JSON file "${payload}"`,
      () => JSON.parse(payloadContent)
    );
    new MetaGenerator(template).generate({
      destination: output,
      payload: payloadObject,
      isDryRun: dryRun,
      isVerbose: verbose,
    });
  });

program.parse();
