import axios from 'axios'
import { existsSync, mkdirSync } from 'fs'
import { unzipArchive, isWindows } from '../src/utils.js'

// Downloads and extracts the latest version of the Stockfish binary

// Breaks if any of the following things change:
// - the official Stockfish github repo is github.com/official-stockfish/Stockfish
// - the latest GitHub release is named "Stockfish X.X" (decimals are optional) where X.X is a version currently available for download
// - download must be available at https://stockfishchess.org/files/stockfish_{version}_{platform}_x64.zip where platform can be either "win" or "linux"
// - download must be a zip archive where only one file in the archive (the binary file) matches the pattern /.*\/stockfish.*/, i.e. stockfish_15.1_win_x64/stockfish-windows-2022-x86-64.exe

const stockfishDownloadBaseUrl = 'https://stockfishchess.org/files/'
const stockfishZipFilename = (version, platform) =>
  `stockfish_${version}_${platform}_x64.zip`

async function downloadStockfish(filename) {
  console.debug('downloading stockfish..')
  const url = stockfishDownloadBaseUrl + filename
  const { data } = await axios.get(url, {
    responseType: 'stream',
    headers: {
      'accept-encoding': 'gzip,deflate',
    },
    onDownloadProgress: function (progress) {
      if (progress.estimated) {
        const downloadRateMbps = progress.rate / 1000000 + 'mb/s'
        const etaMins =
          progress.estimated > 60
            ? (progress.estimated / 60).toFixed(1) + ' mins'
            : progress.estimated + ' seconds'
        const currentMbDownloaded =
          (progress.loaded / 1000000).toFixed(2) + 'mb'
        const totalMbToDownload = (progress.total / 1000000).toFixed(2) + 'mb'
        console.debug(
          url,
          currentMbDownloaded +
            '/' +
            totalMbToDownload +
            ' @ ' +
            downloadRateMbps +
            '\n',
          'ETA: ' + etaMins + '\n'
        )
      }
    },
  })
  return data
}

async function getLatestVersion() {
  const releasesResponse = await axios.get(
    'https://api.github.com/repos/official-stockfish/Stockfish/releases'
  )
  return releasesResponse.data[0].name.split(' ')[1]
}

export async function downloadStockfishForPlatform() {
  const platform = isWindows()
    ? 'win'
    : process.platform === 'linux'
    ? 'linux'
    : undefined
  if (!['win', 'linux'].includes(platform))
    throw new Error(
      `The specified platform ${platform} is not supported. (win/linux only)`
    )
  const version = await getLatestVersion()
  const filename = stockfishZipFilename(version, platform)
  const suffix = `-${version}-${platform}`
  const outFilepath = 'bin/stockfish' + suffix + (isWindows() ? '.exe' : '')
  if (existsSync(outFilepath)) {
    console.debug(
      'Cancelled download of ' + filename + " because it's already installed."
    )
    return outFilepath
  }
  if (!existsSync('bin')) mkdirSync('bin')
  await unzipArchive(
    await downloadStockfish(filename),
    outFilepath,
    /.*\/stockfish.*/
  )
  return outFilepath
}
