import * as React from 'react';
import {Fragment, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {useScript} from 'usehooks-ts';

const ThemeSwitcher = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const themeSwitcherScript = useScript(
    'https://unpkg.com/@nl-design-system-unstable/theme-switcher'
  );

  useEffect(() => {
    if (themeSwitcherScript === 'ready') {
      setScriptLoaded(true);
    }
    console.log(themeSwitcherScript);
  }, [themeSwitcherScript]);


  return (
    <Fragment>
      <Helmet>
        <link
          href="https://unpkg.com/@utrecht/component-library-css/dist/bem.css"
          rel="stylesheet"
        />

        <meta name="theme-color" content="hsl(0 0% 95%)" />
      </Helmet>
      {scriptLoaded && (
        // @ts-ignore
        <nl-theme-switcher // @ts-ignore
          target=".utrecht-document"
          themes={JSON.stringify([
            {
              className: 'demodam-theme',
              title: 'Demodam',
              href: 'https://unpkg.com/@conductionnl/demodam-design-tokens/src/index.css',
            },
            {
              className: 'amsterdam-theme',
              title: '0363',
              href: 'https://unpkg.com/@nl-design-system-unstable/amsterdam-design-tokens/dist/index.css',
            },
            {
              className: 'bodegraven-theme',
              title: '1901',
              href: 'https://unpkg.com/@nl-design-system-unstable/bodegraven-design-tokens/dist/index.css',
            },
            {
              className: 'borne-theme',
              title: '0147',
              href: 'https://unpkg.com/@nl-design-system-unstable/borne-design-tokens/dist/index.css',
            },
            {
              className: 'drechterland-theme',
              title: '0498',
              href: 'https://unpkg.com/@nl-design-system-unstable/drechterland-design-tokens/dist/index.css',
            },
            {
              className: 'duiven-theme',
              title: '0226',
              href: 'https://unpkg.com/@nl-design-system-unstable/duiven-design-tokens/dist/index.css',
            },
            {
              className: 'duo-theme',
              title: 'Duo',
              href: 'https://unpkg.com/@nl-design-system-unstable/duo-design-tokens/dist/index.css',
            },
            {
              className: 'enkhuizen-theme',
              title: '0388',
              href: 'https://unpkg.com/@nl-design-system-unstable/enkhuizen-design-tokens/dist/index.css',
            },
            {
              className: 'groningen-theme',
              title: '0014',
              href: 'https://unpkg.com/@nl-design-system-unstable/groningen-design-tokens/dist/index.css',
            },
            {
              className: 'haarlemmermeer-theme',
              title: '0394',
              href: 'https://unpkg.com/@nl-design-system-unstable/haarlemmermeer-design-tokens/dist/index.css',
            },
            {
              className: 'hoorn-theme',
              title: '0405',
              href: 'https://unpkg.com/@nl-design-system-unstable/hoorn-design-tokens/dist/index.css',
            },
            {
              className: 'horstaandemaas-theme',
              title: '1507',
              href: 'https://unpkg.com/@nl-design-system-unstable/horstaandemaas-design-tokens/dist/index.css',
            },
            {
              className: 'leidschendam-theme',
              title: '1916',
              href: 'https://unpkg.com/@nl-design-system-unstable/leidschendam-design-tokens/dist/index.css',
            },
            {
              className: 'nijmegen-theme',
              title: '0268',
              href: 'https://unpkg.com/@nl-design-system-unstable/nijmegen-design-tokens/dist/index.css',
            },
            {
              className: 'noordoostpolder-theme',
              title: '0171',
              href: 'https://unpkg.com/@nl-design-system-unstable/noordoostpolder-design-tokens/dist/index.css',
            },
            {
              className: 'riddeliemers-theme',
              title: 'riddeliemers',
              href: 'https://unpkg.com/@nl-design-system-unstable/riddeliemers-design-tokens/dist/index.css',
            },
            {
              className: 'rotterdam-theme',
              title: '0599',
              href: 'https://unpkg.com/@nl-design-system-unstable/rotterdam-design-tokens/dist/index.css',
            },
            {
              className: 'stedebroec-theme',
              title: '0532',
              href: 'https://unpkg.com/@nl-design-system-unstable/stedebroec-design-tokens/dist/index.css',
            },
            {
              className: 'tilburg-theme',
              title: '0855',
              href: 'https://unpkg.com/@nl-design-system-unstable/tilburg-design-tokens/dist/index.css',
            },
            {
              className: 'utrecht-theme',
              title: 'Utrecht',
              href: 'https://unpkg.com/@utrecht/design-tokens/dist/theme/index.css',
            },
            {
              className: 'venray-theme',
              title: '0984',
              href: 'https://unpkg.com/@nl-design-system-unstable/venray-design-tokens/dist/index.css',
            },
            {
              className: 'vught-theme',
              title: '0865',
              href: 'https://unpkg.com/@nl-design-system-unstable/vught-design-tokens/dist/index.css',
            },
            {
              className: 'westervoort-theme',
              title: '0293',
              href: 'https://unpkg.com/@nl-design-system-unstable/westervoort-design-tokens/dist/index.css',
            },
            {
              className: 'zevenaar-theme',
              title: '0299',
              href: 'https://unpkg.com/@nl-design-system-unstable/zevenaar-design-tokens/dist/index.css',
            },
            {
              className: 'zwolle-theme',
              title: '0193',
              href: 'https://unpkg.com/@nl-design-system-unstable/zwolle-design-tokens/dist/index.css',
            },
          ])}
        />
      )}
    </Fragment>
  );
};

export {ThemeSwitcher};
