import type { GenerateVisualAssetPayload } from '@/services/types';
import { Button, Card, Form, Input, Select } from 'antd';

interface VisualGenerateFormProps {
  loading?: boolean;
  onSubmit: (values: GenerateVisualAssetPayload) => Promise<void>;
}

const VisualGenerateForm: React.FC<VisualGenerateFormProps> = ({
  loading,
  onSubmit,
}) => {
  return (
    <Card title="生成视觉素材" bordered={false}>
      <Form
        initialValues={{
          provider: 'qwen-image-2.0',
          resolution: '720p',
        }}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          label="Provider"
          name="provider"
          rules={[{ required: true, message: '请选择 provider' }]}
        >
          <Select
            options={[{ label: 'qwen-image-2.0', value: 'qwen-image-2.0' }]}
          />
        </Form.Item>
        <Form.Item
          label="分辨率"
          name="resolution"
          rules={[{ required: true, message: '请选择分辨率' }]}
        >
          <Select
            options={['360p', '480p', '720p', '1080p'].map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </Form.Item>
        <Form.Item label="覆盖 Prompt" name="override_prompt">
          <Input.TextArea
            placeholder="可选。用于临时覆盖镜头默认 Prompt"
            rows={4}
          />
        </Form.Item>
        <Button htmlType="submit" loading={loading} type="primary">
          开始生成
        </Button>
      </Form>
    </Card>
  );
};

export default VisualGenerateForm;
