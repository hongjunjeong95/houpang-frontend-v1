import NotFoundPage from '@pages/404';
import HomePage from '@pages/home';
import IntroPage from '@pages/intro';
import ItemIndexPage from '@pages/items';
import ItemShowPage from '@pages/items/show';
import PostIndexPage from '@pages/posts/index';
import PostShowPage from '@pages/posts/show';
import PostNewPage from '@pages/posts/new';
import PostEditPage from '@pages/posts/edit';
import MyPage from '@pages/mypage';
import SignUpPage from '@pages/users/signUp';
import LoginPage from '@pages/users/signIn';
import { Router } from 'framework7/types';

import UserService from '@service/users/users.service';

const usersService = new UserService();

const routes: Router.RouteParameters[] = [
  { path: '/', component: HomePage },
  {
    path: '/users/sign_up',
    component: SignUpPage,
  },
  {
    path: '/users/sign_in',
    component: LoginPage,
    options: {
      props: {
        usersService,
      },
    },
  },
  {
    path: '/intro', //
    component: IntroPage,
    options: { props: { usersService } },
  },
  { path: '/mypage', component: MyPage },
  { path: '/items', component: ItemIndexPage },
  { path: '/items/:id', component: ItemShowPage },
  { path: '/posts', component: PostIndexPage },
  { path: '/posts/new', component: PostNewPage },
  { path: '/posts/:id', component: PostShowPage },
  { path: '/posts/:id/edit', component: PostEditPage },
  { path: '(.*)', component: NotFoundPage },
];

export default routes;
