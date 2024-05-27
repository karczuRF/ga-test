import { VersionStruct } from '@metamask/utils'
import {
  object,
  record,
  string,
  optional,
  enums,
  Infer,
  pattern,
  array
} from 'superstruct'

export const AssetsPathStruct = pattern(
  string(),
  /\.\/assets\/.*\/\d+\.(?:png|jpe?g)$/u
)

export const AboutStruct = object({
  summary: string(),
  description: string()
})
export type About = Infer<typeof AboutStruct>

export const DesignStruct = object({
  logoPath: AssetsPathStruct,
  backgroundPath: AssetsPathStruct
})
export type Design = Infer<typeof DesignStruct>

export const RepositoryStruct = object({
  type: string(),
  url: string(),
  codeowners: array(string())
})
export type Repository = Infer<typeof RepositoryStruct>

export const LocationStruct = object({
  packageName: string(),
  registry: string()
})
export const SourceStruct = object({
  location: record(enums(['npm']), LocationStruct)
})

export const TappletCandidateStruct = object({
  packageName: string(),
  displayName: string(),
  version: string(),
  status: optional(enums(['WIP', 'MVP', 'PROD'])),
  about: AboutStruct,
  design: DesignStruct,
  repository: RepositoryStruct,
  source: SourceStruct,
  manifestVersion: VersionStruct
})
export type TappletCandidate = Infer<typeof TappletCandidateStruct>
