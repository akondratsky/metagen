import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';
import Link from '@docusaurus/Link';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Home"
      description="Templating engine which helps to automate creation of entire modules with files, folders and subfolders"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className={clsx('container', styles.container)}>
          <h1 className="hero__title">
            {siteConfig.title}
          </h1>
          <p className="hero__subtitle">
            {siteConfig.tagline}
          </p>
          <img style={{ marginTop: 30 }} width={300} src="img/logo.png" />

          <Link to="/docs/intro" className={clsx(styles.button, styles.glowOnHover)}>
            DOCUMENTATION
          </Link>

        </div>
      </header>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
