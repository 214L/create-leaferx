interface NpmRegistryResponse {
  version: string
  [key: string]: any
}
export async function getLeaferVersion(): Promise<string | undefined> {
  try {
    const registry =getNpmRegistry()
    const response = await fetch(`${registry}/leafer/latest`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = (await response.json()) as NpmRegistryResponse
    return data.version
  } catch (error) {
    console.error('Failed to fetch Leafer version:', error)
    console.error('process continues with version 1.0.2')
    return "1.0.2"
  }
}

function getNpmRegistry() {
  const registry = process.env.npm_config_registry
  // 如果没有设置用户级别的 registry，返回默认值
  return registry || 'https://registry.npmjs.org/'
}
