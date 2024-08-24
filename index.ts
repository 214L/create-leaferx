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

 
  const { values: argv ,positionals} = parseArgs({
    args,
    strict: false
  })
  let targetDir = positionals[0]
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
        initial: 'leafer-x-' ,
        onState: (state) => (targetDir = String(state.value).trim() || 'leafer-x-')
      },
      {
        type: 'multiselect',
        name: 'supportPlatforms',
        message: promptMessage.supportPlatforms.message,
        choices: [
            { title: 'web', value: 'web' , selected: true },
            { title: 'worker', value: 'worker', selected: true  },
            { title: 'node', value: 'node' , selected: true },
            { title: 'miniapp', value: 'miniapp' , selected: true },
        ],
        hint: promptMessage.supportPlatforms.hint,
        instructions: false, 
        min: 1, 
        max: 4
      }
    ])
    console.log(result);
    console.log(targetDir);
    
    console.log('finish')
  } catch (cancelled) {
    console.log('cancelled')
    process.exit(1)
  }
}
init().catch(e => {
  console.error(e)
})
