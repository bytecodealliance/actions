import * as core from '@actions/core'
import {WASMTIME_ORG, WIT_BINDGEN_REPO} from './github'
import {download, getDownloadLink, resolveVersion, verify} from './action'

async function run(): Promise<void> {
  try {
    const tag = await resolveVersion(WASMTIME_ORG, WIT_BINDGEN_REPO)

    // wit-bindgen releases have a prefix of wit-bindgen-cli
    // therefore remove wit-bindgen-cli prefix to get just version
    const version = tag.replace('wit-bindgen-cli-', '')

    const downloadLink = await getDownloadLink(
      WASMTIME_ORG,
      WIT_BINDGEN_REPO,
      `wit-bindgen-cli-${version}`
    )

    const binName = 'wit-bindgen'
    await download(binName, `v${version}`, downloadLink)
    await verify(binName)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
