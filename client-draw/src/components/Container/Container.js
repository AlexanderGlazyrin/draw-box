import React from 'react';
import CanvasComponent from '../Canvas/CanvasComponent';
import {Col, Row} from 'antd';

const Container = () => {
  return (
    <Row justify='center'>
      <Col>
        <CanvasComponent/>
      </Col>
    </Row>
  );
};

export default Container;
