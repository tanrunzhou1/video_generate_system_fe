import { getCharacter } from '@/services/api/characters';
import { getErrorMessage } from '@/services/api/client';
import type { CharacterProfile } from '@/services/types';
import { guardNumericRouteParams } from '@/utils/route';
import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import { useEffect, useState } from 'react';

const formatJsonValue = (input: unknown) => {
  if (input === undefined || input === null) {
    return '-';
  }

  return JSON.stringify(input, null, 2);
};

const CharacterDetailPage: React.FC = () => {
  const { characterId = '', projectId = '' } = useParams<{
    characterId: string;
    projectId: string;
  }>();
  const [character, setCharacter] = useState<CharacterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const routeParams = guardNumericRouteParams(
        [
          [projectId, 'projectId'],
          [characterId, 'characterId'],
        ],
        '/projects/new',
      );
      if (!routeParams) {
        return;
      }
      const [safeProjectId, safeCharacterId] = routeParams;
      setLoading(true);
      try {
        const detail = await getCharacter(safeProjectId, safeCharacterId);
        setCharacter(detail);
      } catch (error) {
        message.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [characterId, projectId]);

  return (
    <PageContainer
      extra={[
        <Button
          key="back"
          onClick={() => history.push(`/projects/${projectId}/characters`)}
        >
          返回角色列表
        </Button>,
      ]}
      title="角色详情"
    >
      <Card bordered={false} loading={loading}>
        {character?.character_id ? (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="角色 ID">
              {character.character_id}
            </Descriptions.Item>
            <Descriptions.Item label="项目 ID">
              {character.project_id || projectId}
            </Descriptions.Item>
            <Descriptions.Item label="角色名称">
              {character.name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="音色风格">
              {character.voice_style || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="参考图列表" span={2}>
              <Space wrap>
                {(character.reference_image_paths || []).length ? (
                  character.reference_image_paths?.map((path) => (
                    <Tag key={path}>{path}</Tag>
                  ))
                ) : (
                  <Typography.Text type="secondary">暂无参考图</Typography.Text>
                )}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="人设文本" span={2}>
              {character.persona_text || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="提示词约束" span={2}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {formatJsonValue(character.prompt_constraints)}
              </pre>
            </Descriptions.Item>
            <Descriptions.Item label="Seed 策略" span={2}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {formatJsonValue(character.seed_policy)}
              </pre>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Empty description="未找到该角色信息" />
        )}
      </Card>
    </PageContainer>
  );
};

export default CharacterDetailPage;
