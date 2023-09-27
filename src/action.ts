import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getArch, getPlatform} from './system'
import {Downloader} from './download'
import {Octokit} from '@octokit/rest'

const WASMTIME_ORG = 'bytecodealliance'
const WASMTIME_REPO = 'wasmtime'

export async function resolveVersion(): Promise<string> {
  let version = core.getInput('version')

  if (!version || version === 'latest') {
    version = await getLatestRelease(
      WASMTIME_ORG,
      WASMTIME_REPO,
      getPlatform(),
      getArch()
    )
  }

  return version
}

export async function getLatestRelease(
  owner: string,
  repo: string,
  platform: string,
  arch: string
): Promise<string> {
  const token = core.getInput('github_token')
  const octokit = (() => {
    return token ? new Octokit({auth: token}) : new Octokit()
  })()

  core.info(
    `finding latest release for platform ${platform} and architecture ${arch}`
  )

  const allReleases = await octokit.rest.repos.listReleases({owner, repo})
  const release = allReleases.data.find(
    item =>
      !item.prerelease &&
      item.assets.find(asset => asset.name.includes(`${arch}-${platform}.`))
  )

  if (!release) {
    throw new Error(
      `no releases found for platform ${platform} and architecture ${arch}`
    )
  }

  return release.tag_name
}

export async function getDownloadLink(version: string): Promise<string> {
  const token = core.getInput('github_token')
  const octokit = (() => {
    return token ? new Octokit({auth: token}) : new Octokit()
  })()

  const allReleases = await octokit.rest.repos.listReleases({
    owner: WASMTIME_ORG,
    repo: WASMTIME_REPO
  })

  const platform = getPlatform()
  const arch = getArch()

  const release = allReleases.data.find(item => item.tag_name === version)
  if (!release) {
    throw new Error(
      `failed to find release for version '${version}' for platform '${platform}' and arch '${arch}'`
    )
  }

  const archiveExtension = getPlatform() === 'windows' ? '.zip' : '.tar.xz'
  const asset = release.assets.find(item =>
    item.name.includes(`${arch}-${platform}${archiveExtension}`)
  )

  if (!asset) {
    throw new Error(
      `failed to find asset for version '${version}' for platform '${platform}' and arch '${arch}'`
    )
  }

  return asset.browser_download_url
}

export async function download(version: string, link: string): Promise<void> {
  const binaryExtension = getPlatform() === 'windows' ? '.exe' : ''
  const downloader = new Downloader(
    `wasmtime${binaryExtension}`,
    link,
    `wasmtime-${version}-x86_64-${getPlatform()}/wasmtime${binaryExtension}`
  )

  await downloader.download()
}

export async function verify(): Promise<void> {
  const result = await exec.getExecOutput('wasmtime', ['--version'])
  if (result.exitCode !== 0) {
    throw new Error(
      `failed while verifying wasmtime version.\n[stdout: ${result.stdout}] [stderr: ${result.stderr}]`
    )
  }

  core.info(result.stdout)
  core.exportVariable('WASMTIME_VERSION', result.stdout)
}
