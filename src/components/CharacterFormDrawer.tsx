import CharacterConstraintEditor from '@/components/CharacterConstraintEditor';
import type { UploadedAsset } from '@/services/types';
import { Button, Drawer, Form, Input, Select, Space, Typography } from 'antd';

export interface CharacterFormValues {
  name: string;
  negative_constraints?: string;
  persona_text: string;
  positive_constraints?: string;
  reference_image_asset_ids?: number[];
  seed_policy?: string;
  voice_style?: string;
}

interface CharacterFormDrawerProps {
  assetOptions: UploadedAsset[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: CharacterFormValues) => Promise<void>;
  open: boolean;
}

const CharacterFormDrawer: React.FC<CharacterFormDrawerProps> = ({
  assetOptions,
  loading,
  onClose,
  onSubmit,
  open,
}) => {
  const [form] = Form.useForm<CharacterFormValues>();

  return (
    <Drawer
      destroyOnHidden
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button
            loading={loading}
            onClick={() => form.submit()}
            type="primary"
          >
            创建角色
          </Button>
        </Space>
      }
      onClose={onClose}
      open={open}
      title="新建角色档案"
      width={520}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} preserve={false}>
        <Form.Item
          label="角色名称"
          name="name"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="例如：女主角 Lin" />
        </Form.Item>
        <Form.Item
          label="人设文本"
          name="persona_text"
          rules={[{ required: true, message: '请输入人设文本' }]}
        >
          <Input.TextArea
            placeholder="描述角色外貌、性格、身份、年龄层和画面特征"
            rows={5}
          />
        </Form.Item>
        <Form.Item label="音色风格" name="voice_style">
          <Input placeholder="例如：young_female_calm" />
        </Form.Item>
        <Form.Item
          extra="优先从项目已上传的 character_image 资产中选择。"
          label="参考图选择"
          name="reference_image_asset_ids"
          rules={[{ required: true, message: '请选择至少一个参考图资产' }]}
        >
          <Select
            mode="multiple"
            options={assetOptions.map((item) => ({
              label: `${item.asset_id} · ${item.file_path}`,
              value: item.asset_id,
            }))}
            placeholder="选择参考图资产"
          />
        </Form.Item>
        <CharacterConstraintEditor />
        <Form.Item
          extra='输入 JSON，例如 {"mode":"fixed","seed":123456}'
          label="Seed 策略"
          name="seed_policy"
          rules={[{ required: true, message: '请输入 seed 策略 JSON' }]}
        >
          <Input.TextArea
            placeholder='{"mode":"fixed","seed":123456}'
            rows={4}
          />
        </Form.Item>
        {!assetOptions.length ? (
          <Typography.Text type="warning">
            当前没有可选的角色参考图资产，请先回到项目准备页上传角色图片。
          </Typography.Text>
        ) : null}
      </Form>
    </Drawer>
  );
};

export default CharacterFormDrawer;
