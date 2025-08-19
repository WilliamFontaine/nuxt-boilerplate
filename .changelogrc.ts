export default {
  preset: 'conventionalcommits',

  // Improved template configuration
  writerOpts: {
    transform: (commit: any, context: any) => {
      let discard = true
      const issues: string[] = []

      commit.notes.forEach((note: any) => {
        note.title = '🚨 BREAKING CHANGES'
        discard = false
      })

      // Skip certain commit types
      if (commit.type === 'build' || commit.type === 'ci' || commit.type === 'chore') {
        return
      }

      if (commit.type === 'feat') {
        commit.type = '✨ Features'
      } else if (commit.type === 'fix') {
        commit.type = '🐛 Bug Fixes'
      } else if (commit.type === 'refactor') {
        commit.type = '♻️ Code Refactoring'
      } else if (commit.type === 'docs') {
        commit.type = '📚 Documentation'
      } else if (commit.type === 'style') {
        commit.type = '💄 Styles'
      } else if (commit.type === 'test') {
        commit.type = '✅ Tests'
      } else if (commit.type === 'perf') {
        commit.type = '⚡ Performance'
      } else if (discard) {
        return
      }

      if (commit.scope === '*') {
        commit.scope = ''
      }

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7)
      }

      if (typeof commit.subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl
        if (url) {
          url = `${url}/issues/`
          // Issue URLs
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_: string, issue: string) => {
            issues.push(issue)
            return `[#${issue}](${url}${issue})`
          })
        }
        if (context.host) {
          // User URLs
          commit.subject = commit.subject.replace(/@([a-zA-Z0-9_]+)/g, `[@$1](${context.host}/$1)`)
        }
      }

      // Remove references that already appear in the subject
      commit.references = commit.references.filter((reference: any) => {
        if (issues.indexOf(reference.issue) === -1) {
          return true
        }
        return false
      })

      return commit
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title'
  }
}
