import React from 'react';
import {Link} from 'react-router-dom';
import style from './TopMenu.module.css'

const TopMenu = () => {
  return (
    <div className={style.head}>
      <h2 style={{color: 'white'}}><Link to='/'>DrawBox</Link></h2>
        <Link to='/auth'>Log In</Link>
    </div>
  );
};

export default TopMenu;
