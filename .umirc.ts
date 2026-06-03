import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'AI Video Studio',
  },
  routes: [
    {
      path: '/',
      redirect: '/projects',
    },
    {
      path: '/home',
      redirect: '/projects',
    },
    {
      name: '项目列表',
      path: '/projects',
      component: './Projects/List',
    },
    {
      name: '新建项目',
      path: '/projects/new',
      component: './Projects/New',
    },
    {
      name: '项目准备',
      path: '/projects/:projectId/setup',
      component: './Projects/Setup',
      hideInMenu: true,
    },
    {
      name: '项目工作台',
      path: '/projects/:projectId',
      component: './Projects/Dashboard',
      hideInMenu: true,
    },
    {
      name: '角色管理',
      path: '/projects/:projectId/characters',
      component: './Characters/List',
      hideInMenu: true,
    },
    {
      name: '角色详情',
      path: '/projects/:projectId/characters/:characterId',
      component: './Characters/Detail',
      hideInMenu: true,
    },
    {
      name: '视觉素材',
      path: '/projects/:projectId/shots/:shotId/visual-assets',
      component: './Shots/VisualAssets',
      hideInMenu: true,
    },
    {
      name: '任务日志',
      path: '/tasks/:taskId/logs',
      component: './Tasks/Logs',
      hideInMenu: true,
    },
  ],
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
  npmClient: 'pnpm',
  utoopack: {},
});
