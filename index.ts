#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import prompts from 'prompts'
import * as banners from './utils/banners'
import {
  getLeaferVersion,
  getPrompt,
  canSkipOverwriteOption,
  emptyDirectory,
  isValidPackageName,
  toValidPackageName
} from './utils/index'
import { red, gray, bold } from 'kolorist'
import ora from 'ora'

async function init() {
  console.log()
  console.log(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8
      ? banners.gradientBanner
      : banners.defaultBanner
  )
  console.log()
  let leaferVersion = await getLeaferVersion()

  const promptMessage = getPrompt()

  const args = process.argv.slice(2)

  const { values: argv, positionals } = parseArgs({
    args,
    strict: false
  })
  let targetDir = positionals[0]
  let result: {
    projectName?: string
    shouldOverwrite?: boolean
    packageName?: string
  } = {}

  try {
    // Prompts:
    // - Project name:
    //   - whether to overwrite the existing directory or not?
    //   - enter a valid package name for package.json
    result = await prompts([
      {
        name: 'projectName',
        type: 'text',
        message: promptMessage.projectName.message,
        initial: 'leafer-',
        onState: state =>
          (targetDir = String(state.value).trim() || 'leafer-')
      },
      {
        name: 'shouldOverwrite',
        type: () => (canSkipOverwriteOption(targetDir) ? null : 'toggle'),
        message: () => {
          const dirForPrompt =
            targetDir === '.'
              ? promptMessage.shouldOverwrite.dirForPrompts.current
              : `${promptMessage.shouldOverwrite.dirForPrompts.target} "${targetDir}"`

          return `${dirForPrompt} ${promptMessage.shouldOverwrite.message}`
        },
        initial: true,
        active: promptMessage.defaultToggleOptions.active,
        inactive: promptMessage.defaultToggleOptions.inactive
      },
      {
        name: 'overwriteChecker',
        type: (prev, values) => {
          if (values.shouldOverwrite === false) {
            throw new Error(
              red('✖') + ` ${promptMessage.errors.operationCancelled}`
            )
          }
          return null
        }
      },
      {
        name: 'packageName',
        type: () => (isValidPackageName(targetDir) ? null : 'text'),
        message: `${promptMessage.packageName.message}\n${gray(promptMessage.packageName.hint)}`,
        initial:() => toValidPackageName(targetDir),
        validate: (dir) => isValidPackageName(dir) || promptMessage.packageName.invalidMessage
      },
      {
        type: 'multiselect',
        name: 'supportPlatforms',
        message: promptMessage.supportPlatforms.message,
        choices: [
          { title: 'web', value: 'web', selected: true },
          { title: 'worker', value: 'worker', selected: true },
          { title: 'node', value: 'node', selected: true },
          { title: 'miniapp', value: 'miniapp', selected: true }
        ],
        hint: promptMessage.supportPlatforms.hint,
        instructions: false,
        min: 1,
        max: 4
      }
    ])
    let { shouldOverwrite } = result

    const cwd = process.cwd()
    const root = path.join(cwd, targetDir)

    
    if (fs.existsSync(root) && shouldOverwrite) {
      const spinner = ora('emptying dir...').start()
      emptyDirectory(root)
      spinner.succeed('emptying dir succeed.')
    } else if (!fs.existsSync(root)) {
      fs.mkdirSync(root)
    }

    console.log('finish')
  } catch (cancelled) {
    console.log('cancelled', cancelled)
    process.exit(1)
  }
}
init().catch(e => {
  console.error(e)
})
