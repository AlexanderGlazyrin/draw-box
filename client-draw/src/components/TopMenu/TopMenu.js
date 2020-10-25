import React from 'react';
import {Link} from 'react-router-dom';
import style from './TopMenu.module.css'
import {toggleBrushMenu} from '../../redux/action-creators';
import {useDispatch} from 'react-redux';

const TopMenu = () => {
  const dispatch = useDispatch()
  const toggleMenuOfBrush = () => {
    dispatch(toggleBrushMenu());
  };

  return (
    <div className={style.head}>
      <h2 style={{color: 'white'}}>DrawBox</h2>
      <div className={style.links}>
        <Link to='#' onClick={toggleMenuOfBrush}>Brush</Link>
        <Link to='#'>Login</Link>
      </div>
    </div>
  );
};

export default TopMenu;
