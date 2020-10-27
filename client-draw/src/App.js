import React, {useEffect} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Col, Layout, Row} from 'antd';
import CanvasComponent from './components/Canvas/CanvasComponent';
import TopMenu from './components/TopMenu/TopMenu';
import ModalBrushMenu from './components/ModalBrushMenu/ModalBrushMenu';
import ClearButton from './components/ClearButton/ClearButton';
import BrushButton from './components/BrushButton/BrushButton';
import Auth from './components/Auth/Auth';
import {useDispatch} from 'react-redux';
import {checkToken} from './redux/action-creators';

const {Header, Content, Footer} = Layout;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!!localStorage.length) {
      const token = JSON.parse(localStorage.userData).token;
      dispatch(checkToken(token));
    }
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Layout>
            <Header style={{width: '100%'}}>
              <TopMenu/>
            </Header>
            <Content className="site-layout" style={{height: '90vh'}}>
              <Row justify='center'>
                <Col>
                  <Route exact path={'/Auth'}>
                    <Auth/>
                  </Route>
                  <Route exact path={'/'}>
                    <CanvasComponent/>
                    <ModalBrushMenu/>
                    <BrushButton/>
                    <ClearButton/>
                  </Route>
                </Col>
              </Row>
            </Content>
            <Footer style={{textAlign: 'center'}}>Footer</Footer>
          </Layout>
        </Switch>
      </BrowserRouter>
    </>
  )
}

export default App;
