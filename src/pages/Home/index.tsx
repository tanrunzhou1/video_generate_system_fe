import { PageContainer } from '@ant-design/pro-components';
import { history, Link } from '@umijs/max';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import styles from './index.less';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div>
            <Typography.Text className={styles.kicker}>
              VIDEO GENERATION MVP
            </Typography.Text>
            <Typography.Title className={styles.title}>
              打通从项目创建到镜头视觉生成的最短工作链路
            </Typography.Title>
            <Typography.Paragraph className={styles.summary}>
              当前前端围绕后端已落地能力构建，支持项目列表、项目创建、素材上传、剧本解析、角色档案管理、镜头视觉素材生成和任务日志查看。
            </Typography.Paragraph>
            <Space size={12} wrap>
              <Button onClick={() => history.push('/projects')} size="large">
                浏览项目列表
              </Button>
              <Button
                onClick={() => history.push('/projects/new')}
                size="large"
                type="primary"
              >
                开始创建项目
              </Button>
            </Space>
          </div>
          <div className={styles.statPanel}>
            <Typography.Text className={styles.statLabel}>
              推荐流程
            </Typography.Text>
            <ol className={styles.steps}>
              <li>创建项目</li>
              <li>上传素材</li>
              <li>触发剧本解析</li>
              <li>创建角色</li>
              <li>生成镜头视觉素材</li>
              <li>查看任务日志</li>
            </ol>
          </div>
        </div>
        <Row gutter={[16, 16]}>
          <Col lg={8} span={24}>
            <Card className={styles.featureCard} bordered={false}>
              <Typography.Title level={4}>项目准备页</Typography.Title>
              <Typography.Paragraph>
                集中上传剧本、人物设定图、人物设定文档和风格参考图，并同步查看素材摘要和项目状态。
              </Typography.Paragraph>
              <Link to="/projects">先从项目列表进入</Link>
            </Card>
          </Col>
          <Col lg={8} span={24}>
            <Card className={styles.featureCard} bordered={false}>
              <Typography.Title level={4}>角色工作台</Typography.Title>
              <Typography.Paragraph>
                用分区表单录入角色基础信息、约束提示词、参考图资产 ID 和 seed
                策略。
              </Typography.Paragraph>
            </Card>
          </Col>
          <Col lg={8} span={24}>
            <Card className={styles.featureCard} bordered={false}>
              <Typography.Title level={4}>任务与结果回看</Typography.Title>
              <Typography.Paragraph>
                每个关键动作都保留任务日志入口，便于快速定位失败原因和回看原始执行内容。
              </Typography.Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default HomePage;
