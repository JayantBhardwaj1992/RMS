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

class Add extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
    this.onTextChange = this.onTextChange.bind(this)
    this._handleImageChange = this._handleImageChange.bind(this)
    this.getBase64 = this.getBase64.bind(this)
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      RestaurantId: '',
      TaxName: '',
     TaxPercentage:'',
      message: '',
      IsActive: false,
      isError: false,
      Base64Image: '',
      errmessage: ''
    }
  }
  handleInvalidSubmit(event, errors, values) {
 
    this.setState({errors, values});
  }

  componentDidMount() {

  this.setState({
    RestaurantId:this.props.user.RestaurantDetail.ResId
  })
}

  onTextChange (event) {

    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }
  getBase64 (file, cb) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      cb(reader.result)
    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
    }
  }
  _handleImageChange (e) {
    e.preventDefault()

    let reader = new FileReader()
    let file = e.target.files[0]

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      })
    }

    reader.readAsDataURL(file)
  }
  handleSubmit(errors, values) {

    if(errors.length > 0)
    {
      this.setState({errors, values});
    }
  else{
    var date = new Date().getDate()
    var formData = new FormData()
    formData.RestaurantId = this.state.RestaurantId
    formData.TaxName = this.state.TaxName
    formData.TaxPercentage = this.state.TaxPercentage
    formData.IsActive = this.state.IsActive
    formData.token = localStorage.getItem('user_id')
    formData.CreatedBy = this.state.RestaurantId
    formData.CreatedOn = date

  
 
    
        axios.post('/api/tax/add', {formData}).then((res) => {
  
          if (res.data.success) {
            this.props.history.push('/app/tax')
          } else {
            this.setState({
              isError: true,
              errmessage: res.data.message
            })
          }
        }).catch((err) => {
          for (var key in err.response.data.err.errors) {
            this.setState({
              isError: true,
              errmessage:err.response.data.err.errors[key].message
            })
            break;
        }
          console.log(err)
            // on error
        })
     
  
  }   
}
  render () {
    let AlertMessage = null
    if (this.state.isError) {
      AlertMessage = (
        <Alert color='danger' >
          {this.state.errmessage}
        </Alert>
    )
    }

    
    return (
      <Fragment>
        <Row>

          <Col xs='12' md='12'>
            <Card>
              <CardHeader>
                 <strong>Add Tax</strong>
                 {AlertMessage}
               </CardHeader>
              <CardBody>
                 <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.handleSubmit} encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>

                   <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Tax Name</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.TaxName} type='text' id='TaxName' name='TaxName' placeholder='Enter Tax name' onChange={this.onTextChange} required />
                     
                    </Col>
                  </FormGroup>
                  
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Tax Percentage</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.TaxPercentage} type='text' id='TaxPercentage' name='TaxPercentage' placeholder='Enter Tax Percentage' onChange={this.onTextChange} required />
                    
                    </Col>
                  </FormGroup>
               
                  

                

                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>IsActive</Label>
                    </Col>
                    <Col xs='12' md='4'>
                    <CustomInput
                      type="checkbox"
                      id="IsActive"
                     name ="IsActive"
                     value={this.state.IsActive} onChange={this.onTextChange}
                    />
                    </Col>
                  </FormGroup>
                   <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2' />
                    <Col xs='12' md='4'>

                      <Button className='btn  btn-primary'>Submit</Button>
                      <Link className='btn  btn-danger' style={{'marginLeft': '15px'}} to={`/app/restaurants`} >Cancel</Link>
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
      )(Add)
    )
    

