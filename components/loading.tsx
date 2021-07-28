import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import React from 'react';

export default function Loading() {
  const spinner = (
    <LoadingOutlined style={{fontSize: 20, color: 'white'}} spin />
  );

  const style: any = {
    background: 'url(https://livewallpaperhd.com/wp-content/uploads/2020/10/Wallpaper-Cool-Dark-HD.jpg) no-repeat center center fixed',
    minHeight: '100vh',
    padding: '0 0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={style}>
      <Spin indicator={spinner} tip="Loading..." style={{color: 'white'}} />
    </div>
  );
}
