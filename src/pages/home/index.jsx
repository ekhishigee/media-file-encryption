import { Button, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate()
  
  return (
    <Row
      justify="center"
      align="middle"
      style={{ width: "100vw", height: "100vh", alignContent: "center" }}
    >
      <Col span={24}>
        <Row justify="center">
          <Button type="link" onClick={() => navigate('/aws-s3')}>AWS S3 storage</Button>
        </Row>
      </Col>
      <Col span={24}>
        <Row justify="center">
          <Button type="link" onClick={() => navigate('/ipfs')}>IPFS storage</Button>
        </Row>
      </Col>
    </Row>
  );
};
