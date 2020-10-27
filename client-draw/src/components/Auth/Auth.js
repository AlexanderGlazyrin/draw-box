import React from 'react';
import {Tabs} from 'antd';
import AuthForm from '../AuthForm/AuthForm';
import 'antd/dist/antd.css';
import {authUser, regUser} from '../../redux/action-creators';
import {useDispatch} from 'react-redux';

const {TabPane} = Tabs;

const Auth = () => {
  const dispatch = useDispatch();

  const auth = (e) => {
    e.preventDefault();
    const {password: {value: password}, name: {value: username}} = e.target;
    dispatch(authUser({password, username}));
  }

  const reg = (e) => {
    e.preventDefault();
    const {password: {value: password}, name: {value: username}} = e.target;
    dispatch(regUser({password, username}));
  }

  return (
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="Sign In" key="1">
        <AuthForm titleBtn={'Sign In'} onSubmit={auth} />
      </TabPane>
      <TabPane tab="Sign Up" key="2">
        <AuthForm titleBtn={'Sign Up'} onSubmit={reg}/>
      </TabPane>
    </Tabs>
  );
};

export default Auth;
