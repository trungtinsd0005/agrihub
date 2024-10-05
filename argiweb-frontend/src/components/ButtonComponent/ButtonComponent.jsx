import React from 'react'
import { Button } from 'antd';
import styles from './ButtonComponent.module.scss';

const ButtonComponent = ({ label, className }) => {
  return (
    <div className={styles.containerButton}>
        <Button className={className}>
            {label}
        </Button>
  </div>
  )
}

export default ButtonComponent