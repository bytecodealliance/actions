import * as core from '@actions/core'
import {WASMTIME_ORG, WASM_TOOLS_REPO} from './github'
import {download, getDownloadLink, resolveVersion, verify} from './action'

async function run(): Promise<void> {
  try {
    const version = await resolveVersion(WASMTIME_ORG, WASM_TOOLS_REPO)
    const downloadLink = await getDownloadLink(
      WASMTIME_ORG,
      WASM_TOOLS_REPO,
      version.startsWith('wasm-tools-') ? version : `wasm-tools-${version}`
    )

    const binName = 'wasm-tools'
    await download(binName, version, downloadLink)
    await verify(binName)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
