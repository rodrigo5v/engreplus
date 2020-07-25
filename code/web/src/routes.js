import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { PrivateRoutes, PrivateAdmin } from './utils/auth';

import Logon from './pages/Logon';
import Administrator from './pages/Administrator';
import Profile from './pages/Profile';
import ChangeProfile from './pages/ChangeProfile';
import NewWork from './pages/NewWork';
import ChangeWork from './pages/ChangeWork';
import NotFound from './pages/NotFound';

export default function Routes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Logon} />
				<PrivateAdmin path="/admin" exact component={Administrator} />
				<PrivateRoutes path="/profile" exact component={Profile} />
				<PrivateRoutes path="/profile/change" exact component={ChangeProfile} />
				<PrivateRoutes path="/works/new" exact component={NewWork} />
				<PrivateRoutes path="/changework" exact component={ChangeWork} />
				<Route path="*" component={NotFound} />
			</Switch>
		</BrowserRouter>
	);
}
