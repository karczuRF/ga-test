import * as fs from 'fs'
import { writeFile } from 'fs'
import { RegisteredTapplet, TappletsRegistry } from './types/tapp-registry'
import { SemVerVersion } from '@metamask/utils'

export function addTappletToRegistry(manifestVersion: string): void {
  // Read the contents of the JSON file
  const registry: TappletsRegistry = JSON.parse(
    fs.readFileSync('./tapplets-registry.manifest.json', 'utf8')
  )

  const tappletToRegister: RegisteredTapplet = {
    id: '@MCozhusheck/tapplet-example',
    metadata: {
      packageName: 'tapp-example',
      displayName: 'Example tapplet to test the registry',
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
      logoPath: 'src/tapplets/@MCozhusheck/tapplet-example/assets/logo.svg'
    },
    versions: {
      ['0.0.2' as SemVerVersion]: {
        integrity:
          'sha512-ivQM1oWaCaZrHARDCD2rib/RFmNDdSDuCQofOsEc3HLo/zgGjLXiySwm/uu3s/5lt9S+/oPC6wFE3m5agzdizA==',
        registryUrl:
          'https://registry.npmjs.org/tapplet-example/-/tapplet-example-0.0.2.tgz'
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
