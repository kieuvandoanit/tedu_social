import "dotenv/config";

import { IndexRoute } from '@modules/index';
import UserRoute from '@modules/users/user.route';
import {validateEnv} from '@core/utils';
import App from './app';

validateEnv();

const routes = [
    new IndexRoute(),
    new UserRoute(),    
];

const app = new App(routes);

app.listen();