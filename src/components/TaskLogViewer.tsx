import type { TaskLog } from '@/services/types';
import { Card, Descriptions, Empty, Typography } from 'antd';

interface TaskLogViewerProps {
  taskLog?: TaskLog | null;
}

const TaskLogViewer: React.FC<TaskLogViewerProps> = ({ taskLog }) => {
  if (!taskLog?.task_id) {
    return (
      <Card title="任务日志" bordered={false}>
        <Empty description="没有找到对应任务日志" />
      </Card>
    );
  }

  return (
    <Card title="任务日志" bordered={false}>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Task ID">{taskLog.task_id}</Descriptions.Item>
        <Descriptions.Item label="项目 ID">
          {taskLog.project_id || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="阶段">
          {taskLog.stage || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          {taskLog.status || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="重试次数">
          {taskLog.retry_count ?? 0}
        </Descriptions.Item>
        <Descriptions.Item label="错误码">
          {taskLog.error_code || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="错误信息" span={2}>
          {taskLog.error_message || '-'}
        </Descriptions.Item>
      </Descriptions>
      <Typography.Paragraph style={{ marginBottom: 8, marginTop: 24 }}>
        原始日志
      </Typography.Paragraph>
      <pre
        style={{
          background: '#0b1220',
          borderRadius: 12,
          color: '#dbe4ff',
          margin: 0,
          maxHeight: 520,
          overflow: 'auto',
          padding: 20,
          whiteSpace: 'pre-wrap',
        }}
      >
        {taskLog.log_content || '暂无日志内容'}
      </pre>
    </Card>
  );
};

export default TaskLogViewer;
