import LatestTaskCard from '@/components/LatestTaskCard';
import ProjectStatusCard from '@/components/ProjectStatusCard';
import { getErrorMessage } from '@/services/api/client';
import {
  getProject,
  getProjectStatus,
  parseProjectScript,
} from '@/services/api/projects';
import type {
  ParseScriptResult,
  Project,
  ProjectStatus,
} from '@/services/types';
import { formatBeijingDateTime } from '@/utils/datetime';
import { guardNumericRouteParams } from '@/utils/route';
import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Result,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from 'antd';
import { useEffect, useState } from 'react';

const ProjectDashboardPage: React.FC = () => {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [project, setProject] = useState<Project>();
  const [status, setStatus] = useState<ProjectStatus>();
  const [parseResult, setParseResult] = useState<ParseScriptResult>();
  const [shotForm] = Form.useForm<{ shotId: string }>();

  const loadData = async () => {
    const routeParams = guardNumericRouteParams(
      [[projectId, 'projectId']],
      '/projects/new',
    );
    if (!routeParams) {
      return;
    }
    const [safeProjectId] = routeParams;

    setLoading(true);
    try {
      const [projectDetail, projectStatus] = await Promise.all([
        getProject(safeProjectId),
        getProjectStatus(safeProjectId),
      ]);
      setProject(projectDetail);
      setStatus(projectStatus);
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [projectId]);

  const handleParse = async () => {
    const routeParams = guardNumericRouteParams(
      [[projectId, 'projectId']],
      '/projects/new',
    );
    if (!routeParams) {
      return;
    }
    const [safeProjectId] = routeParams;
    setParsing(true);
    try {
      const result = await parseProjectScript(safeProjectId);
      setParseResult(result);
      message.success('已触发剧本解析');
      await loadData();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setParsing(false);
    }
  };

  return (
    <PageContainer
      content="工作台聚合项目详情、当前状态和最近任务，并提供剧本解析触发入口。"
      extra={[
        <Button
          key="setup"
          onClick={() => history.push(`/projects/${projectId}/setup`)}
        >
          返回准备页
        </Button>,
        <Button
          key="characters"
          onClick={() => history.push(`/projects/${projectId}/characters`)}
          type="primary"
        >
          角色管理
        </Button>,
      ]}
      title="项目工作台"
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col lg={16} span={24}>
            <Card
              bordered={false}
              extra={
                <Space>
                  <Button
                    loading={parsing}
                    onClick={handleParse}
                    type="primary"
                  >
                    触发剧本解析
                  </Button>
                </Space>
              }
              title="项目详情"
            >
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="项目 ID">
                  {project?.project_id || projectId}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  {project?.status || status?.status || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="名称">
                  {project?.name || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="风格预设">
                  {project?.style_preset || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="目标时长">
                  {project?.target_duration_sec || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {formatBeijingDateTime(
                    project?.updated_at || status?.updated_at,
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="描述" span={2}>
                  {project?.description || '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col lg={8} span={24}>
            <LatestTaskCard
              task={project?.latest_task || status?.latest_task}
            />
          </Col>
          <Col lg={12} span={24}>
            <ProjectStatusCard status={status} />
          </Col>
          <Col lg={12} span={24}>
            {parseResult?.task_id ? (
              <Result
                extra={[
                  <Button
                    key="logs"
                    onClick={() =>
                      history.push(`/tasks/${parseResult.task_id}/logs`)
                    }
                  >
                    查看解析日志
                  </Button>,
                ]}
                status="success"
                subTitle={
                  <Space direction="vertical">
                    <Typography.Text>
                      Task ID: {parseResult.task_id}
                    </Typography.Text>
                    <Typography.Text>
                      Status: {parseResult.status || '-'}
                    </Typography.Text>
                    <Typography.Text>
                      Workflow: {parseResult.workflow_status || '-'}
                    </Typography.Text>
                    <Typography.Text>
                      Shot Count: {parseResult.shot_count ?? '-'}
                    </Typography.Text>
                  </Space>
                }
                title="剧本解析已触发"
              />
            ) : (
              <Card bordered={false} title="解析结果">
                <Typography.Text type="secondary">
                  触发剧本解析后，这里会展示任务 ID、工作流状态和镜头数量。
                </Typography.Text>
              </Card>
            )}
          </Col>
          <Col span={24}>
            <Card bordered={false} title="单镜头视觉素材入口">
              <Typography.Paragraph type="secondary">
                当前后端还没有镜头列表接口。拿到 `shot_id`
                后，可以直接从这里跳转到单镜头视觉素材页。
              </Typography.Paragraph>
              <Form
                form={shotForm}
                layout="inline"
                onFinish={(values) =>
                  /^\d+$/.test(values.shotId)
                    ? history.push(
                        `/projects/${projectId}/shots/${values.shotId}/visual-assets`,
                      )
                    : message.error('shot_id 必须是数字 ID')
                }
              >
                <Form.Item
                  name="shotId"
                  rules={[
                    { required: true, message: '请输入 shot_id' },
                    { pattern: /^\d+$/, message: 'shot_id 必须是数字 ID' },
                  ]}
                >
                  <Input placeholder="例如：5" />
                </Form.Item>
                <Button htmlType="submit" type="primary">
                  前往视觉素材页
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};

export default ProjectDashboardPage;
