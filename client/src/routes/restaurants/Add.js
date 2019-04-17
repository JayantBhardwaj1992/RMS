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
import path from 'path'
import 'chartjs-plugin-datalabels'
import 'react-circular-progressbar/dist/styles.css'
import axios from 'axios'

import profileStatusData from 'Data/dashboard.profile.status.json'

class Add extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this)
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
      Password: '',
      Address: '',
      AboutRestaurant: '',
      message: '',
      IsActive: false,
      isError: false,
      Base64Image: '',
      errmessage: ''
    }
  }
  handleInvalidSubmit (event, errors, values) {
    this.setState({errors, values})
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
  handleSubmit (errors, values) {
    if (errors.length > 0)    {
      this.setState({errors, values})
    }  else {
      var date = new Date().getDate()
      var formData = new FormData()
      formData.RestaurantName = this.state.RestaurantName
      formData.ContactPersonName = this.state.ContactPersonName
      formData.ContactPersonEmail = this.state.ContactPersonEmail
      formData.Address = this.state.Address
      formData.Password = this.state.Password
      formData.RestaurantLogo = this.state.RestaurantLogo
      formData.AboutRestaurant = this.state.AboutRestaurant
      formData.IsActive = this.state.IsActive
      formData.token = localStorage.getItem('user_id')
      formData.CreatedBy = date

      if (this.state.file)    {
      formData.RestaurantLogo = this.state.file.name
    }
      axios.post('/api/restaurants/add', {formData}).then((res) => {
  

      if (res.data.success) {
        let data = new FormData()
        data.append('image', this.state.file, res.data.restaurant._id + '.' + this.state.file.name)
        axios.post('/api/restaurants/uploadlogo', data, {
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`
          }
        })
          .then((res) => {
            if (res.data.success)            {
              this.props.history.push('/app/restaurants')
            } else {
              this.setState({
                isError: true,
                errmessage: res.data.message
              })
            }
          }).catch((error) => {
            // handle error
          })


      
      }      else      {
        this.setState({
          isError: true,
          errmessage: res.data.message
        })
      }
    })

    // if (this.state.file) {
    //   this.getBase64(this.state.file, (result) => {
    //     formData.RestaurantLogo = result

    //     axios.post('/api/restaurants/add', {formData}).then((res) => {

    //       if (res.data.success) {
    //         this.props.history.push('/app/restaurants')
    //       } else {
    //         this.setState({
    //           isError: true,
    //           errmessage: res.data.message
    //         })
    //       }
    //     }).catch((err) => {
    //       for (var key in err.response.data.err.errors) {
    //         this.setState({
    //           isError: true,
    //           errmessage:err.response.data.err.errors[key].message
    //         })
    //         break;
    //     }
    //       console.log(err)
    //         // on error
    //     })
    //   })
    // } else {
    //   axios.post('/api/restaurants/add', {formData}).then((res) => {
    //     if (res.data.success) {
    //       this.props.history.push('/app/restaurants')
    //     } else {
    //       this.setState({
    //         isError: true,
    //         errmessage: res.data.message
    //       })
    //     }
    //   }).catch(() => {
    //       // on error
    //   })
    // }
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

    let {imagePreviewUrl} = this.state
    let imagePreview = null
    if (imagePreviewUrl) {
      imagePreview = (<img src={imagePreviewUrl} alt='No' className='img img-responsive' style={{'height': '100px', 'width': '100px'}} />)
    } else {
      imagePreview = (<div className='previewText'>Please select an Image for Preview</div>)
    }
    return (
      <Fragment>
        <Row>

          <Col xs='12' md='12'>
            <Card>
              <CardHeader>
                <strong>Add Restaurant</strong>
                {AlertMessage}
              </CardHeader>
              <CardBody>
                <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.handleSubmit} encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>

                   <FormGroup row>
                     <Col className='col-md-3' />
                     <Col md='2'>
                      <Label htmlFor='text-input'>Restaurant Name</Label>
                    </Col>
                     <Col xs='12' md='4'>
                      <AvField value={this.state.RestaurantName} type='text' id='RestaurantName' name='RestaurantName' placeholder='Enter Restaurant name' onChange={this.onTextChange} required />

                    </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Col className='col-md-3' />
                     <Col md='2'>
                      <Label htmlFor='text-input'>Contact Person Name </Label>
                    </Col>
                     <Col xs='12' md='4'>
                      <AvField value={this.state.ContactPersonName} type='text' id='ContactPersonName' name='ContactPersonName' placeholder='Enter Contact Person Name' onChange={this.onTextChange} required />
                    </Col>
                   </FormGroup>

                   <FormGroup row>
                     <Col className='col-md-3' />
                     <Col md='2'>
                      <Label htmlFor='text-email'>Contact Person Email</Label>
                    </Col>
                     <Col xs='12' md='4'>
                      <AvField value={this.state.ContactPersonEmail} type='email' id='ContactPersonEmail' name='ContactPersonEmail' placeholder='Enter Contact Person Email' onChange={this.onTextChange} required />
                    </Col>
                   </FormGroup>

                   <FormGroup row>
                     <Col className='col-md-3' />
                     <Col md='2'>
                      <Label htmlFor='text-email'>Password</Label>
                    </Col>
                     <Col xs='12' md='4'>
                      <AvField value={this.state.Password} type='text' id='Password' name='Password' placeholder='Enter Contact Password' onChange={this.onTextChange} required />
                    </Col>
                   </FormGroup>

                   <FormGroup row>
                     <Col className='col-md-3' />
                     <Col md='2'>
                      <Label htmlFor='text-input'>Address</Label>
                    </Col>
                     <Col xs='12' md='4'>
                      <textarea value={this.state.Address} type='text' rows='3' cols='46' id='Address' name='Address' placeholder='Enter Address' onChange={this.onTextChange} required />
                    </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Col className='col-md-3' />
                     <Col md='2'>
                      <Label htmlFor='text-input'>Restaurant Logo</Label>
                    </Col>
                     <Col xs='12' md='4'>

                      <AvField value={this.state.RestaurantLogo} type='file' id='RestaurantLogo' name='RestaurantLogo' onChange={(e) => this._handleImageChange(e)} required />
                    </Col>

                     <Col md='2' />

                   </FormGroup>

                   <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2' />
                    <Col xs='12' md='6'>

                      { imagePreview}
                    </Col>

                  </FormGroup>
                   <FormGroup row>
                     <Col className='col-md-3' />
                     <Col md='2'>
                      <Label htmlFor='text-input'>About Restaurant</Label>
                    </Col>
                     <Col xs='12' md='3'>
                      <textarea value={this.state.AboutRestaurant} id='AboutRestaurant' name='AboutRestaurant' placeholder='Enter AboutRestaurant' onChange={this.onTextChange} rows='4' cols='46' />

                    </Col>
                   </FormGroup>
                   <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>IsActive</Label>
                    </Col>
                    <Col xs='12' md='3'>
                      <CustomInput
                      type='checkbox'
                      id='IsActive'
                      name='IsActive'
                      value={this.state.IsActive} onChange={this.onTextChange}
                    />
                    </Col>
                  </FormGroup>
                   <FormGroup row>
                     <Col className='col-md-3' />
                     <Col md='2' />
                     <Col xs='12' md='3'>

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
export default withRouter(Add)
