import fs from 'fs'
import path from 'path'
import axios, { AxiosError, AxiosResponse } from 'axios'
import * as zlib from 'zlib'
import * as tar from 'tar'

interface DownloadError {
  type: 'request' | 'io'
  message: string
}

interface FailedToDownload extends DownloadError {
  url: string
}

export async function downloadFile(
  url: string,
  tappletPath: string,
  tappletName: string
): Promise<void> {
  console.log('Downloading in progress...! Url:', url)
  const client = axios.create()
  const filePath = path.join(tappletPath, `${tappletName}.tar.gz`)
  try {
    const response: AxiosResponse = await client.get(url, {
      responseType: 'arraybuffer' // Set responseType to 'arraybuffer' to download as a binary file
    })

    if (response.status >= 200 && response.status < 300) {
      await fs.promises.mkdir(tappletPath, { recursive: true })
      await fs.promises.writeFile(filePath, response.data, 'binary')
      console.log(`Downloaded tarball successfully: ${filePath}`)
    } else {
      const err: FailedToDownload = {
        type: 'request',
        message: 'Failed to download the tarball',
        url
      }
      console.error(err)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const err: FailedToDownload = {
        type: 'request',
        message: 'Failed to download the file',
        url
      }
      console.error(err)
    } else {
      const err: DownloadError = {
        type: 'request',
        message: 'Failed to download the file'
      }
      console.error(err)
    }
  }
}

export async function extractTarball(tappletPath: string, tappletName: string) {
  try {
    const filePath = path.join(tappletPath, `${tappletName}.tar.gz`)

    const outputDir = await fs.promises.mkdir(
      path.join(tappletPath, tappletName),
      {
        recursive: true
      }
    )
    console.log('Tarball')
    const gunzip = zlib.createGunzip({})
    const extract = tar.extract({
      C: outputDir,
      strip: 1 // strip one level of directory hierarchy from archive
    })

    console.log('Tarball')
    const tarballReadStream = fs.createReadStream(filePath)
    console.log('Tarball')

    tarballReadStream
      .pipe(gunzip)
      .on('error', err => {
        console.error('Error gunzipping tarball:', err)
        gunzip.destroy()
        tarballReadStream.destroy()
      })
      .pipe(extract)
      .on('error', err => {
        console.error('Error extracting tarball:', err)
        gunzip.destroy()
        tarballReadStream.destroy()
      })
      .on('finish', () => {
        console.log('Tarball extracted successfully')
      })
  } catch (err) {
    console.error(`Error extracting tarball: ${err}`)
  }
}
