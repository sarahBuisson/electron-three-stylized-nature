const token = process.env.GITHUB_TOKEN
const repository = process.env.GITHUB_REPOSITORY
const apiUrl = process.env.GITHUB_API_URL || 'https://api.github.com'
const artifactPrefix = process.env.ARTIFACT_PREFIX || 'win-portable-main-'
const releasePrefix = process.env.RELEASE_PREFIX || 'release-win-'
const keepCount = Number.parseInt(process.env.KEEP_COUNT || '3', 10)

if (!token || !repository) {
  throw new Error('Missing required environment variables for cleanup job.')
}

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
}

const listUrl = `${apiUrl}/repos/${repository}/actions/artifacts?per_page=100`
const listResponse = await fetch(listUrl, { headers })
if (!listResponse.ok) {
  throw new Error(`Failed to list artifacts: ${listResponse.status}`)
}

const payload = await listResponse.json()
const artifacts = (payload.artifacts || [])
  .filter((artifact) => typeof artifact.name === 'string')
  .filter((artifact) => artifact.name.startsWith(artifactPrefix))
  .filter((artifact) => !artifact.name.startsWith(releasePrefix))
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

const toDelete = artifacts.slice(keepCount)

for (const artifact of toDelete) {
  const deleteUrl = `${apiUrl}/repos/${repository}/actions/artifacts/${artifact.id}`
  const deleteResponse = await fetch(deleteUrl, {
    method: 'DELETE',
    headers,
  })

  if (!deleteResponse.ok) {
    throw new Error(`Failed to delete artifact ${artifact.id}: ${deleteResponse.status}`)
  }
}

