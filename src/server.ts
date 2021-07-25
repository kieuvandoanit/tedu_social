import "dotenv/config";

import { IndexRoute } from '@modules/index';
import UserRoute from '@modules/users/user.route';
import {validateEnv} from '@core/utils';
import App from './app';
import AuthRoute from "@modules/auth/auth.route";
import ProfileRoute from "@modules/profile/profile.route";
import PostsRoute from "@modules/posts/posts.route";
import GroupRoute from "@modules/groups/groups.route";
import ConversationRoute from "@modules/conversations/conversations.route";

validateEnv();

const routes = [
    new IndexRoute(),
    new UserRoute(),
    new AuthRoute(),
    new ProfileRoute(),
    new PostsRoute(),
    new GroupRoute(),
    new ConversationRoute(),
];

const app = new App(routes);

app.listen();