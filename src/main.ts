import * as core from '@actions/core'
import {download, getDownloadLink, resolveVersion, verify} from './action'

async function run(): Promise<void> {
  try {
    const version = await resolveVersion()
    const downloadLink = await getDownloadLink(version)

    await download(version, downloadLink)
    await verify()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
