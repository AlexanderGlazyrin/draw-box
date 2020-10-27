import React from 'react';
import {DeleteOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {useDispatch} from 'react-redux';
import {clearTrue} from '../../redux/action-creators';

const ClearButton = () => {
  const dispatch = useDispatch();

  return (
    <Button
      style={{position: 'fixed', top: 145, left: 15}}
      type="primary"
      shape="circle"
      icon={<DeleteOutlined />}
      size={'large'}
      onClick={() => {dispatch(clearTrue())}}
    />
  );
};

export default ClearButton;
