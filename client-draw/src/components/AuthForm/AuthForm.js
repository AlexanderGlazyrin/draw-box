import React from 'react';
import {Button, Input} from 'antd';
import style from './AuthForm.module.css'

const AuthForm = ({titleBtn, onSubmit}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={style.form}
    >
          <Input
            name={'name'}
            placeholder={'Name'}
          />
          <Input.Password
            name={'password'}
            placeholder={'Password'}
          />
          <Button
            htmlType='submit'
          >
            {titleBtn}
          </Button>
    </form>
  );
};

export default AuthForm;
