import * as core from '@actions/core'
import {WASMTIME_ORG, WASMTIME_REPO} from './github'
import {download, getDownloadLink, resolveVersion, verify} from './action'

async function run(): Promise<void> {
  try {
    const tag = await resolveVersion(WASMTIME_ORG, WASMTIME_REPO)
    const version = `v${tag.replace(/^v/, '')}`
    const downloadLink = await getDownloadLink(
      WASMTIME_ORG,
      WASMTIME_REPO,
      version
    )

    const binName = 'wasmtime'
    await download(binName, version, downloadLink)
    await verify(binName)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
