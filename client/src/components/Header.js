import React from 'react';
import 'antd/dist/antd.css';
import { Row, Col } from 'antd';
import { Layout } from 'antd';



const Header = () => {
    const style = {
        background: '#0092ff',
        padding: '8px 0',
        border: '1px solid black'
    };
    const { Header, Footer, Sider, Content } = Layout;
    return (
        <>
            <Layout style={{ height: '100%' }}>
                <Header style={{ color: 'white' }}>Header</Header>
                <Layout>
                    <Sider style={{ background: 'green' }}>Sider</Sider>
                    <Content style={{ background: 'palevioletred' }}>
                        <Row>
                            <Col style={style} span={24}>col</Col>
                        </Row>
                        <Row>
                            <Col span={12}>col-12</Col>
                            <Col span={12}>col-12</Col>
                        </Row>
                        <Row>
                            <Col style={style} span={8}>col-8</Col>
                            <Col style={style} span={8}>col-8</Col>
                            <Col style={style} span={8}>col-8</Col>
                        </Row>
                        <Row>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                        </Row>
                    </Content>
                </Layout>
                <Footer style={{ background: 'violet' }}>Footer</Footer>
            </Layout>

        </>
    )
};

export default Header;



