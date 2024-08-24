#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import prompts from 'prompts'
import * as banners from './utils/banners'
import { getLeaferVersion, getPrompt } from './utils/index'

async function init() {
  console.log(0)
  console.log(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8
      ? banners.gradientBanner
      : banners.defaultBanner
  )
  console.log()
  let res = await getLeaferVersion()
  console.log(res)


  const promptMessage = getPrompt()
  
  const args = process.argv.slice(2)

 
  const { values: argv } = parseArgs({
    args,
    strict: false
  })
  
  let result= {}

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
        initial: 'leafer-x-' 
      }
    ])

    console.log('finish')
  } catch (cancelled) {
    console.log('cancelled')
    process.exit(1)
  }
}
init().catch(e => {
  console.error(e)
})
