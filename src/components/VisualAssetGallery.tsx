import type { VisualAsset } from '@/services/types';
import { Card, Col, Empty, Row, Space, Tag, Typography } from 'antd';

interface VisualAssetGalleryProps {
  assets: VisualAsset[];
}

const VisualAssetGallery: React.FC<VisualAssetGalleryProps> = ({ assets }) => {
  if (!assets.length) {
    return (
      <Card title="素材列表" bordered={false}>
        <Empty description="当前镜头还没有视觉素材" />
      </Card>
    );
  }

  return (
    <Card title="素材列表" bordered={false}>
      <Row gutter={[16, 16]}>
        {assets.map((asset) => (
          <Col key={asset.asset_id || asset.file_path} lg={8} md={12} span={24}>
            <Card>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Space wrap>
                  <Tag>{asset.provider || '-'}</Tag>
                  <Tag>{asset.resolution || '-'}</Tag>
                  {asset.is_selected ? <Tag color="success">已选中</Tag> : null}
                </Space>
                <Typography.Text>
                  预览占位：当前后端还没有静态资源访问 URL
                </Typography.Text>
                <Typography.Text type="secondary">
                  Prompt：{asset.prompt_used || '-'}
                </Typography.Text>
                <Typography.Text type="secondary">
                  Seed：{asset.seed || '-'}
                </Typography.Text>
                <Typography.Text type="secondary">
                  文件：{asset.file_path || '-'}
                </Typography.Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default VisualAssetGallery;
