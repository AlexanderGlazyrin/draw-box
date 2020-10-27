import React from 'react';
import {Link} from 'react-router-dom';
import style from './TopMenu.module.css'
import {useDispatch, useSelector} from 'react-redux';
import {removeUser} from '../../redux/action-creators';

const TopMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.profile)

  const logout = () => {
    dispatch(removeUser());
    localStorage.clear();
  }

  return (
    <React.Fragment>
      <div className={style.head}>
        <h2 style={{color: 'white'}}><Link to='/'>DrawBox</Link></h2>
        {user ?
          <Link to='#' onClick={logout}>Log Out</Link> :
          <Link to='/auth'>Log In</Link>}
      </div>
    </React.Fragment>
  );
};

export default TopMenu;
