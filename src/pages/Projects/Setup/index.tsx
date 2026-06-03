import LatestTaskCard from '@/components/LatestTaskCard';
import ProjectAssetUploadPanel from '@/components/ProjectAssetUploadPanel';
import ProjectStatusCard from '@/components/ProjectStatusCard';
import { getErrorMessage } from '@/services/api/client';
import { getProject, getProjectStatus } from '@/services/api/projects';
import type { Project, ProjectStatus, UploadedAsset } from '@/services/types';
import { guardNumericRouteParams } from '@/utils/route';
import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Spin,
  message,
} from 'antd';
import { useEffect, useState } from 'react';

const sessionKey = (projectId: string) =>
  `project-uploaded-assets:${projectId}`;

const ProjectSetupPage: React.FC = () => {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project>();
  const [status, setStatus] = useState<ProjectStatus>();
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
  const [loading, setLoading] = useState(true);

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
    const routeParams = guardNumericRouteParams(
      [[projectId, 'projectId']],
      '/projects/new',
    );
    if (!routeParams) {
      return;
    }
    const [safeProjectId] = routeParams;
    const cached = sessionStorage.getItem(sessionKey(safeProjectId));
    if (cached) {
      try {
        setUploadedAssets(JSON.parse(cached));
      } catch {
        setUploadedAssets([]);
      }
    }
  }, [projectId]);

  useEffect(() => {
    void loadData();
  }, [projectId]);

  const handleUploaded = async (assets: UploadedAsset[]) => {
    const routeParams = guardNumericRouteParams(
      [[projectId, 'projectId']],
      '/projects/new',
    );
    if (!routeParams) {
      return;
    }
    const [safeProjectId] = routeParams;
    const mergedAssets = [
      ...uploadedAssets.filter(
        (existing) =>
          !assets.some((asset) => asset.asset_id === existing.asset_id),
      ),
      ...assets,
    ];
    setUploadedAssets(mergedAssets);
    sessionStorage.setItem(
      sessionKey(safeProjectId),
      JSON.stringify(mergedAssets),
    );
    await loadData();
  };

  const isReadyForNextStep =
    (project?.asset_summary?.script_file_count || 0) >= 1 &&
    (project?.asset_summary?.persona_doc_count || 0) >= 1 &&
    (project?.asset_summary?.character_image_count || 0) >= 1;

  return (
    <PageContainer
      content="先上传剧本和角色相关素材，再进入工作台触发剧本解析。"
      extra={[
        <Button
          key="dashboard"
          onClick={() => history.push(`/projects/${projectId}`)}
        >
          前往工作台
        </Button>,
      ]}
      title="项目准备"
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col lg={16} span={24}>
            <Card bordered={false} title="项目信息">
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="项目 ID">
                  {project?.project_id || projectId}
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
          <Col span={24}>
            <ProjectStatusCard status={status} />
          </Col>
          <Col span={24}>
            {isReadyForNextStep ? (
              <Alert
                message="项目素材已满足最小准备条件，可以进入工作台触发剧本解析。"
                showIcon
                type="success"
              />
            ) : (
              <Alert
                message="还需要至少上传 1 份剧本、1 份人设文档和 1 张角色参考图。"
                showIcon
                type="warning"
              />
            )}
          </Col>
          <Col span={24}>
            <ProjectAssetUploadPanel
              onUploaded={handleUploaded}
              projectId={projectId}
              uploadedAssets={uploadedAssets}
            />
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};

export default ProjectSetupPage;
