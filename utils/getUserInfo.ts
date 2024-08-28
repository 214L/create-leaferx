import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync } from 'node:child_process'

interface NpmRegistryResponse {
  version: string
  [key: string]: any
}
export async function getLeaferVersion(): Promise<string | undefined> {
  try {
    const registry = getNpmRegistry()

    const response = await fetch(`${registry}leafer/latest`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = (await response.json()) as NpmRegistryResponse
    return data.version
  } catch (error) {
    console.error('Failed to fetch Leafer version:', error)
    console.error('process continues with version 1.0.2')
    return '1.0.2'
  }
}
function getNpmRegistry() {
  const registry = process.env.npm_config_registry
  // 如果没有设置用户级别的 registry，返回默认值
  return registry || 'https://registry.npmjs.org/'
}
export function getPrompt() {
  const shellLocale =
    process.env.LC_ALL ||
    process.env.LC_MESSAGES ||
    process.env.LANG ||
    Intl.DateTimeFormat().resolvedOptions().locale ||
    'en-US' // Default fallback
  let locale = shellLocale.split('.')[0].replace('_', '-')
  locale = locale.startsWith('en') ? 'en-US' : 'zh-Hans'
  const promptRoot = path.resolve('', 'prompt')
  const languageFilePath = path.resolve(promptRoot, `${locale}.json`)
  const doesLanguageExist = fs.existsSync(languageFilePath)

  const prompt = doesLanguageExist
    ? require(languageFilePath)
    : require(path.resolve(promptRoot, 'en-US.json'))

  return prompt
}

export function getUser() {
  let userName = getGitUsername()
    ? getGitUsername()
    : getNpmUsername()
      ? getNpmUsername()
      : ''
  let emailAddress = getGitEmailAddress() ? ` <${getGitEmailAddress()}>` : ''
  return userName + emailAddress
}

function getNpmUsername() {
  try {
    return execSync('npm whoami', { encoding: 'utf8' }).trim()
  } catch (err) {
    return null
  }
}

function getGitUsername() {
  try {
    return execSync('git config --get user.name', { encoding: 'utf8' }).trim()
  } catch (err) {
    return null
  }
}

function getGitEmailAddress() {
  try {
    return execSync('git config --get user.email', { encoding: 'utf8' }).trim()
  } catch (err) {
    return null
  }
}
