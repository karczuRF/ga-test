import * as fs from 'fs'
import { writeFile } from 'fs'
import { RegisteredTapplet, TappletsRegistry } from './types/tapp-registry'
import { SemVerVersion } from '@metamask/utils'
import { TappletCandidate } from './types/tapplet'
import { addAndFormatCodeowners } from './scripts/codeowners/codeowners'
import { fetchTappletCandidateData } from './scripts/tapplets/get-tapplet'

export function addTappletToRegistry(
  manifestVersion: string,
  packageName: string
): void {
  // Read the content of the tapplet manifest to be registered
  const tapplet: TappletCandidate = JSON.parse(
    fs.readFileSync(`src/tapplets/${packageName}/tapplet.manifest.json`, 'utf8')
  )

  // Read the content of the current registry JSON file
  const registry: TappletsRegistry = JSON.parse(
    fs.readFileSync('./tapplets-registry.manifest.json', 'utf8')
  )

  //TODO fill all fileds
  const tappletToRegister = fetchTappletCandidateData(tapplet)

  // Add the new field to the JSON data
  registry.registeredTapplets[tappletToRegister.id] = tappletToRegister

  // increment version
  // const parts = registry.manifestVersion.split('.')
  // const major = parseInt(parts[0])
  // const minor = parseInt(parts[1])
  // let patch = parseInt(parts[2])
  // patch = ++patch // Increment the major version
  // registry.manifestVersion = `${major.toString()}.${minor.toString()}.${patch.toString()}`

  registry.manifestVersion = manifestVersion
  console.log('manifestVersion: ', registry.manifestVersion)

  // // Write the updated JSON data back to the file
  // fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2))
  const jsonData = JSON.stringify(registry, null, 2)
  console.log('Tapplet added to the registry')
  console.log(jsonData)

  addAndFormatCodeowners(tapplet.packageName, tapplet.repository.codeowners)

  return writeFile('tapplets-registry.manifest.json', jsonData, err => {
    if (err) throw err
    console.log('The file has been saved!')
  })
}

// Usage example
// addFieldToJsonFile('data.json', 'newField', 'newValue')
addTappletToRegistry('0.0.1', 'tapplet-example')
