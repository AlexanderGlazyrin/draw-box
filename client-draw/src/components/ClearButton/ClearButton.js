import React from 'react';
import {DeleteOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import style from './ClearButton.module.css'
import {useDispatch} from 'react-redux';
import {clearTrue} from '../../redux/action-creators';

const ClearButton = () => {
  const dispatch = useDispatch();

  return (
    <Button
      type="primary"
      shape="circle"
      icon={<DeleteOutlined />}
      size={'large'}
      className={style.btn}
      onClick={() => {dispatch(clearTrue())}}
    />
  );
};

export default ClearButton;
