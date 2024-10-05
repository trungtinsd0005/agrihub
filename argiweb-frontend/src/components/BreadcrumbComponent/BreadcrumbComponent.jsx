import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

const BreadcrumbComponent = ({ breadcrumbs }) => {
  return (
    <Breadcrumb style={{ fontFamily: 'bold', marginBottom: '20px', marginTop: '20px', fontSize: '16px' }}>
      {breadcrumbs.map((breadcrumb, index) => (
        <Breadcrumb.Item key={index}>
          {breadcrumb.path ? (
            <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
          ) : (
            breadcrumb.label
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;