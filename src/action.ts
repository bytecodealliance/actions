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

  const allReleases = await octokit.rest.repos.listReleases({owner, repo})
  const release = allReleases.data.find(
    item =>
      !item.prerelease &&
      item.assets.find(asset => asset.name.includes(ASSET_ARCHIVE_PATTERN))
  )

  if (!release) {
    throw new Error(
      `no releases found for platform ${platform} and architecture ${arch}`
    )
  }

  return release.tag_name
}

export async function getDownloadLink(
  owner: string,
  repo: string,
  version: string
): Promise<string> {
  const token = core.getInput('github_token')
  const octokit = (() => {
    return token ? new Octokit({auth: token}) : new Octokit()
  })()

  const platform = getPlatform()
  const arch = getArch()

  const allReleases = await octokit.rest.repos.listReleases({owner, repo})
  const release = allReleases.data.find(item => item.tag_name === version)
  if (!release) {
    throw new Error(
      `failed to find release for version '${version}' for platform '${platform}' and arch '${arch}'`
    )
  }

  const archiveExtension = getPlatform() === 'windows' ? '.zip' : '.tar.xz'
  const asset = release.assets.find(item =>
    item.name.includes(`${ASSET_ARCHIVE_PATTERN}${archiveExtension}`)
  )

  if (!asset) {
    throw new Error(
      `failed to find asset for version '${version}' for platform '${platform}' and arch '${arch}'`
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

  core.info(result.stdout)
  core.exportVariable(`${name.toUpperCase()}_VERSION`, result.stdout)
}
