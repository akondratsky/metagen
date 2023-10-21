import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { LiaConnectdevelop } from 'react-icons/lia';
import { LuFolderSync } from 'react-icons/lu';
import { FaTruckFast } from 'react-icons/fa6';
import { IconContext } from 'react-icons';

type FeatureItem = {
  title: string;
  icon: React.ReactNode;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Generate Your Projects',
    icon: <LiaConnectdevelop size="13rem" />,
    description: <>Use more than templates - create whole file structures flexibly.</>,
  },

  {
    title: 'Express Your Experience',
    icon: <LuFolderSync size="12rem" />,
    description: <>Use a declarative syntax to enhance your blueprints without coding.</>,
  },

  {
    title: 'Improve Your Efficiency',
    icon: <FaTruckFast size="12rem" />,
    description: <>Automate and speed up your development. Create components, modules, and even projects with ease.</>,
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div 
        className={clsx('text--center', styles.featureIcon)}
      >
        {icon}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <IconContext.Provider value={{ size: '10rem' }}>
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </IconContext.Provider>
  );
}
