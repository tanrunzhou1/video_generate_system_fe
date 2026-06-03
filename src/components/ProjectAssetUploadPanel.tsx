import { getErrorMessage } from '@/services/api/client';
import { uploadProjectAsset } from '@/services/api/projects';
import type { UploadedAsset } from '@/services/types';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Button, Card, Form, Space, Typography, Upload, message } from 'antd';
import { useMemo, useState } from 'react';

const { Dragger } = Upload;

export interface ProjectAssetUploadValues {
  character_images?: UploadFile[];
  persona_doc?: UploadFile[];
  script_file?: UploadFile[];
  style_reference?: UploadFile[];
}

interface ProjectAssetUploadPanelProps {
  loading?: boolean;
  onUploaded: (assets: UploadedAsset[]) => Promise<void> | void;
  projectId: string;
  uploadedAssets: UploadedAsset[];
}

const createUploadProps = (maxCount?: number): UploadProps => ({
  beforeUpload: () => false,
  maxCount,
  multiple: maxCount !== 1,
});

const toFile = (fileList?: UploadFile[]) =>
  fileList?.[0]?.originFileObj as File | undefined;

const toFiles = (fileList?: UploadFile[]) =>
  (fileList || [])
    .map((file) => file.originFileObj as File | undefined)
    .filter(Boolean) as File[];

const getFieldStatus = (uploadedAssets: UploadedAsset[], assetType: string) =>
  uploadedAssets.filter((item) => item.asset_type === assetType);

const ProjectAssetUploadPanel: React.FC<ProjectAssetUploadPanelProps> = ({
  loading,
  onUploaded,
  projectId,
  uploadedAssets,
}) => {
  const [form] = Form.useForm<ProjectAssetUploadValues>();
  const [submitting, setSubmitting] = useState(false);

  const fieldSummaries = useMemo(
    () => ({
      character_images: getFieldStatus(uploadedAssets, 'character_image'),
      persona_doc: getFieldStatus(uploadedAssets, 'persona_doc'),
      script_file: getFieldStatus(uploadedAssets, 'script_file'),
      style_reference: getFieldStatus(uploadedAssets, 'style_reference'),
    }),
    [uploadedAssets],
  );

  const handleSubmit = async (values: ProjectAssetUploadValues) => {
    const formData = new FormData();
    const scriptFile = toFile(values.script_file);
    const personaDoc = toFile(values.persona_doc);
    const characterImages = toFiles(values.character_images);
    const styleReference = toFile(values.style_reference);

    if (!scriptFile || !personaDoc || !characterImages.length) {
      message.error('请至少上传剧本、人设文档和一张角色参考图');
      return;
    }

    formData.append('script_file', scriptFile);
    formData.append('persona_doc', personaDoc);
    characterImages.forEach((file) =>
      formData.append('character_images', file),
    );
    if (styleReference) {
      formData.append('style_reference', styleReference);
    }

    setSubmitting(true);
    try {
      const result = await uploadProjectAsset(projectId, formData);
      message.success('素材上传成功');
      form.resetFields();
      await onUploaded(result.uploaded || []);
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card bordered={false} title="素材上传">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          extra="必填，单文件。用于后续剧本解析。"
          label="剧本文件"
          name="script_file"
          rules={[{ required: true, message: '请上传剧本文件' }]}
          valuePropName="fileList"
          getValueFromEvent={(event) => event?.fileList}
        >
          <Dragger {...createUploadProps(1)}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">上传剧本文件</p>
          </Dragger>
        </Form.Item>
        <Form.Item
          extra="必填，单文件。用于角色设定抽取。"
          label="人设文档"
          name="persona_doc"
          rules={[{ required: true, message: '请上传人设文档' }]}
          valuePropName="fileList"
          getValueFromEvent={(event) => event?.fileList}
        >
          <Dragger {...createUploadProps(1)}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">上传人设文档</p>
          </Dragger>
        </Form.Item>
        <Form.Item
          extra="必填，多文件。角色创建时会引用这里上传的 character_image 资产。"
          label="角色参考图"
          name="character_images"
          rules={[{ required: true, message: '请上传至少一张角色参考图' }]}
          valuePropName="fileList"
          getValueFromEvent={(event) => event?.fileList}
        >
          <Dragger {...createUploadProps()}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">上传角色参考图</p>
          </Dragger>
        </Form.Item>
        <Form.Item
          extra="选填，单文件。用于统一风格方向。"
          label="风格参考图"
          name="style_reference"
          valuePropName="fileList"
          getValueFromEvent={(event) => event?.fileList}
        >
          <Dragger {...createUploadProps(1)}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">上传风格参考图</p>
          </Dragger>
        </Form.Item>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Typography.Text type="secondary">
            已上传资产会在提交成功后显示在下方，帮助确认文件已入库。
          </Typography.Text>
          <Button
            htmlType="submit"
            loading={loading || submitting}
            type="primary"
          >
            提交全部素材
          </Button>
        </Space>
      </Form>

      <div style={{ marginTop: 24 }}>
        <Typography.Title level={5}>本次项目已上传结果</Typography.Title>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {Object.entries(fieldSummaries).map(([key, items]) => (
            <div key={key}>
              <Typography.Text strong>{key}</Typography.Text>
              <div>
                {items.length
                  ? items
                      .map(
                        (item) =>
                          `${item.asset_id ?? '-'} · ${item.file_path || '-'}`,
                      )
                      .join(' / ')
                  : '暂无'}
              </div>
            </div>
          ))}
        </Space>
      </div>
    </Card>
  );
};

export default ProjectAssetUploadPanel;
