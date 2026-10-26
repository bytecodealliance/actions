import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'
import {getDownloadLink, getLatestRelease, resolveVersion} from './action'

jest.mock('@actions/core', () => ({getInput: jest.fn(), info: jest.fn()}))
jest.mock('@octokit/rest', () => ({Octokit: jest.fn()}))
jest.mock('./download', () => ({Downloader: jest.fn()}))
jest.mock('./system', () => ({getArch: () => 'x86_64', getPlatform: () => 'linux'}))

const input = core.getInput as jest.Mock
const construct = Octokit as unknown as jest.Mock
const asset = (name: string) => ({name, browser_download_url: 'https://example.test/' + name})

beforeEach(() => {
  jest.clearAllMocks()
  input.mockReturnValue('')
})

test('keeps paging past prereleases and incompatible platform assets', async () => {
  const listReleases = jest.fn()
  const iterator = jest.fn(async function* () {
    yield {data: [{tag_name: 'preview', prerelease: true, assets: [asset('x86_64-linux.tar.xz')]}]}
    yield {data: [
      {tag_name: 'wrong-platform', prerelease: false, assets: [asset('aarch64-macos.tar.xz')]},
      {tag_name: 'v1.2.3', prerelease: false, assets: [asset('tool-x86_64-linux.tar.xz')]}
    ]}
  })
  construct.mockImplementation(() => ({rest: {repos: {listReleases}}, paginate: {iterator}}))
  expect(await getLatestRelease('owner', 'tool')).toBe('v1.2.3')
  expect(iterator).toHaveBeenCalledWith(listReleases, {owner: 'owner', repo: 'tool'})
})

test('refuses a release list without a matching stable asset', async () => {
  construct.mockImplementation(() => ({rest: {repos: {listReleases: jest.fn()}}, paginate: {
    iterator: async function* () { yield {data: []} }
  }}))
  await expect(getLatestRelease('owner', 'tool')).rejects.toThrow('no releases found')
})

test('preserves an explicitly selected version without a GitHub request', async () => {
  input.mockImplementation((name: string) => name === 'version' ? '1.2.3' : '')
  expect(await resolveVersion('owner', 'tool')).toBe('1.2.3')
  expect(construct).not.toHaveBeenCalled()
})

test('selects the matching archive from a tagged release', async () => {
  const getReleaseByTag = jest.fn().mockResolvedValue({data: {assets: [
    asset('tool-aarch64-linux.tar.xz'), asset('tool-x86_64-linux.tar.xz')
  ]}})
  construct.mockImplementation(() => ({rest: {repos: {getReleaseByTag}}}))
  expect(await getDownloadLink('owner', 'tool', 'v1.2.3')).toBe('https://example.test/tool-x86_64-linux.tar.xz')
  expect(getReleaseByTag).toHaveBeenCalledWith({owner: 'owner', repo: 'tool', tag: 'v1.2.3'})
})

test('refuses a tagged release with no matching archive', async () => {
  construct.mockImplementation(() => ({rest: {repos: {
    getReleaseByTag: jest.fn().mockResolvedValue({data: {assets: [asset('tool-aarch64-linux.zip')]}})
  }}}))
  await expect(getDownloadLink('owner', 'tool', 'v1')).rejects.toThrow('failed to find asset')
})
