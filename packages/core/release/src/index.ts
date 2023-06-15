import monodeploy from '@monodeploy/node'
import type { MonodeployConfiguration, RecursivePartial } from '@monodeploy/types'
import { execSync } from 'child_process'

// NOTE(mroberts): We used to be able to get by with just the monodeploy CLI,
// but it turns out we still need to manage the publishing of git tags
// ourselves.
async function main(): Promise<void> {
  try {
    const autoCommitMessage = process.env.COMMIT_MESSAGE
    const dryRun = process.env.DRY_RUN === 'true'
    const prerelease = process.env.PRE_RELEASE === 'true'

    const config: RecursivePartial<MonodeployConfiguration> = {
      access: 'infer',
      autoCommit: true,
      autoCommitMessage,
      commitIgnorePatterns: [autoCommitMessage ?? 'chore: release \\[skip ci\\]'],
      conventionalChangelogConfig: 'conventional-changelog-angular',
      dryRun,
      persistVersions: true,
      prerelease,
      packageGroupManifestField: 'publishConfig.group',
      topologicalDev: true
    }

    const changeset = await monodeploy(config)

    // NOTE(mroberts): GitHub only handles up to 3 tags at a time, so we need to
    // push them individually.

    const branch = getBranch()
    if (!dryRun) {
      execSync(`git push origin ${branch}`)
    } else {
      console.log(`[Dry Run] git push origin ${branch}`)
    }

    // NOTE(mroberts): With package groups, the same tag could be generated
    // multiple times, so we need to dedupe them.

    const tags = new Set<string>()
    for (const packageName in changeset) {
      const change = changeset[packageName]
      const { tag } = change

      if (tag !== null) {
        tags.add(tag)
      }
    }

    for (const tag of tags) {
      if (!dryRun) {
        execSync(`git push origin refs/tags/${tag}`)
      } else {
        console.log(`[Dry Run] git push origin refs/tags/${tag}`)
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
