import monodeploy from '@monodeploy/node'
import type { MonodeployConfiguration, RecursivePartial } from '@monodeploy/types'
import { execSync } from 'child_process'

// NOTE(mroberts): We used to be able to get by with just the monodeploy CLI,
// but it turns out we still need to manage the publishing of git tags
// ourselves.
async function main(): Promise<void> {
  try {
    const autoCommitMessage = process.env.COMMIT_MESSAGE
    const config: RecursivePartial<MonodeployConfiguration> = {
      access: 'infer',
      autoCommit: true,
      autoCommitMessage,
      commitIgnorePatterns: [autoCommitMessage ?? 'chore: release \\[skip ci\\]'],
      conventionalChangelogConfig: 'conventional-changelog-angular',
      persistVersions: true,
      topologicalDev: true
    }

    const changeset = await monodeploy(config)

    // NOTE(mroberts): GitHub only handles up to 3 tags at a time, so we need to
    // push them individually.

    const branch = getBranch()
    execSync(`git push origin ${branch}`)

    for (const packageName in changeset) {
      const change = changeset[packageName]
      const { tag } = change
      if (tag !== null) {
        execSync(`git push origin refs/tags/${tag}`)
      }
    }
  } catch (error) {
    // console.error(error) we will set logs as a feature later
    process.exit(1)
  }
}

function getBranch(): string {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}

// eslint-disable-next-line
main()
