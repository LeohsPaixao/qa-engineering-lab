import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'QA Solar',
  tagline: 'QA Solar',
  favicon: 'img/logoqae2e_white.ico',
  url: 'https://leohspaixao.github.io',
  baseUrl: '/qa-solar/docs/',
  organizationName: 'LeohsPaixao',
  projectName: 'qa-solar',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  future: {
    v4: true,
  },

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/LeohsPaixao/qa-solar/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logoqae2e_white.ico',
    navbar: {
      title: 'QA Solar',
      logo: {
        alt: 'QA Solar Logo',
        src: 'img/logoqae2e_white.ico',
      },
      items: [
        {
          href: 'https://github.com/LeohsPaixao/qa-solar',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} QA Solar. Desenvolvido por Leonardo Paixão.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
