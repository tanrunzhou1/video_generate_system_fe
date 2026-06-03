import CharacterFormDrawer, {
  CharacterFormValues,
} from '@/components/CharacterFormDrawer';
import { createCharacter, listCharacters } from '@/services/api/characters';
import { getErrorMessage } from '@/services/api/client';
import { getProject } from '@/services/api/projects';
import type {
  CharacterProfile,
  Project,
  UploadedAsset,
} from '@/services/types';
import { guardNumericRouteParams } from '@/utils/route';
import { PageContainer } from '@ant-design/pro-components';
import { history, Link, useParams } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Empty,
  List,
  message,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';

const sessionKey = (projectId: string) =>
  `project-uploaded-assets:${projectId}`;

const CharacterListPage: React.FC = () => {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project>();
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [assetOptions, setAssetOptions] = useState<UploadedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      const [projectDetail, characterList] = await Promise.all([
        getProject(safeProjectId),
        listCharacters(safeProjectId),
      ]);
      setProject(projectDetail);
      setCharacters(characterList || []);
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
        const assets = JSON.parse(cached) as UploadedAsset[];
        setAssetOptions(
          assets.filter((item) => item.asset_type === 'character_image'),
        );
      } catch {
        setAssetOptions([]);
      }
    }
  }, [projectId]);

  useEffect(() => {
    void loadData();
  }, [projectId]);

  const parseJsonField = (rawValue?: string, fallback?: unknown) => {
    if (!rawValue?.trim()) {
      return fallback;
    }

    return JSON.parse(rawValue);
  };

  const handleCreate = async (values: CharacterFormValues) => {
    const routeParams = guardNumericRouteParams(
      [[projectId, 'projectId']],
      '/projects/new',
    );
    if (!routeParams) {
      return;
    }
    const [safeProjectId] = routeParams;
    setSubmitting(true);
    try {
      await createCharacter(safeProjectId, {
        name: values.name,
        persona_text: values.persona_text,
        prompt_constraints: {
          negative: parseJsonField(values.negative_constraints, []),
          positive: parseJsonField(values.positive_constraints, []),
        },
        reference_image_asset_ids: values.reference_image_asset_ids,
        seed_policy: parseJsonField(values.seed_policy, {}),
        voice_style: values.voice_style,
      });
      message.success('角色创建成功');
      setDrawerOpen(false);
      await loadData();
    } catch (error) {
      message.error(
        error instanceof SyntaxError
          ? '约束 JSON 或 Seed 策略 JSON 格式不正确'
          : getErrorMessage(error),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      content="角色管理页用于查看同项目下的角色列表，并用分区表单完成角色建档。"
      extra={[
        <Button
          key="dashboard"
          onClick={() => history.push(`/projects/${projectId}`)}
        >
          返回工作台
        </Button>,
        <Button key="new" onClick={() => setDrawerOpen(true)} type="primary">
          新建角色
        </Button>,
      ]}
      title={`角色管理 · ${project?.name || projectId}`}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card bordered={false} loading={loading} title="角色列表">
            {characters.length ? (
              <List
                dataSource={characters}
                renderItem={(character) => (
                  <List.Item
                    actions={[
                      <Link
                        key="detail"
                        to={`/projects/${projectId}/characters/${character.character_id}`}
                      >
                        查看详情
                      </Link>,
                    ]}
                  >
                    <List.Item.Meta
                      description={character.persona_text || '暂无人设描述'}
                      title={
                        <Space>
                          <Typography.Text strong>
                            {character.name || '-'}
                          </Typography.Text>
                          {character.voice_style ? (
                            <Tag>{character.voice_style}</Tag>
                          ) : null}
                          {character.reference_image_count !== undefined ? (
                            <Tag>
                              {character.reference_image_count} 张参考图
                            </Tag>
                          ) : null}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="当前项目还没有角色档案" />
            )}
          </Card>
        </Col>
      </Row>
      <CharacterFormDrawer
        assetOptions={assetOptions}
        loading={submitting}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleCreate}
        open={drawerOpen}
      />
    </PageContainer>
  );
};

export default CharacterListPage;
