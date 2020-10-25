import React from 'react';
import {Link} from 'react-router-dom';
import style from './TopMenu.module.css'

const TopMenu = () => {
  return (
    <div className={style.head}>
      <h2 style={{color: 'white'}}>DrawBox</h2>
        <Link to='#'>Log In</Link>
    </div>
  );
};

export default TopMenu;
