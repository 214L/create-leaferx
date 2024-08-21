#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'

import { parseArgs } from 'node:util'

import * as banners from './utils/banners'

async function init() {
  console.log()
  console.log(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8
      ? banners.gradientBanner
      : banners.defaultBanner
  )
  console.log()
}

init().catch(e => {
  console.error(e)
})