import type { TaskSummary } from '@/services/types';
import { history } from '@umijs/max';
import { Button, Card, Empty, Space, Tag, Typography } from 'antd';

interface LatestTaskCardProps {
  task?: TaskSummary;
}

const LatestTaskCard: React.FC<LatestTaskCardProps> = ({ task }) => {
  if (!task?.task_id) {
    return (
      <Card title="最近任务" bordered={false}>
        <Empty description="当前还没有任务记录" />
      </Card>
    );
  }

  return (
    <Card title="最近任务" bordered={false}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <div>
          <Typography.Text type="secondary">Task ID</Typography.Text>
          <div>{task.task_id}</div>
        </div>
        <div>
          <Typography.Text type="secondary">阶段</Typography.Text>
          <div>{task.stage || '-'}</div>
        </div>
        <div>
          <Typography.Text type="secondary">状态</Typography.Text>
          <div>
            <Tag
              color={
                task.status === 'failed'
                  ? 'error'
                  : task.status === 'succeeded'
                  ? 'success'
                  : 'processing'
              }
            >
              {task.status || 'unknown'}
            </Tag>
          </div>
        </div>
        <div>
          <Typography.Text type="secondary">重试次数</Typography.Text>
          <div>{task.retry_count ?? 0}</div>
        </div>
        {task.error_message ? (
          <Typography.Text type="danger">
            错误信息：{task.error_message}
          </Typography.Text>
        ) : null}
        <Button
          onClick={() => history.push(`/tasks/${task.task_id}/logs`)}
          type="primary"
        >
          查看日志
        </Button>
      </Space>
    </Card>
  );
};

export default LatestTaskCard;
