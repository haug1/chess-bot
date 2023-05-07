import { createWriteStream } from 'fs'
import { Parse } from 'unzip-stream'

/**
 * @param {NodeJS.ReadableStream} readStream
 * @param {string} outputPath
 * @param {RegExp} fileRegex
 * @returns {Promise<void>}
 */
export function unzipArchive(readStream, outputPath, fileRegex = /.*/) {
  return new Promise((resolve, reject) => {
    readStream.on('error', reject)
    readStream.pipe(Parse()).on('entry', function (entry) {
      if (fileRegex.test(entry.path)) {
        const writeStream = createWriteStream(outputPath)
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
        entry.pipe(writeStream)
      } else {
        entry.autodrain()
      }
    })
  })
}

export function isWindows() {
  return process.platform === 'win32'
}

export function isLinux() {
  return process.platform === 'linux'
}
