import { getErrorMessage } from '@/services/api/client';
import { listProjects } from '@/services/api/projects';
import type { ProjectListItem } from '@/services/types';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Card, Space, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useState } from 'react';

const STATUS_COLORS: Record<string, string> = {
  created: 'default',
  failed: 'error',
  running: 'processing',
  succeeded: 'success',
};

const ProjectListPage: React.FC = () => {
  const [items, setItems] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadData = async (nextPage = 1, nextPageSize = 10) => {
    setLoading(true);
    try {
      const result = await listProjects({
        page: nextPage,
        page_size: nextPageSize,
      });
      setItems(result.items || []);
      setPagination({
        current: result.page,
        pageSize: result.page_size,
        total: result.total,
      });
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const columns: ColumnsType<ProjectListItem> = [
    {
      title: '项目名称',
      dataIndex: 'name',
      render: (_, record) => (
        <Button
          onClick={() => history.push(`/projects/${record.project_id}`)}
          type="link"
        >
          {record.name || '-'}
        </Button>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (value: string | undefined) => (
        <Tag color={STATUS_COLORS[value || ''] || 'default'}>
          {value || 'unknown'}
        </Tag>
      ),
    },
    {
      title: '目标时长',
      dataIndex: 'target_duration_sec',
      render: (value: number | undefined) => (value ? `${value} 秒` : '-'),
    },
    {
      title: '风格预设',
      dataIndex: 'style_preset',
      render: (value: string | null | undefined) => value || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: (value: string | undefined) => value || '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      render: (value: string | undefined) => value || '-',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space size={4} wrap>
          <Button
            onClick={() => history.push(`/projects/${record.project_id}`)}
            size="small"
            type="link"
          >
            工作台
          </Button>
          <Button
            onClick={() => history.push(`/projects/${record.project_id}/setup`)}
            size="small"
            type="link"
          >
            准备页
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      content="分页查看历史项目，按创建时间倒序浏览，并快速进入项目工作台或准备页。"
      extra={[
        <Button key="home" onClick={() => history.push('/home')}>
          产品概览
        </Button>,
        <Button
          key="new"
          onClick={() => history.push('/projects/new')}
          type="primary"
        >
          新建项目
        </Button>,
      ]}
      title="项目列表"
    >
      <Card bordered={false}>
        <Space
          direction="vertical"
          size={16}
          style={{ marginBottom: 16, width: '100%' }}
        >
          <Typography.Text type="secondary">
            当前只支持基础分页，不支持搜索、筛选和排序切换。
          </Typography.Text>
        </Space>
        <Table<ProjectListItem>
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={pagination}
          rowKey={(record) => String(record.project_id)}
          onChange={(nextPagination) => {
            void loadData(nextPagination.current, nextPagination.pageSize);
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default ProjectListPage;
