import { VersionStruct } from '@metamask/utils'
import {
  object,
  record,
  string,
  optional,
  enums,
  Infer,
  pattern
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
  url: string()
})
export type Repository = Infer<typeof RepositoryStruct>

export const LocationStruct = object({
  packageName: string(),
  registry: string()
})
export const SourceStruct = object({
  location: record(string(), LocationStruct)
})

export const RegisteredTappletStruct = object({
  packageName: string(),
  versions: string(),
  status: optional(enums(['WIP', 'MVP', 'PROD'])),
  about: AboutStruct,
  design: DesignStruct,
  repository: RepositoryStruct,
  source: SourceStruct,
  manifestVersion: VersionStruct
})
export type RegisteredTapplet = Infer<typeof RegisteredTappletStruct>
