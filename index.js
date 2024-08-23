#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'

import * as banners from './utils/banners.ts'
import { getLeaferVersion } from './utils/getNPMInfo.ts'

async function init() {
  console.log()
  console.log(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8
      ? banners.gradientBanner
      : banners.defaultBanner
  )
  console.log()
  let res =await getLeaferVersion()
  console.log(res)
  console.log();

  console.log("finish");
}

init().catch(e => {
  console.error(e)
})