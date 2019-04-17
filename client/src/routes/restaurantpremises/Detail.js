import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import {
  Row,
  Card,
  CardBody,
  Col,
  FormGroup,
  Label,
   Alert,
  CardHeader
} from 'reactstrap'
import { AvForm } from 'availity-reactstrap-validation'
import { connect } from 'react-redux';
import 'chartjs-plugin-datalabels'
import 'react-circular-progressbar/dist/styles.css'
import axios from 'axios'


class Detail extends Component {
  constructor (props) {
    super(props)
   
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      RestaurantId: '',
      PremisesType: '',
      message: '',
      IsActive: false,
      isError: false,
      Base64Image: '',
      errmessage: '',
      isLoading: false,
      PremisesType: '',
      isLoading: false,
      CreatedBy: '',
      Floor: '',
      Capacity: '',
      Tables: 0,
      selectedOption: '',
      TableDetails: [],
      pTableDetails: [],
      pindex: 0,
      RestaurantPremisesName :''
    }
  }
  

  componentDidMount() {

  this.setState({
    RestaurantId:this.props.user.RestaurantDetail.ResId
  })

  var RestaurantId = this.props.user.RestaurantDetail.ResId
  const _id = this.props.match.params._id

  axios.get('/api/restaurantpremises/list/' + _id + '/' + RestaurantId, {token: localStorage.getItem('user_id')}).then((res) => {
   debugger
  if (res.data.success) {
   debugger
      this.setState({
          _id: this.props.match.params._id,
          RestaurantId: this.props.user.RestaurantDetail.ResId,
          RestaurantPremisesName : res.data.Data.RestaurantPremisesName,
          PremisesType:   res.data.Data.PremisiveTypeId.PremisesType,
          Floor:res.data.Data.Floor,
          Capacity:res.data.Data.Capacity,
          Tables:res.data.Data.Tables,
          isLoading: true,
          TableDetails:res.data.Data.TableDetails,
          IsActive: res.data.Data.PremisiveTypeId.IsActive

        })
  }
}).catch(() => {
  // on error
})
}



  render () {
    if (this.state.isError) {
    }
    var Active =  this.state.IsActive ? "Active":"InActive"
    
    


    return (
      !this.state.isLoading
      ? <div className='loading' /> :
      <Fragment>
        <Row>

          <Col xs='12' md='12'>
            <Card>
              <CardHeader>
                 <strong>Restaurant Premises Detail</strong>
                 <Link className='btn btn btn-primary' style={{'float':'right'}} color='primary' to={`/app/restaurantpremises`} >Back</Link>
               </CardHeader>
              <CardBody>
                 <AvForm  encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>

                 <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'> Premises Name</Label>
                    </Col>
                    <Col md='1'>
                      <Label htmlFor='text-input'>:</Label>
                    </Col>
                    <Col xs='12' md='4'>
                    {this.state.RestaurantPremisesName}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'> Premises Type</Label>
                    </Col>
                    <Col md='1'>
                      <Label htmlFor='text-input'>:</Label>
                    </Col>
                    <Col xs='12' md='4'>
                    {this.state.PremisesType}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'> Floor</Label>
                    </Col>
                    <Col md='1'>
                      <Label htmlFor='text-input'>:</Label>
                    </Col>
                    <Col xs='12' md='4'>
                    {this.state.Floor}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'> Capacity</Label>
                    </Col>
                    <Col md='1'>
                      <Label htmlFor='text-input'>:</Label>
                    </Col>
                    <Col xs='12' md='4'>
                    {this.state.Capacity}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'> Total Tables</Label>
                    </Col>
                    <Col md='1'>
                      <Label htmlFor='text-input'>:</Label>
                    </Col>
                    <Col xs='12' md='4'>
                    {this.state.Tables}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'> Table Details</Label>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col className='col-md-3' />
                   
                    <Col xs='12' md='5'>
                    <table className='table table-bordered table-hover'>
                      <thead>
                        <th style={{'textAlign': 'center'}}>
                        Table Name
                        </th>
                        <th style={{'textAlign': 'center'}}>
                        Person Capacity
                        </th>
                      </thead>
                      <tbody>

                      
                    {this.state.TableDetails.map((t) =>{
                     
                       return (<tr><td style={{'textAlign': 'center'}} >{t.TableName}</td><td style={{'textAlign': 'center'}} >{t.PersonCapicity}</td></tr>)
                    
                      
                    })}
                    </tbody>
                    </table>
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
    

