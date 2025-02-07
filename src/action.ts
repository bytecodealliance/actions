import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getArch, getPlatform} from './system'
import {Downloader} from './download'
import {Octokit} from '@octokit/rest'

const ASSET_ARCHIVE_PATTERN = `${getArch()}-${getPlatform()}`

export async function resolveVersion(
  owner: string,
  repo: string
): Promise<string> {
  let version = core.getInput('version')

  if (!version || version === 'latest') {
    version = await getLatestRelease(owner, repo)
  }

  return version
}

export async function getLatestRelease(
  owner: string,
  repo: string
): Promise<string> {
  const token = core.getInput('github_token')
  const octokit = (() => {
    return token ? new Octokit({auth: token}) : new Octokit()
  })()

  const platform = getPlatform()
  const arch = getArch()

  core.info(
    `finding latest release for platform ${platform} and architecture ${arch}`
  )

  const release = await octokit.rest.repos.getLatestRelease({owner, repo});

  if (!release) {
    throw new Error(
      `no releases found for platform ${platform} and architecture ${arch}`
    )
  }

  return release.data.tag_name
}

export async function getDownloadLink(
  owner: string,
  repo: string,
  tag_name: string
): Promise<string> {
  const token = core.getInput('github_token')
  const octokit = (() => {
    return token ? new Octokit({auth: token}) : new Octokit()
  })()

  const platform = getPlatform()
  const arch = getArch()

  const release = await octokit.rest.repos.getReleaseByTag({owner, repo, tag: tag_name})
  if (!release) {
    throw new Error(
      `failed to find release for tag '${tag_name}' for platform '${platform}' and arch '${arch}'`
    )
  }

  // the archive extension could be .tar.gz (for wasm-tools) or .tar.xz (for wasmtime)
  const archiveExtension = getPlatform() === 'windows' ? '.zip' : '.tar.'
  const asset = release.data.assets.find(item =>
    item.name.includes(`${ASSET_ARCHIVE_PATTERN}${archiveExtension}`)
  )

  if (!asset) {
    throw new Error(
      `failed to find asset for tag '${tag_name}' for platform '${platform}' and arch '${arch}'`
    )
  }

  return asset.browser_download_url
}

export async function download(
  name: string,
  version: string,
  link: string
): Promise<void> {
  const binaryExtension = getPlatform() === 'windows' ? '.exe' : ''
  const downloader = new Downloader(
    `${name}${binaryExtension}`,
    link,
    `${name}-${version}-${ASSET_ARCHIVE_PATTERN}/${name}${binaryExtension}`
  )

  await downloader.download()
}

export async function verify(name: string): Promise<void> {
  const result = await exec.getExecOutput(name, ['--version'])
  if (result.exitCode !== 0) {
    throw new Error(
      `failed while verifying ${name} version.\n[stdout: ${result.stdout}] [stderr: ${result.stderr}]`
    )
  }

  core.exportVariable(`${getEnvKey(name)}_VERSION`, result.stdout)
}

function getEnvKey(name: string): string {
  return name.toUpperCase().replace('-', '_')
}
