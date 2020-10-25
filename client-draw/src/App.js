import React from 'react';
import Container from './components/Container/Container';
import {BrowserRouter} from 'react-router-dom';
import {Layout} from 'antd';
const {Header, Content, Footer} = Layout;

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout style={{backgroundColor: 'grey'}}>
          <Header>Header</Header>
          <Content style={{height: '100vh'}}>
            <Container/>
          </Content>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App;
