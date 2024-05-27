import * as core from '@actions/core'
import * as fs from 'fs'
import { SemVerVersion } from '@metamask/utils'
import { RegisteredTapplet, TappletsRegistry } from 'src/types/tapp-registry'
import { TappletCandidate } from 'src/types/tapplet'

export function fetchTappletCandidateData(
  tapplet: TappletCandidate
): RegisteredTapplet {
  const tappletToRegister: RegisteredTapplet = {
    id: tapplet.packageName,
    metadata: {
      packageName: tapplet.packageName, //TODO do we need this if its the same as ID?
      displayName: tapplet.displayName,
      author: {
        name: 'Author Name',
        website: '',
        codeowners: tapplet.repository.codeowners
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

  return tappletToRegister
}

export function getTappletCandidate(packageName: string): TappletCandidate {
  const path = `src/registered-tapplets/${packageName}/tapplet.manifest.json`
  return JSON.parse(fs.readFileSync(core.toPlatformPath(path), 'utf8'))
}

export function getTappletRegistry(): TappletsRegistry {
  const path = './tapplets-registry.manifest.json'
  return JSON.parse(fs.readFileSync(core.toPlatformPath(path), 'utf8'))
}
