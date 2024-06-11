import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import { SemVerVersion } from '@metamask/utils'
import { TappletCandidate } from 'src/types/tapplet'
import { RegisteredTapplet, TappletsRegistry } from 'src/types/tapp-registry'

export function fetchTappletCandidateData(
  tapplet: TappletCandidate,
  integrity: string
): RegisteredTapplet {
  const tappLogoPath = `src/${tapplet.packageName}/assets/logo.svg`
  const registryUrl = `${tapplet.source.location.npm.registry}/${tapplet.packageName}/-/${tapplet.packageName}-${tapplet.version}.tgz`

  const tappletToRegister: RegisteredTapplet = {
    id: tapplet.packageName,
    metadata: {
      displayName: tapplet.displayName,
      author: tapplet.author,
      codeowners: tapplet.repository.codeowners,
      audits: [],
      category: tapplet.category,
      logoPath: core.toPlatformPath(tappLogoPath)
    },
    versions: {
      [tapplet.version as SemVerVersion]: {
        integrity,
        registryUrl
      }
    }
  }
  core.notice(`Tapplet data fetched: ${registryUrl}`)
  return tappletToRegister
}

export function getTappletCandidate(packageName: string): TappletCandidate {
  const jsonDir = core.getInput('dir')

  const manifestPath = path.resolve(
    'src',
    `${packageName}`,
    'tapplet.manifest.json'
  )

  const platformPath = core.toPlatformPath(manifestPath)
  core.notice(`Tapplet manifest dir: ${jsonDir}`)
  core.notice(`Tapplet manifest platformPath: ${platformPath}`)
  const tappData = fs.readFileSync(platformPath, 'utf8')
  return JSON.parse(tappData)
}

export function getTappletRegistry(): TappletsRegistry {
  const manifestPath = path.resolve('tapplets-registry.manifest.json')
  const platformPath = core.toPlatformPath(manifestPath)
  core.notice(`Tapplet registry manifest platformPath: ${platformPath}`)
  const tappData = fs.readFileSync(platformPath, 'utf8')
  return JSON.parse(tappData)
}
