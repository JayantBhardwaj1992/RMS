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
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation'
import { connect } from 'react-redux'
import 'chartjs-plugin-datalabels'
import 'react-circular-progressbar/dist/styles.css'
import axios from 'axios'

const myRoleValidation = value => value === '0' ?  `Select a role` : true ;

class Add extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this._handleImageChange = this._handleImageChange.bind(this)
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this)
    this.handleMultiSelectTaxChange = this.handleMultiSelectTaxChange.bind(this)
    this.handleCheckChieldElement = this.handleCheckChieldElement.bind(this)

    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      RestaurantId: '',
      RoleId: '',
      FirstName: '',
      LastName: '',
      UserName: '',
      Contact: '',
      Address: '',
      Password: '',
      Image: '',
      IsActive: true,
      CreatedBy: '',
      CreatedOn: '',
      imagePreviewUrl: '',
      file: '',  
      isLoading: false,
      Roles: [],
      Base64Image: '',  
      selectedRoleOption: '',
      errmessage: '',
      isError: false
    }
  }
  handleMultiSelectChange (e) {
    this.setState({
        selectedRoleOption: e.target.value
    })
  }
  handleInvalidSubmit (errors, values) {
    debugger
    this.setState({errors, values})
  }
  handleCheckChieldElement (event) {
    let checked = this.state.Avail
    checked.forEach(Avail => {
      if (Avail.value === event.target.value) { Avail.isChecked = event.target.checked }
    })
    this.setState({Avail: checked})
  }
  handleMultiSelectTaxChange (e) {
    this.setState({
      selectedTaxOption: e.target.selectedOptions
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
    debugger
    if (errors.length > 0) {
      this.setState({errors, values})
    } else {
      this.setState({
        isLoading:false
      }, function (){
        var date = new Date().getDate()
        var formData = new FormData()
        formData.RestaurantId = this.state.RestaurantId
        formData.FirstName = this.state.FirstName
        formData.LastName = this.state.LastName
        formData.UserName = this.state.UserName
        formData.RoleId = this.state.selectedRoleOption
        formData.Password = this.state.Password
        formData.Contact = this.state.Contact
        formData.Address = this.state.Address
        formData.Image = this.state.file.name
        formData.IsActive = this.state.IsActive
        formData.CreatedBy = this.state.RestaurantId
        formData.CreatedOn = date
  
        axios.post('/api/restaurantusers/add', {formData}).then((res) => {
          if (res.data.success) {
            if (this.state.file) {
              let data = new FormData()
              data.append('image', this.state.file, res.data.item._id + '.' + this.state.file.name)
  
              axios.post('/api/restaurantusers/uploaduserimage', data, {
                headers: {
                  'accept': 'application/json',
                  'Accept-Language': 'en-US,en;q=0.8',
                  'Content-Type': `multipart/form-data; boundary=${data._boundary}`
                }
              })
                .then((res) => {
                  if (res.data.success) {
                    this.props.history.push('/app/restaurantusers')
                  } else {
                    this.setState({
                      isError: true,
                      errmessage: res.data.message,
                      isLoading: true
                    })
                  }
                }).catch(() => {
                  // handle error
                })
            } else {
              this.props.history.push('/app/items')
            }
          } else {
            this.setState({
              isError: true,
              errmessage: res.data.message,
              isLoading: true
            })
          }
        }).catch(() => {
          // on error
        })
      })
      
    }
  }

  componentDidMount () {
    var RestaurantId = this.props.user.RestaurantDetail.ResId

    axios.get('/api/role/list/'  + RestaurantId, {token: localStorage.getItem('user_id')}).then((res) => { 
        this.setState({
        Roles: res.data.Roles,
        isLoading: true,
        RestaurantId: this.props.user.RestaurantDetail.ResId
      })
    }).catch(() => {
      // on error
    })
  }
  handleOptionChange (changeEvent) {
    this.setState({
      Veg_NonVeg: changeEvent.target.value
    })
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
    var options = []
    options.push({'label' : '-- Select Role --' , 'value' : 0})
    this.state.Roles.map((cat) => {
      if (cat.IsActive) {
        options.push({ 'label': cat.RoleName, 'value': cat._id })
      }
    })

   

    let {imagePreviewUrl} = this.state
    let imagePreview = null
    if (imagePreviewUrl) {
      imagePreview = (<img src={imagePreviewUrl} alt='No' className='img img-responsive' style={{'height': '100px', 'width': '100px'}} />)
    } else {
      imagePreview = (<div className='previewText'>Please select an Image for Preview</div>)
    }

    return (
      !this.state.isLoading
      ? <div className='loading' />
      : <Fragment>
        <Row>

          <Col xs='12' md='12'>
            <Card>
              <CardHeader>
                <strong>Add Item</strong>
                {AlertMessage}
              </CardHeader>
              <CardBody>
                <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.handleSubmit} encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>First Name</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.FirstName} type='text' id='FirstName' name='FirstName' placeholder='Enter First Name' onChange={this.onTextChange} required />

                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Last Name</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.LastName} type='text' id='LastName' name='LastName' placeholder='Enter Last Name' onChange={this.onTextChange} required />

                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>User Name</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.UserName} type='text' id='UserName' name='UserName' placeholder='Enter User Name' onChange={this.onTextChange} required />

                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Select Role</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField type='select' name='Roles' onChange={this.handleMultiSelectChange} validate={{myRoleValidation}}  required>
                        {
                        options.map((o) => {
                          return (<option value={o.value}>{o.label}</option>)
                        })
                      }

                      </AvField>

                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Contact</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.Contact} type='text' id='Contact' name='Contact' placeholder='Enter Contact' onChange={this.onTextChange} required />

                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Address</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.Address} type='text' id='Address' name='Address' placeholder='Enter Address' onChange={this.onTextChange} required />

                    </Col>
                  </FormGroup>


                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-email'>Password</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.Password} type='text' id='Password' name='Password' placeholder='Enter Password' onChange={this.onTextChange} required />
                    </Col>
                  </FormGroup>



                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Image</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>

                      <AvField value={this.state.Image} type='file' id='Image' name='Image' onChange={(e) => this._handleImageChange(e)} required />
                    </Col>

                    <Col md='2'>
                      { imagePreview}
                    </Col>

                  </FormGroup>

                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>IsActive</Label>
                    </Col>
                    <Col xs='12' md='4'>
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
                      <Link className='btn  btn-danger' style={{'marginLeft': '15px'}} to={`/app/items`} >Cancel</Link>
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

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser
  return {

    user
  }
}
export default withRouter(
      connect(
        mapStateToProps
      )(Add)
    )
