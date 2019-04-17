import React, { Component, Fragment } from 'react'
import { injectIntl} from 'react-intl'
import mouseTrap from 'react-mousetrap'
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

import 'chartjs-plugin-datalabels'
import 'react-circular-progressbar/dist/styles.css'
import axios from 'axios'
import {
  visitChartConfig,
  conversionChartConfig,
  lineChartConfig,
  polarChartConfig,
  smallChartData1,
  smallChartData2,
  smallChartData3,
  smallChartData4,
  doughnutChartConfig,
  radarChartConfig
} from 'Constants/chartConfig'

import profileStatusData from 'Data/dashboard.profile.status.json'
import Restaurant from './Restaurant'
const profileStatuses = profileStatusData.data

class Detail extends Component {
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
      RestaurantName: '',
      RestaurantLogo: '',
      ContactPersonName: '',
      ContactPersonEmail: '',
      RestaurantCode:'',
      Password: '',
      Address: '',
      AboutRestaurant: '',
      IsActive:false,
      message: '',
      isError: false,
      Base64Image: '',
      errmessage: '',
      imagePreviewUrl:'',
      _id:'',
      isLoading:false
    }
  }
  handleInvalidSubmit(event, errors, values) {
    this.setState({errors, values});
  }
  componentDidMount () {
    const _id = this.props.match.params._id
    axios.get('/api/restaurants/list/' + _id, {token: localStorage.getItem('user_id')}).then((res) => {
  
    if (res.data.success) {
 
        this.setState({
            _id: this.props.match.params._id,
            RestaurantId: res.data.Restaurant.RestaurantId,
            RestaurantName: res.data.Restaurant.RestaurantName,
            imagePreviewUrl:   res.data.Restaurant.RestaurantLogo,
            AboutRestaurant: res.data.Restaurant.AboutRestaurant,
            ContactPersonName: res.data.Restaurant.ContactPersonName,
            ContactPersonEmail: res.data.Restaurant.ContactPersonEmail,
            IsActive: res.data.Restaurant.IsActive,
            Address: res.data.Restaurant.Address,
            RestaurantCode: res.data.Restaurant.RestaurantCode,
            isLoading: true
          })
    }
  }).catch(() => {
    // on error
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
    formData.RestaurantName = this.state.RestaurantName
    formData.ContactPersonName = this.state.ContactPersonName
    formData.ContactPersonEmail = this.state.ContactPersonEmail
    formData.Address = this.state.Address
    formData.Password = this.state.Password
    formData.imagePreviewUrl = this.state.RestaurantLogo
    formData.RestaurantLogo = this.state.imagePreviewUrl
    formData.AboutRestaurant = this.state.AboutRestaurant
    formData.token = localStorage.getItem('user_id')
    formData.CreatedBy = date
   formData.IsActive = this.state.IsActive

      // const formData = `RestaurantName=${RestaurantName}&RestaurantLogo=${RestaurantLogo}&AboutRestaurant=${AboutRestaurant}&ContactPersonName=${ContactPersonName}&ContactPersonEmail=${ContactPersonEmail}&Address=${Address}&Password=${Password}`
    if (this.state.file) {
      this.getBase64(this.state.file, (result) => {
        formData.RestaurantLogo = result

        axios.put('/api/restaurants/update/'+this.state._id, {formData}).then((res) => {
          if (res.data.success) {
            this.props.history.push('/app/restaurants')
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
      })
    } else {

      axios.put('/api/restaurants/update/'+this.state._id, {formData}).then((res) => {
        if (res.data.success) {
          this.props.history.push('/app/restaurants')
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
}

  render () {

    var Active =  this.state.IsActive ? "Active":"InActive"


    
    let imagePreview = null
    if (this.state._id) {
      var imgsrc = require('../../upload/logo/' + this.state._id +'.'+ this.state.imagePreviewUrl)
   
      imagePreview = (<img src= {imgsrc} alt='No' className='img img-responsive' style={{'height': '100px', 'width': '100px'}} />)
    } else {
      imagePreview = (<div className='previewText'>Please select an Image for Preview</div>)
    }
    return (
      !this.state.isLoading
      ? <div className='loading' />
 :
      <Fragment>
        <Row>
          <Col xs='12' md='12'>
            <Card>
              <CardHeader>
                <strong> Restaurant Detail</strong>
                <Link className='btn btn btn-primary' style={{'float':'right'}} color='primary' to={`/app/restaurants`} >Back</Link>
              </CardHeader>
              <CardBody>
                <AvForm  encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>

                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                       <Label htmlFor='text-input'>Restaurant Name</Label>
                     </Col>
                     <Col md='1'>
                       <Label>:</Label>
                     </Col>
                    <Col xs='12' md='4'>
                    {this.state.RestaurantName}  

                     </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                       <Label htmlFor='text-input'>Contact Person Name </Label>
                     </Col>
                     <Col md='1'>
                       <Label>:</Label>
                     </Col>
                    <Col xs='12' md='4'>
                    {this.state.ContactPersonName} 
                     </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                       <Label htmlFor='text-email'>Contact Person Email</Label>
                     </Col>
                     <Col md='1'>
                       <Label>:</Label>
                     </Col>
                    <Col xs='12' md='4'>
                    {this.state.ContactPersonEmail}   
                     </Col>
                  </FormGroup>


                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                       <Label htmlFor='text-input'>Address</Label>
                     </Col>
                     <Col md='1'>
                       <Label>:</Label>
                     </Col>
                    <Col xs='12' md='4'>
                    {this.state.Address} 
                     </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                       <Label htmlFor='text-input'>Restaurant Logo</Label>
                     </Col>
                     <Col md='1'>
                       <Label>:</Label>
                     </Col>
                    <Col xs='12' md='4'>
                    { imagePreview}
                     </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                       <Label htmlFor='text-input'>Restaurant Url</Label>
                     </Col>
                     <Col md='1'>
                       <Label>:</Label>
                     </Col>
                    <Col xs='12' md='4'>
                    <a href={`http://111.93.41.194:7071/login/${this.state.RestaurantCode}`}  target="_blank">http://111.93.41.194:7071/login/{this.state.RestaurantCode}</a>
                     
                     </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                       <Label htmlFor='text-input'>About Restaurant</Label>
                     </Col>
                     <Col md='1'>
                       <Label>:</Label>
                     </Col>
                    <Col xs='12' md='4'>
                    {this.state.AboutRestaurant}    
                     </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>IsActive</Label>
                    </Col>
                    <Col md='1'>
                       <Label>:</Label>
                     </Col>
                    <Col xs='12' md='3'>
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
export default withRouter(Detail)
