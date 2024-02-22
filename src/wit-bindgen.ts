import * as core from '@actions/core'
import {WASMTIME_ORG, WIT_BINDGEN_REPO} from './github'
import {download, getDownloadLink, resolveVersion, verify} from './action'

async function run(): Promise<void> {
  try {
    const tag = await resolveVersion(WASMTIME_ORG, WIT_BINDGEN_REPO)

    // wit-bindgen releases have a prefix of wit-bindgen-cli
    // therefore remove wit-bindgen-cli prefix to get just version
    const version = tag.replace('wit-bindgen-cli-', '').replace(/^v/, '')
    let binVersion = version

    let downloadLink
    try {
      downloadLink = await getDownloadLink(
        WASMTIME_ORG,
        WIT_BINDGEN_REPO,
        `v${version}`
      )
    } catch (error) {
      // Try legacy tag format
      downloadLink = await getDownloadLink(
        WASMTIME_ORG,
        WIT_BINDGEN_REPO,
        `wit-bindgen-cli-${version}`
      )
      binVersion = `v${version}`
    }

    const binName = 'wit-bindgen'
    await download(binName, binVersion, downloadLink)
    await verify(binName)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
