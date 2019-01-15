import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
//import ExamDetail from '@/components/ExamDetail'
const ExamDetail = () => import('@/components/ExamDetail'); //路由懒加载,
const Announcement = () => import('@/components/Announcement');
const MockData = () => import('@/components/MockData');
const AuthorizationCodeManage = () => import('@/components/AuthorizationCodeManage');
const Setting = () => import('@/components/Setting');
const DownloadControl = () => import('@/components/DownloadControl');
const FormalData = () => import('@/components/FormalData');
const UpDownloadControl = () => import('@/components/UpDownloadControl');
const WrongTopicUpload = () => import('@/components/WrongTopicUpload');
const SetStudentNotice = () => import('@/components/SetStudentNotice');
const test = () => import('@/components/test');

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/ExamDetail',
      name: 'ExamDetail',
      component: ExamDetail
    },
    {
      path: '/Announcement',
      name: 'Announcement',
      component: Announcement
    },{
      path: '/AuthorizationCodeManage',
      name: 'AuthorizationCodeManage',
      component: AuthorizationCodeManage
    },{
      path: '/MockData',
      name: 'MockData',
      component: MockData
    },{
      path: '/Setting',
      name: 'Setting',
      component: Setting
    },{
      path: '/DownloadControl',
      name: 'DownloadControl',
      component: DownloadControl
    },{
      path: '/FormalData',
      name: 'FormalData',
      component: FormalData
    },{
      path: '/UpDownloadControl',
      name: 'UpDownloadControl',
      component: UpDownloadControl
    },{
      path: '/WrongTopicUpload',
      name: 'WrongTopicUpload',
      component: WrongTopicUpload
    },{
      path: '/SetStudentNotice',
      name: 'SetStudentNotice',
      component: SetStudentNotice
    }
  ]
})
