import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';

import TopNav from 'Containers/TopNav'
import Sidebar from 'Containers/Sidebar';

import dashboards from './dashboards';
import layouts from './layouts';
import applications from './applications';
import ui from './ui';
import Restaurants from './restaurants'
import Categories from  './category'
import Items from './items'
import { connect } from 'react-redux';
import Taxs from './tax'
import PremisesType from './premisestypes'
import Roles from './roles'
import RestaurantPremises from './restaurantpremises'
import RestaurantUsers from './restaurantusers'
class MainApp extends Component {
	render() {
		const { match, containerClassnames} = this.props;
		return (
			<div id="app-container" className={containerClassnames}>
				<TopNav history={this.props.history} />
				<Sidebar/>
				<main>
					<div className="container-fluid">
						<Switch>
							<Route path={`${match.url}/applications`} component={applications} />
							<Route path={`${match.url}/dashboards`} component={dashboards} />
							<Route path={`${match.url}/restaurants`} component={Restaurants} />
							<Route path={`${match.url}/category`} component={Categories} />
							<Route path={`${match.url}/tax`} component={Taxs} />
							<Route path={`${match.url}/items`} component={Items} />
							<Route path={`${match.url}/layouts`} component={layouts} />
							<Route path={`${match.url}/ui`} component={ui} />
							<Route path={`${match.url}/premisestype`} component={PremisesType} />
							<Route path={`${match.url}/restaurantpremises`} component={RestaurantPremises} />
							<Route path={`${match.url}/role`} component={Roles} />
							<Route path={`${match.url}/restaurantusers`} component={RestaurantUsers} />
							{/* <Redirect to="/error" /> */}
						</Switch>
					</div>
				</main>
			</div>
		);
	}
}
const mapStateToProps = ({ menu }) => {
	const { containerClassnames} = menu;
	return { containerClassnames };
  }
  
export default withRouter(connect(mapStateToProps, {})(MainApp));