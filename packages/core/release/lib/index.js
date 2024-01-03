'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const node_1 = __importDefault(require('@monodeploy/node'))
const child_process_1 = require('child_process')
// NOTE(mroberts): We used to be able to get by with just the monodeploy CLI,
// but it turns out we still need to manage the publishing of git tags
// ourselves.
async function main() {
  try {
    const autoCommitMessage = process.env.COMMIT_MESSAGE
    const dryRun = process.env.DRY_RUN === 'true'
    const prerelease = process.env.PRE_RELEASE === 'true'
    const config = {
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
    const changeset = await (0, node_1.default)(config)
    // NOTE(mroberts): GitHub only handles up to 3 tags at a time, so we need to
    // push them individually.
    const branch = getBranch()
    if (!dryRun) {
      ;(0, child_process_1.execSync)(`git push origin ${branch}`)
    } else {
      console.log(`[Dry Run] git push origin ${branch}`)
    }
    // NOTE(mroberts): With package groups, the same tag could be generated
    // multiple times, so we need to dedupe them.
    const tags = new Set()
    for (const packageName in changeset) {
      const change = changeset[packageName]
      const { tag } = change
      if (tag !== null) {
        tags.add(tag)
      }
    }
    for (const tag of tags) {
      if (!dryRun) {
        ;(0, child_process_1.execSync)(`git push origin refs/tags/${tag}`)
      } else {
        console.log(`[Dry Run] git push origin refs/tags/${tag}`)
      }
    }
  } catch (error) {
    // console.error(error) we will set logs as a feature later
    process.exit(1)
  }
}
function getBranch() {
  return (0, child_process_1.execSync)('git rev-parse --abbrev-ref HEAD').toString().trim()
}
// eslint-disable-next-line
main()
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0REFBeUM7QUFFekMsaURBQXdDO0FBRXhDLDZFQUE2RTtBQUM3RSxzRUFBc0U7QUFDdEUsYUFBYTtBQUNiLEtBQUssVUFBVSxJQUFJO0lBQ2pCLElBQUk7UUFDRixNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFBO1FBQ3BELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQTtRQUM3QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUE7UUFFckQsTUFBTSxNQUFNLEdBQThDO1lBQ3hELE1BQU0sRUFBRSxPQUFPO1lBQ2YsVUFBVSxFQUFFLElBQUk7WUFDaEIsaUJBQWlCO1lBQ2pCLG9CQUFvQixFQUFFLENBQUMsaUJBQWlCLElBQUksOEJBQThCLENBQUM7WUFDM0UsMkJBQTJCLEVBQUUsZ0NBQWdDO1lBQzdELE1BQU07WUFDTixlQUFlLEVBQUUsSUFBSTtZQUNyQixVQUFVO1lBQ1YseUJBQXlCLEVBQUUscUJBQXFCO1lBQ2hELGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUE7UUFFRCxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsY0FBVSxFQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRTFDLDRFQUE0RTtRQUM1RSwwQkFBMEI7UUFFMUIsTUFBTSxNQUFNLEdBQUcsU0FBUyxFQUFFLENBQUE7UUFDMUIsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLElBQUEsd0JBQVEsRUFBQyxtQkFBbUIsTUFBTSxFQUFFLENBQUMsQ0FBQTtTQUN0QzthQUFNO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsTUFBTSxFQUFFLENBQUMsQ0FBQTtTQUNuRDtRQUVELHVFQUF1RTtRQUN2RSw2Q0FBNkM7UUFFN0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQTtRQUM5QixLQUFLLE1BQU0sV0FBVyxJQUFJLFNBQVMsRUFBRTtZQUNuQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDckMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQTtZQUV0QixJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7YUFDZDtTQUNGO1FBRUQsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDdEIsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWCxJQUFBLHdCQUFRLEVBQUMsNkJBQTZCLEdBQUcsRUFBRSxDQUFDLENBQUE7YUFDN0M7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsR0FBRyxFQUFFLENBQUMsQ0FBQTthQUMxRDtTQUNGO0tBQ0Y7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLDJEQUEyRDtRQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ2hCO0FBQ0gsQ0FBQztBQUVELFNBQVMsU0FBUztJQUNoQixPQUFPLElBQUEsd0JBQVEsRUFBQyxpQ0FBaUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ3RFLENBQUM7QUFFRCwyQkFBMkI7QUFDM0IsSUFBSSxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9ub2RlcGxveSBmcm9tICdAbW9ub2RlcGxveS9ub2RlJ1xuaW1wb3J0IHR5cGUgeyBNb25vZGVwbG95Q29uZmlndXJhdGlvbiwgUmVjdXJzaXZlUGFydGlhbCB9IGZyb20gJ0Btb25vZGVwbG95L3R5cGVzJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuXG4vLyBOT1RFKG1yb2JlcnRzKTogV2UgdXNlZCB0byBiZSBhYmxlIHRvIGdldCBieSB3aXRoIGp1c3QgdGhlIG1vbm9kZXBsb3kgQ0xJLFxuLy8gYnV0IGl0IHR1cm5zIG91dCB3ZSBzdGlsbCBuZWVkIHRvIG1hbmFnZSB0aGUgcHVibGlzaGluZyBvZiBnaXQgdGFnc1xuLy8gb3Vyc2VsdmVzLlxuYXN5bmMgZnVuY3Rpb24gbWFpbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBhdXRvQ29tbWl0TWVzc2FnZSA9IHByb2Nlc3MuZW52LkNPTU1JVF9NRVNTQUdFXG4gICAgY29uc3QgZHJ5UnVuID0gcHJvY2Vzcy5lbnYuRFJZX1JVTiA9PT0gJ3RydWUnXG4gICAgY29uc3QgcHJlcmVsZWFzZSA9IHByb2Nlc3MuZW52LlBSRV9SRUxFQVNFID09PSAndHJ1ZSdcblxuICAgIGNvbnN0IGNvbmZpZzogUmVjdXJzaXZlUGFydGlhbDxNb25vZGVwbG95Q29uZmlndXJhdGlvbj4gPSB7XG4gICAgICBhY2Nlc3M6ICdpbmZlcicsXG4gICAgICBhdXRvQ29tbWl0OiB0cnVlLFxuICAgICAgYXV0b0NvbW1pdE1lc3NhZ2UsXG4gICAgICBjb21taXRJZ25vcmVQYXR0ZXJuczogW2F1dG9Db21taXRNZXNzYWdlID8/ICdjaG9yZTogcmVsZWFzZSBcXFxcW3NraXAgY2lcXFxcXSddLFxuICAgICAgY29udmVudGlvbmFsQ2hhbmdlbG9nQ29uZmlnOiAnY29udmVudGlvbmFsLWNoYW5nZWxvZy1hbmd1bGFyJyxcbiAgICAgIGRyeVJ1bixcbiAgICAgIHBlcnNpc3RWZXJzaW9uczogdHJ1ZSxcbiAgICAgIHByZXJlbGVhc2UsXG4gICAgICBwYWNrYWdlR3JvdXBNYW5pZmVzdEZpZWxkOiAncHVibGlzaENvbmZpZy5ncm91cCcsXG4gICAgICB0b3BvbG9naWNhbERldjogdHJ1ZVxuICAgIH1cblxuICAgIGNvbnN0IGNoYW5nZXNldCA9IGF3YWl0IG1vbm9kZXBsb3koY29uZmlnKVxuXG4gICAgLy8gTk9URShtcm9iZXJ0cyk6IEdpdEh1YiBvbmx5IGhhbmRsZXMgdXAgdG8gMyB0YWdzIGF0IGEgdGltZSwgc28gd2UgbmVlZCB0b1xuICAgIC8vIHB1c2ggdGhlbSBpbmRpdmlkdWFsbHkuXG5cbiAgICBjb25zdCBicmFuY2ggPSBnZXRCcmFuY2goKVxuICAgIGlmICghZHJ5UnVuKSB7XG4gICAgICBleGVjU3luYyhgZ2l0IHB1c2ggb3JpZ2luICR7YnJhbmNofWApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbRHJ5IFJ1bl0gZ2l0IHB1c2ggb3JpZ2luICR7YnJhbmNofWApXG4gICAgfVxuXG4gICAgLy8gTk9URShtcm9iZXJ0cyk6IFdpdGggcGFja2FnZSBncm91cHMsIHRoZSBzYW1lIHRhZyBjb3VsZCBiZSBnZW5lcmF0ZWRcbiAgICAvLyBtdWx0aXBsZSB0aW1lcywgc28gd2UgbmVlZCB0byBkZWR1cGUgdGhlbS5cblxuICAgIGNvbnN0IHRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKVxuICAgIGZvciAoY29uc3QgcGFja2FnZU5hbWUgaW4gY2hhbmdlc2V0KSB7XG4gICAgICBjb25zdCBjaGFuZ2UgPSBjaGFuZ2VzZXRbcGFja2FnZU5hbWVdXG4gICAgICBjb25zdCB7IHRhZyB9ID0gY2hhbmdlXG5cbiAgICAgIGlmICh0YWcgIT09IG51bGwpIHtcbiAgICAgICAgdGFncy5hZGQodGFnKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgdGFnIG9mIHRhZ3MpIHtcbiAgICAgIGlmICghZHJ5UnVuKSB7XG4gICAgICAgIGV4ZWNTeW5jKGBnaXQgcHVzaCBvcmlnaW4gcmVmcy90YWdzLyR7dGFnfWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhgW0RyeSBSdW5dIGdpdCBwdXNoIG9yaWdpbiByZWZzL3RhZ3MvJHt0YWd9YClcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gY29uc29sZS5lcnJvcihlcnJvcikgd2Ugd2lsbCBzZXQgbG9ncyBhcyBhIGZlYXR1cmUgbGF0ZXJcbiAgICBwcm9jZXNzLmV4aXQoMSlcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRCcmFuY2goKTogc3RyaW5nIHtcbiAgcmV0dXJuIGV4ZWNTeW5jKCdnaXQgcmV2LXBhcnNlIC0tYWJicmV2LXJlZiBIRUFEJykudG9TdHJpbmcoKS50cmltKClcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5tYWluKClcbiJdfQ==
