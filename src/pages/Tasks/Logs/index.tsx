import TaskLogViewer from '@/components/TaskLogViewer';
import { getErrorMessage } from '@/services/api/client';
import { getTaskLog } from '@/services/api/tasks';
import type { TaskLog } from '@/services/types';
import { guardNumericRouteParams } from '@/utils/route';
import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, message } from 'antd';
import { useEffect, useState } from 'react';

const TaskLogPage: React.FC = () => {
  const { taskId = '' } = useParams<{ taskId: string }>();
  const [taskLog, setTaskLog] = useState<TaskLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const routeParams = guardNumericRouteParams(
        [[taskId, 'taskId']],
        '/home',
      );
      if (!routeParams) {
        return;
      }
      const [safeTaskId] = routeParams;
      setLoading(true);
      try {
        const data = await getTaskLog(safeTaskId);
        setTaskLog(data);
      } catch (error) {
        message.error(getErrorMessage(error));
        setTaskLog(null);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [taskId]);

  return (
    <PageContainer
      extra={[
        <Button key="back" onClick={() => history.back()}>
          返回上一页
        </Button>,
      ]}
      title="任务日志"
    >
      <div style={{ opacity: loading ? 0.7 : 1 }}>
        <TaskLogViewer taskLog={taskLog} />
      </div>
    </PageContainer>
  );
};

export default TaskLogPage;
