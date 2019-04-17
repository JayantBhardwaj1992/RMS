import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import {
  Row,
  Card,
  CardBody,
  CustomInput,
  Col,
  FormGroup,
  Label,
   Alert,
  Button,
  CardHeader
} from 'reactstrap'
import { AvForm, AvField } from 'availity-reactstrap-validation'
import { connect } from 'react-redux';
import 'chartjs-plugin-datalabels'
import 'react-circular-progressbar/dist/styles.css'
import axios from 'axios'

import profileStatusData from 'Data/dashboard.profile.status.json'

class Detail extends Component {
  constructor (props) {
    super(props)
 
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      RestaurantId: '',
      TaxName: '',
      TaxPercentage: '',
      message: '',
      IsActive: false,
      isError: false,
      Base64Image: '',
      errmessage: ''
    }
  }
  
  componentDidMount() {

  this.setState({
    RestaurantId:this.props.user.RestaurantDetail.ResId
  })

  var RestaurantId = this.props.user.RestaurantDetail.ResId
  const _id = this.props.match.params._id

  axios.get('/api/tax/list/' + _id + '/' + RestaurantId, {token: localStorage.getItem('user_id')}).then((res) => {

  if (res.data.success) {
   
      this.setState({
          _id: this.props.match.params._id,
          RestaurantId: res.data.Tax.RestaurantId,
          TaxName: res.data.Tax.TaxName,
          TaxPercentage: res.data.Tax.TaxPercentage,
          IsActive: res.data.Tax.IsActive

        })
  }
}).catch(() => {
  // on error
})
}



  
  render () {
    var Active =  this.state.IsActive ? "Active":"InActive"
    
    
    return (
      <Fragment>
        <Row>

          <Col xs='12' md='12'>
            <Card>
              <CardHeader>
                 <strong>Edit Tax</strong>
                 <Link className='btn btn btn-primary' style={{'float':'right'}} color='primary' to={`/app/tax`} >Back</Link>
               </CardHeader>
              <CardBody>
              <AvForm encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>

<FormGroup row>
 <Col className='col-md-3' />
 <Col md='2'>
   <Label htmlFor='text-input'>Tax Name</Label>
 </Col>
 <Col md='1'>
                      <Label htmlFor='text-input'>:</Label>
                    </Col>
 <Col xs='12' md='4'>
 {this.state.TaxName}
 </Col>
</FormGroup>

<FormGroup row>
 <Col className='col-md-3' />
 <Col md='2'>
   <Label htmlFor='text-input'>Tax Percentage</Label>
 </Col>
 <Col md='1'>
                      <Label htmlFor='text-input'>:</Label>
                    </Col>
 <Col xs='12' md='4'>
 {this.state.TaxPercentage}
 </Col>
</FormGroup>





<FormGroup row>
 <Col className='col-md-3' />
 <Col md='2'>
   <Label htmlFor='text-input'>IsActive</Label>
 </Col>
 <Col md='1'>
                      <Label htmlFor='text-input'>:</Label>
                    </Col>
 <Col xs='12' md='4'>
{Active}
 </Col>
</FormGroup>


</AvForm>
               </CardBody>

            </Card>
          </Col>

        </Row>
      </Fragment>
    )
  }
}


const mapStateToProps = ({  authUser }) => {

      const { user } = authUser
      return {
      
        user
      }
    };
    export default withRouter(
      connect(
        mapStateToProps
      )(Detail)
    )
    

