import * as fs from 'fs'
import { writeFile } from 'fs'
import { RegisteredTapplet, TappletsRegistry } from './types/tapp-registry'
import { SemVerVersion, assertIsSemVerVersion } from '@metamask/utils'
import { TappletCandidate } from './types/tapplet'
import { addAndFormatCodeowners } from './scripts/codeowners/codeowners'
import {
  fetchTappletCandidateData,
  getTappletCandidate,
  getTappletRegistry
} from './scripts/tapplets/get-tapplet'

export function updateRegisteredTapplet(
  registry: TappletsRegistry,
  tappletToRegister: RegisteredTapplet,
  tappletVersion: string
): void {
  // Add the new field to the JSON data
  if (registry.registeredTapplets[tappletToRegister.id] == undefined) {
    console.log('dupa doesnt exist')
    registry.registeredTapplets[tappletToRegister.id] = tappletToRegister
  } else {
    console.log('dupa exists')

    // TODO check if version is ok
    assertIsSemVerVersion(tappletVersion)

    registry.registeredTapplets[tappletToRegister.id].metadata =
      tappletToRegister.metadata

    registry.registeredTapplets[tappletToRegister.id].versions[
      tappletVersion as SemVerVersion
    ] = tappletToRegister.versions[tappletVersion as SemVerVersion]
  }
}

export function addTappletToRegistry(
  manifestVersion: string,
  packageName: string
): void {
  // Read the content of the tapplet manifest to be registered
  const tapplet: TappletCandidate = getTappletCandidate(packageName)

  // Read the content of the current registry JSON file
  const registry: TappletsRegistry = getTappletRegistry()

  //TODO fill all fileds
  const tappletToRegister: RegisteredTapplet =
    fetchTappletCandidateData(tapplet)

  // Add the new field to the JSON data
  updateRegisteredTapplet(registry, tappletToRegister, tapplet.version)

  // increment version
  // const parts = registry.manifestVersion.split('.')
  // const major = parseInt(parts[0])
  // const minor = parseInt(parts[1])
  // let patch = parseInt(parts[2])
  // patch = ++patch // Increment the major version
  // registry.manifestVersion = `${major.toString()}.${minor.toString()}.${patch.toString()}`

  registry.manifestVersion = manifestVersion
  console.log('manifestVersion: ', registry.manifestVersion)

  const jsonData = JSON.stringify(registry, null, 2)

  addAndFormatCodeowners(tapplet.packageName, tapplet.repository.codeowners)

  return writeFile('tapplets-registry.manifest.json', jsonData, err => {
    if (err) throw err
    console.log('The file has been saved!')
  })
}

// Usage example
// addFieldToJsonFile('data.json', 'newField', 'newValue')
addTappletToRegistry('0.0.1', 'tapplet-example')
