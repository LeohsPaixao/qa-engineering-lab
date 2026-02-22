/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: [
    "@commitlint/config-conventional"
  ],
  rules: {
    'scope-empty': [0, 'always'],
    'subject-empty': [0, 'always'],
    'scope-wrong': [2, 'never'],
    'subject-wrong': [2, 'never'],
    'type-enum': [
      2,
      "always",
      [
        "refactor",
        "chore",
        "ci",
        "docs",
        "feat",
        "test",
        "story",
        "epic",
      ]
    ]
  },
  plugins: [
    {
      rules: {
        'scope-wrong': ({ scope }) => {
          if (!scope) {
            return [true, ''];
          }
          if (scope.match(/^[a-z]/)) {
            return [true, ''];
          }
          return [false, 'scope must start with a lowercase letter'];
        },
        'subject-wrong': ({ subject }) => {
          const oldPatternCommit = /^\(|\(.+\)|\)$/g;
          if (!subject) return [false, 'subject may not be empty'];
          if (subject.match(oldPatternCommit)) return [false, 'subject has the old commit pattern, try the new one, remove ()'];
          return [true, ''];
        }
      }
    }
  ]
};