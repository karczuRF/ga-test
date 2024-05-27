import { SemVerVersion } from '@metamask/utils'
import { PathLike, PathOrFileDescriptor } from 'fs'
import { RegisteredTapplet } from 'src/types/tapp-registry'
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
