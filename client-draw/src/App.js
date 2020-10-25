import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Col, Layout, Row} from 'antd';
import CanvasComponent from './components/Canvas/CanvasComponent';
import TopMenu from './components/TopMenu/TopMenu';
import ModalBrushMenu from './components/ModalBrushMenu/ModalBrushMenu';
import ClearButton from './components/ClearButton/ClearButton';
import BrushButton from './components/BrushButton/BrushButton';

const {Header, Content, Footer} = Layout;

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Header style={{width: '100%'}}>
            <TopMenu/>
          </Header>
          <Content className="site-layout">
            <Row justify='center'>
              <Col>
                <CanvasComponent/>
                <ModalBrushMenu/>
                <BrushButton/>
                <ClearButton/>
              </Col>
            </Row>
          </Content>
          <Footer style={{textAlign: 'center'}}>Footer</Footer>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App;
