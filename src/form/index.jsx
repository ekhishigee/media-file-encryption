import { Button, Col, Form, Image, Row, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getFileFromS3, uploadToS3 } from "../helpers/aws.helper";
import { useState } from "react";

export const UploadForm = () => {
  const [fileUrl, setFileUrl] = useState();
  const [fileType, setFileType] = useState();
  const [blobUrl, setBlobUrl] = useState();
  const uploadFile = async ({ file }) => {
    if (file?.length > 0) {
      const { url, type } = await uploadToS3(file[0]);
      console.log(url, type);
      setFileUrl(url);
      setFileType(type);
    }
  };
  const getFile = async () => {
    const { payload } = await getFileFromS3(fileUrl, fileType);
    console.log(payload);
    setBlobUrl(payload);
  };
  return (
    <Row justify="center" style={{ padding: 40 }}>
      <Col span={16}>
        <Row justify="center">
          <Col span={8}>
            <Form onFinish={uploadFile}>
              <Form.Item
                label="Upload file"
                name="file"
                valuePropName="fileList"
                getValueFromEvent={({ file, fileList }) => fileList}
                rules={[
                  {
                    required: true,
                    message: "Choose file",
                  },
                ]}
              >
                <Upload listType="picture-card">
                  <div>
                    <PlusOutlined />
                    <div className="ant-upload-text">アップロード</div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Upload
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
      <Col span={22}>
        {fileUrl && fileType && (
          <Button type="primary" onClick={getFile}>
            Get file
          </Button>
        )}
        {blobUrl?.length > 0 &&
          (["image/jpeg", "image/png"].includes(fileType) ? (
            <Image src={blobUrl} width="200" />
          ) : (
            <video src={blobUrl} width="200" controls />
          ))}
      </Col>
    </Row>
  );
};
