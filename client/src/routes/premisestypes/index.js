import React from 'react'
import { Route, Switch } from 'react-router-dom'

 import Add from './Add'
import PremisesType from './PremisesType'

  import Edit from './Edit'
  import Detail from './Detail'
const PremisesTypes = ({ match }) => (

  <div className='dashboard-wrapper'>
    <Switch>

       <Route exact path={`${match.url}/`} component={PremisesType} /> 
       <Route exact path={`${match.url}/add`} component={Add} /> 
      <Route exact path={`${match.url}/edit/:_id`} component={Edit} />
      <Route exact path={`${match.url}/detail/:_id`} component={Detail} /> 
      {/* <Redirect to="/error" /> */}

    </Switch>
  </div>
)
export default PremisesTypes
