import * as fs from 'fs'
import { writeFile } from 'fs'
import { RegisteredTapplet, TappletsRegistry } from './types/tapp-registry'
import { SemVerVersion } from '@metamask/utils'
import { TappletCandidate } from './types/tapplet'

export function addTappletToRegistry(manifestVersion: string): void {
  // Read the content of the tapplet manifest to be registered
  const tapplet: TappletCandidate = JSON.parse(
    fs.readFileSync('src/tapplets/tapplet.manifest.json', 'utf8')
  )

  // Read the content of the current registry JSON file
  const registry: TappletsRegistry = JSON.parse(
    fs.readFileSync('./tapplets-registry.manifest.json', 'utf8')
  )

  //TODO fill all fileds
  const tappletToRegister: RegisteredTapplet = {
    id: tapplet.packageName,
    metadata: {
      packageName: tapplet.packageName, //TODO do we need this if its the same as ID?
      displayName: tapplet.displayName,
      author: {
        name: 'Author Name',
        website: ''
      },
      audits: [
        {
          auditor: 'Auditor Name',
          report: 'report url'
        }
      ],
      category: 'test',
      logoPath: `src/tapplets/${tapplet.packageName}/assets/logo.svg`
    },
    versions: {
      [tapplet.version as SemVerVersion]: {
        //TODO calculate/check integrity
        integrity: 'sha512-test123test123test123==',
        registryUrl: `${tapplet.source.location.npm.registry}/${tapplet.packageName}/-/${tapplet.packageName}-${tapplet.version}.tgz`
      }
    }
  }

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

  return writeFile('tapplets-registry.manifest.json', jsonData, err => {
    if (err) throw err
    console.log('The file has been saved!')
  })
}

// Usage example
// addFieldToJsonFile('data.json', 'newField', 'newValue')
addTappletToRegistry('0.0.1')
