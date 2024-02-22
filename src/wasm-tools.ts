import * as core from '@actions/core'
import {WASMTIME_ORG, WASM_TOOLS_REPO} from './github'
import {download, getDownloadLink, resolveVersion, verify} from './action'

async function run(): Promise<void> {
  try {
    const tag = await resolveVersion(WASMTIME_ORG, WASM_TOOLS_REPO)

    // wasm-tools releases have a prefix of wasm-tools
    // therefore remove wasm-tools prefix to get just version
    const version = tag.replace('wasm-tools-', '').replace(/^v/, '')

    let downloadLink
    try {
      downloadLink = await getDownloadLink(
        WASMTIME_ORG,
        WASM_TOOLS_REPO,
        `v${version}`
      )
    } catch (error) {
      // Try legacy tag format
      downloadLink = await getDownloadLink(
        WASMTIME_ORG,
        WASM_TOOLS_REPO,
        `wasm-tools-${version}`
      )
    }

    const binName = 'wasm-tools'
    await download(binName, version, downloadLink)
    await verify(binName)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
