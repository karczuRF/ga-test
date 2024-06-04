import * as core from '@actions/core'
import { addTappletToRegistry } from './registry'
import { getTappChecksum } from './scripts/checksum/hash-calculator'
import {
  downloadFile,
  extractTarball
} from './scripts/checksum/tapplet-installer'
import path from 'path'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const packageName: string = 'tapp-example'
    // const packageName: string = core.getInput('package-name')
    core.notice(`The ${packageName} tapplet registration process started...`)
    const url =
      'https://registry.npmjs.org/tapp-example/-/tapp-example-1.0.1.tgz'

    const downloadPath = path.resolve('src', 'tapplet-candidate')

    console.log('download url', url)
    await downloadFile(url, downloadPath, packageName)
    // Validate checksum
    const sha = await getTappChecksum(downloadPath, packageName)
    await extractTarball(downloadPath, packageName)
    console.log('shasum', sha)
    // Add new tapplet to the registry
    const ver: string = core.getInput('manifest-version')
    addTappletToRegistry(ver, packageName, sha)
    core.info('Registry updated.')

    // Set outputs for other workflow steps to use
    core.setOutput('status', true)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
