/* eslint-disable @typescript-eslint/no-var-requires */
const jsonSchemaGenerator = require('json-schema-generator')
const fs = require('fs')
const path = require('path')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

const foldersOfLocales = fs.readdirSync(
  path.join(__dirname, './public/locales'),
  {
    withFileTypes: true,
  }
)
function generateSchemas() {
  readline.question('\nPlease enter namespace:\n', namespace => {
    readline.close()
    const json = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, `./public/locales/en/${namespace}.json`),
        {
          encoding: 'utf-8',
        }
      )
    )
    const schemaObj = jsonSchemaGenerator(json)
    schemaObj['additionalProperties'] = false
    fs.writeFileSync(
      path.join(__dirname, `./public/locales/schemas/${namespace}.json`),
      JSON.stringify(schemaObj, null, 4),
      { encoding: 'utf-8', flag: 'w' }
    )
    foldersOfLocales.forEach(f => {
      if (f.name !== 'schemas') {
        const langFileObject = JSON.parse(
          fs.readFileSync(
            path.join(
              __dirname,
              `./public/locales/${f.name}/${namespace}.json`
            ),
            {
              encoding: 'utf-8',
            }
          )
        )
        langFileObject['$schema'] = `../schemas/${namespace}.json`
        fs.writeFileSync(
          path.join(__dirname, `./public/locales/${f.name}/${namespace}.json`),
          JSON.stringify(langFileObject, null, 4),
          { encoding: 'utf-8', flag: 'w' }
        )
      }
    })
    console.info('\nDone')
  })
}

function createNamespace() {
  readline.question('\nPlease enter a name for the namespace:\n', namespace => {
    readline.close()
    const schemaObj = jsonSchemaGenerator({})
    schemaObj['additionalProperties'] = false
    fs.writeFileSync(
      path.join(__dirname, `./public/locales/schemas/${namespace}.json`),
      JSON.stringify(schemaObj, null, 4),
      { encoding: 'utf-8', flag: 'w' }
    )
    foldersOfLocales.forEach(f => {
      if (f.name !== 'schemas') {
        const langFileObject = { $schema: `../schemas/${namespace}.json` }
        fs.writeFileSync(
          path.join(__dirname, `./public/locales/${f.name}/${namespace}.json`),
          JSON.stringify(langFileObject, null, 4),
          { encoding: 'utf-8', flag: 'w' }
        )
      }
    })
    console.info('\nDone')
  })
}

module.exports = { generateSchemas, createNamespace }
