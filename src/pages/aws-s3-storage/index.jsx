import { Col, Row } from "antd";
import { UploadForm } from "../../form";

export const AWSS3Storage = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Col span={24}>
        <Row justify="center">
          <h1>AWS S3 storage</h1>
        </Row>
        <UploadForm />
      </Col>
    </Row>
  );
};
