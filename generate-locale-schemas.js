/* eslint-disable @typescript-eslint/no-var-requires */
console.log(process.argv)
const { 2: namespace } = process.argv
if (!namespace)
  throw 'Command usage: npm run generate-locale-schemas -- <namespace>'
const jsonSchemaGenerator = require('json-schema-generator')
const fs = require('fs')
const path = require('path')
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
fs.readdirSync(path.join(__dirname, './public/locales'), {
  withFileTypes: true,
}).forEach(f => {
  if (f.name !== 'schemas') {
    const langFile = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, `./public/locales/${f.name}/${namespace}.json`),
        {
          encoding: 'utf-8',
        }
      )
    )
    langFile['$schema'] = `../schemas/${namespace}.json`
    fs.writeFileSync(
      path.join(__dirname, `./public/locales/${f.name}/${namespace}.json`),
      JSON.stringify(langFile, null, 4),
      { encoding: 'utf-8', flag: 'w' }
    )
  }
})
