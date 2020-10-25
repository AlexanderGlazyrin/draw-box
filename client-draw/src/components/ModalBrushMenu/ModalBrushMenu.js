import React, {useState} from 'react';
import {Slider, Radio, Modal, Row, Col} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {changeColor, changeSize, toggleBrushMenu} from '../../redux/action-creators';
import './ModalBrushMenu.css';

const ModalBrushMenu = () => {
  const {showBrushMenu, colorBrush, sizeBrush} = useSelector(state => state);
  const [options, setOptions] = useState({color: colorBrush, size: sizeBrush});
  const dispatch = useDispatch();

  const handleOk = () => {
    dispatch(toggleBrushMenu());
    dispatch(changeColor(options.color));
    dispatch(changeSize(options.size));
  }

  const handleCancel = () => {
    dispatch(toggleBrushMenu());
  }

  return (
    <Modal
      title="Brush Settings"
      visible={showBrushMenu}
      onOk={handleOk}
      onCancel={handleCancel}
    >

      <Row>
        <Col span={6} offset={1}>
          Brush size:
        </Col>
        <Col span={14}>
          <Slider
            min={1}
            max={40}
            onChange={value => {
              setOptions(prev => ({...prev, size: value}))
            }}
            value={options.size}
          />
        </Col>
        <Col span={2} offset={1}>
          {options.size}
        </Col>
      </Row>
      <Row style={{marginTop: 10}}>
        <Col span={6} offset={1}>
          Brush color:
        </Col>
        <Col>
          <Radio.Group onChange={e => {
            setOptions(prev => ({...prev, color: e.target.value}))}
          } defaultValue="black">
            <Radio.Button value="red" style={{backgroundColor: 'red', color: 'white'}}>Red</Radio.Button>
            <Radio.Button value="green" style={{backgroundColor: 'green', color: 'white'}}>Green</Radio.Button>
            <Radio.Button value="blue" style={{backgroundColor: 'blue', color: 'white'}}>Blue</Radio.Button>
            <Radio.Button value="black" style={{backgroundColor: 'black', color: 'white'}}>Black</Radio.Button>
            <Radio.Button value="white" style={{color: 'black'}}>White</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalBrushMenu;
