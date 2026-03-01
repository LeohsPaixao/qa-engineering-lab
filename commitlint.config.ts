import type { RuleOutcome, UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: [
    "@commitlint/config-conventional"
  ],
  rules: {
    'scope-empty': [0, 'always'],
    'subject-empty': [0, 'always'],
    'scope-wrong': [2, 'never'],
    'subject-wrong': [2, 'never'],
    'release-wrong': [2, 'never'],
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
        "RELEASE"
      ]
    ],
    'type-case': [0]
  },
  plugins: [
    {
      rules: {
        'scope-wrong': (parsed): RuleOutcome => {
          const { scope } = parsed;
          if (!scope) {
            return [true, ''];
          }
          if (scope.match(/^[a-z]/)) {
            return [true, ''];
          }
          return [false, 'scope must start with a lowercase letter'];
        },
        'subject-wrong': (parsed): RuleOutcome => {
          const { subject } = parsed;
          const oldPatternCommit = /^\(|\(.+\)|\)$/g;
          if (!subject) return [false, 'subject may not be empty'];
          if (subject.match(oldPatternCommit)) return [false, 'subject has the old commit pattern, try the new one, remove ()'];
          return [true, ''];
        },
        'release-wrong': (parsed): RuleOutcome => {
          const { type, subject } = parsed;
          if (type === 'RELEASE') {
            const releasePattern = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!subject || !subject.match(releasePattern)) {
              return [false, 'RELEASE commit must follow pattern: RELEASE: DD/MM/YYYY'];
            }
          }
          return [true, ''];
        }
      }
    }
  ]
};

export default config;