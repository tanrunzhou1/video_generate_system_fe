import type { ProjectStatus } from '@/services/types';
import { formatBeijingDateTime } from '@/utils/datetime';
import { Card, Col, Progress, Row, Space, Tag, Typography } from 'antd';

const STATUS_COLORS: Record<string, string> = {
  created: 'default',
  failed: 'error',
  running: 'processing',
  succeeded: 'success',
};

interface ProjectStatusCardProps {
  status?: ProjectStatus;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({ status }) => {
  const currentStatus = status?.status || 'unknown';

  return (
    <Card title="项目状态" bordered={false}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Typography.Text type="secondary">总体状态</Typography.Text>
            <div>
              <Tag color={STATUS_COLORS[currentStatus] || 'default'}>
                {currentStatus}
              </Tag>
            </div>
          </Col>
          <Col span={12}>
            <Typography.Text type="secondary">当前阶段</Typography.Text>
            <div>{status?.current_stage || '-'}</div>
          </Col>
          <Col span={12}>
            <Typography.Text type="secondary">重试次数</Typography.Text>
            <div>{status?.retry_count ?? 0}</div>
          </Col>
          <Col span={12}>
            <Typography.Text type="secondary">最近更新时间</Typography.Text>
            <div>{formatBeijingDateTime(status?.updated_at)}</div>
          </Col>
        </Row>
        <div>
          <Typography.Text type="secondary">进度</Typography.Text>
          <Progress percent={Math.round((status?.progress ?? 0) * 100)} />
        </div>
        {status?.last_error_message ? (
          <Typography.Text type="danger">
            最近错误：{status.last_error_message}
          </Typography.Text>
        ) : null}
      </Space>
    </Card>
  );
};

export default ProjectStatusCard;
