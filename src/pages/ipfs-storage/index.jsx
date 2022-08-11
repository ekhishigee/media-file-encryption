import { Col, Row } from "antd";
import { UploadForm } from "../../form";

export const IPFSStorage = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Col span={24}>
        <Row justify="center">
          <h1>IPFS storage</h1>
        </Row>
        <UploadForm />
      </Col>
    </Row>
  );
};
