import React from 'react';
import {FormatPainterOutlined} from '@ant-design/icons';
import {toggleBrushMenu} from '../../redux/action-creators';
import {Button} from 'antd';
import {useDispatch} from 'react-redux';

const BrushButton = () => {
  const dispatch = useDispatch();

  return (
    <Button
      style={{position: 'fixed', top: 90, left: 15}}
      type="primary"
      shape="circle"
      icon={<FormatPainterOutlined />}
      size={'large'}
      onClick={() => {dispatch(toggleBrushMenu())}}
    />
  );
};

export default BrushButton;
