import { getErrorMessage } from '@/services/api/client';
import { createProject } from '@/services/api/projects';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
} from 'antd';
import { useState } from 'react';

interface CreateProjectFormValues {
  description?: string;
  name: string;
  style_preset?: string;
  target_duration_sec?: number;
}

const stylePresetOptions = [
  { label: '写实电影感', value: 'cinematic-realism' },
  { label: '动画分镜感', value: 'storyboard-anime' },
  { label: '未来科技感', value: 'futuristic-tech' },
];

const ProjectCreatePage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CreateProjectFormValues) => {
    setLoading(true);
    try {
      const project = await createProject(values);
      message.success('项目创建成功，进入项目准备页');
      history.push(`/projects/${project.project_id}/setup`);
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      content="创建项目后，前端会立即进入素材准备阶段，帮助用户按顺序完成初始化。"
      title="项目创建"
    >
      <Card bordered={false}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="项目名称"
            name="name"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="例如：城市夜行短片" />
          </Form.Item>
          <Form.Item label="项目描述" name="description">
            <Input.TextArea
              placeholder="描述剧情方向、视觉风格或主要人物关系"
              rows={5}
            />
          </Form.Item>
          <Form.Item label="风格预设" name="style_preset">
            <Select
              allowClear
              options={stylePresetOptions}
              placeholder="选择整体风格"
            />
          </Form.Item>
          <Form.Item
            label="目标时长（秒）"
            name="target_duration_sec"
            rules={[
              { required: true, message: '请输入目标时长' },
              {
                type: 'number',
                min: 10,
                max: 600,
                message: '目标时长必须在 10 到 600 秒之间',
              },
            ]}
          >
            <InputNumber
              max={600}
              min={10}
              precision={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Space>
            <Button htmlType="submit" loading={loading} type="primary">
              创建并进入准备页
            </Button>
            <Button onClick={() => history.push('/home')}>返回首页</Button>
          </Space>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default ProjectCreatePage;
