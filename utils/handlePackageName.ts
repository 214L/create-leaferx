export function isValidPackageName(projectName) {
  return /^(leafer-[a-z0-9-~][a-z0-9-._~]*|@[a-z0-9-*~][a-z0-9-*._~]*\/leafer-x[a-z0-9-._~]*)$/.test(
    projectName
  )
}

export function toValidPackageName(projectName) {
  let inputName = projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
  const regex = /^(leafer-x|@[a-zA-Z0-9_-]+\/leafer-x)/
  if (regex.test(inputName)) {
    return inputName
  } else {
    return 'leafer-x-'
  }
}
