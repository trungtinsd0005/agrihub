import React from 'react';
import styles from './WrapperBgColorComponent.module.scss';

const WrapperBgColorComponent = ({children}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
            {children}
      </div>
    </div>
  );
}

export default WrapperBgColorComponent;