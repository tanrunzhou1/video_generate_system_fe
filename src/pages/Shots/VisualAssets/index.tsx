import VisualAssetGallery from '@/components/VisualAssetGallery';
import VisualGenerateForm from '@/components/VisualGenerateForm';
import { getErrorMessage } from '@/services/api/client';
import {
  generateVisualAsset,
  listVisualAssets,
} from '@/services/api/visual-assets';
import type { GenerateVisualAssetPayload, VisualAsset } from '@/services/types';
import { guardNumericRouteParams } from '@/utils/route';
import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, Col, Row, message } from 'antd';
import { useEffect, useState } from 'react';

const ShotVisualAssetPage: React.FC = () => {
  const { projectId = '', shotId = '' } = useParams<{
    projectId: string;
    shotId: string;
  }>();
  const [assets, setAssets] = useState<VisualAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadAssets = async () => {
    const routeParams = guardNumericRouteParams(
      [
        [projectId, 'projectId'],
        [shotId, 'shotId'],
      ],
      '/projects/new',
    );
    if (!routeParams) {
      return;
    }
    const [safeProjectId, safeShotId] = routeParams;
    setLoading(true);
    try {
      const data = await listVisualAssets(safeProjectId, safeShotId);
      setAssets(data || []);
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAssets();
  }, [projectId, shotId]);

  const handleGenerate = async (values: GenerateVisualAssetPayload) => {
    const routeParams = guardNumericRouteParams(
      [
        [projectId, 'projectId'],
        [shotId, 'shotId'],
      ],
      '/projects/new',
    );
    if (!routeParams) {
      return;
    }
    const [safeProjectId, safeShotId] = routeParams;
    setSubmitting(true);
    try {
      await generateVisualAsset(safeProjectId, safeShotId, values);
      message.success('生成请求已提交，同时已写入任务日志');
      await loadAssets();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      content={`当前项目：${projectId}，当前镜头：${shotId}`}
      extra={[
        <Button
          key="entry"
          onClick={() => history.push(`/projects/${projectId}`)}
        >
          返回项目工作台
        </Button>,
      ]}
      title="镜头视觉素材"
    >
      <Row gutter={[16, 16]}>
        <Col lg={8} span={24}>
          <VisualGenerateForm loading={submitting} onSubmit={handleGenerate} />
        </Col>
        <Col lg={16} span={24}>
          <div style={{ opacity: loading ? 0.7 : 1 }}>
            <VisualAssetGallery assets={assets} />
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ShotVisualAssetPage;
