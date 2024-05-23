import * as fs from 'fs'
import { writeFile } from 'fs'
import {
  object,
  record,
  string,
  optional,
  enums,
  refine,
  number,
  Infer
} from 'superstruct'

// For now, validate that each snap is using an NPM id.
const NpmIdStruct = refine(string(), 'Npm ID', value =>
  value.startsWith('npm:')
)

// TODO finish types
export const RegisteredTappletStruct = object({
  id: NpmIdStruct,
  metadata: object({
    packageName: string(),
    displayName: string(),
    authorName: string(),
    authorWebsite: string(),
    aboutSummary: string(),
    aboutDescription: string(),
    imageId: optional(number()),
    category: optional(enums(['test', 'defi', 'gamefi', 'meme']))
    // type: optional(enums(['account'])),
    // website: optional(string()),
    // onboard: optional(boolean()),
    // summary: optional(string()),
    // description: optional(string()),
    // audits: optional(array(AuditStruct)),
    // tags: optional(array(string())),
    // support: optional(SupportStruct),
    // sourceCode: optional(string()),
    // hidden: optional(boolean()),
    // privateCode: optional(boolean()),
    // privacyPolicy: optional(string()),
    // termsOfUse: optional(string()),
    // additionalSourceCode: optional(array(AdditionalSourceCodeStruct)),
    // screenshots: optional(size(array(ImagePathStruct), 3, 3))
  }),
  versions: string()
})

export const TappletRegistryStruct = object({
  manifestVersion: string(),
  registeredTapplets: record(NpmIdStruct, RegisteredTappletStruct)
})

export type RegisteredTapplet = Infer<typeof RegisteredTappletStruct>
export type TappletsRegistry = Infer<typeof TappletRegistryStruct>

export function updateRegistry(): void {
  const tapplet: RegisteredTapplet = {
    id: '1',
    metadata: {
      packageName: 'pkc',
      displayName: 'dis',
      authorName: 'a',
      authorWebsite: 'aa',
      aboutSummary: 'summ',
      aboutDescription: 'descr',
      category: 'meme',
      imageId: 0
    },
    versions: '0.1.0'
  }

  const registryData: TappletsRegistry = {
    manifestVersion: '1.0.0',
    registeredTapplets: {
      tstTapp: tapplet
    }
  }

  const jsonData = JSON.stringify(registryData, null, 2)
  console.log('Update registry json', jsonData)

  return writeFile('tapplets-registry.manifest.json', jsonData, err => {
    if (err) throw err
    console.log('The file has been saved!')
  })
}

export function addTappletToRegistry(manifestVersion: string): void {
  // Read the contents of the JSON file
  const registry: TappletsRegistry = JSON.parse(
    fs.readFileSync('./tapplets-registry.manifest.json', 'utf8')
  )

  const tappletToRegister: RegisteredTapplet = {
    id: '4',
    metadata: {
      packageName: 'dupa',
      displayName: 'dis',
      authorName: 'a',
      authorWebsite: 'aa',
      aboutSummary: 'summ',
      aboutDescription: 'descr',
      category: 'meme',
      imageId: 0
    },
    versions: '3.0.0'
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
  console.log('Tapplet added to the registry json', jsonData)

  return writeFile('tapplets-registry.manifest.json', jsonData, err => {
    if (err) throw err
    console.log('The file has been saved!')
  })
}

// Usage example
// addFieldToJsonFile('data.json', 'newField', 'newValue')
