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
import { connect } from 'react-redux'
import 'chartjs-plugin-datalabels'
import 'react-circular-progressbar/dist/styles.css'
import axios from 'axios'
const myRoleValidation = value => value === '0' ?  `Select a role` : true ;
class Edit extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this._handleImageChange = this._handleImageChange.bind(this)
    this.getBase64 = this.getBase64.bind(this)
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this)
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
      isError: false,
      errmessage: '',
      Imagechange:false
    }
  }
  handleInvalidSubmit (errors, values) {
    this.setState({errors, values})
  }
  handleMultiSelectChange (e) {
    this.setState({
        selectedRoleOption: e.target.value
    })
  }
  componentDidMount () {
    this.setState({
    RestaurantId: this.props.user.RestaurantDetail.ResId,
    isLoading : false
  })

    var RestaurantId = this.props.user.RestaurantDetail.ResId
    const _id = this.props.match.params._id

    axios.get('/api/restaurantusers/list/' + _id + '/' + RestaurantId, {token: localStorage.getItem('user_id')}).then((res) => {

        if (res.data.success) {
    debugger
    this.setState({
        _id: this.props.match.params._id,
        RestaurantId: res.data.RestaurantUsers.RestaurantId,
        FirstName: res.data.RestaurantUsers.FirstName,
        selectedRoleOption : res.data.RestaurantUsers.RoleId._id,
        LastName: res.data.RestaurantUsers.LastName,
        UserName: res.data.RestaurantUsers.UserName,
        Address: res.data.RestaurantUsers.Address,
        Contact: res.data.RestaurantUsers.Contact,
        imagePreviewUrl: res.data.RestaurantUsers.Image,
        Roles: res.data.Roles,
        IsActive: res.data.RestaurantUsers.IsActive,
        isLoading:true

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
        imagePreviewUrl: reader.result,
        Imagechange:true
      })
    }

    reader.readAsDataURL(file)
  }
  handleSubmit (errors, values) {
    if (errors.length > 0)    {
      this.setState({errors, values})
    }  else {
      this.setState({
        isLoading:false
      }, function(){
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
        formData.IsActive = this.state.IsActive
        formData.CreatedBy = this.state.RestaurantId
        formData.CreatedOn = date
  
        if (this.state.Imagechange) {
          formData.Image = this.state.file.name
        } else {
          formData.Image = this.state.imagePreviewUrl
        }
  
        axios.put('/api/restaurantusers/update/' + this.state._id + '/' + this.state.RestaurantId, {formData}).then((res) => {
            if (res.data.success) {
  
              debugger
  
              let data = new FormData()
              if (this.state.Imagechange) {
                data.append('image', this.state.file, res.data.RestaurantUser._id + '.' + this.state.file.name)
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
                        isLoading:true
                      })
                    }
                  }).catch((error) => {
                    // handle error
                  })
              } else {
                this.props.history.push('/app/restaurantusers')
              }
            } else {
              this.setState({
                isError: true,
                errmessage: res.data.message,
                isLoading:true
              })
            }
          }).catch((err) => {
            for (var key in err.response.data.err.errors) {
              this.setState({
                isError: true,
                errmessage: err.response.data.err.errors[key].message,
                isLoading:true
              })
              break
          }
            console.log(err)
              // on error
          })
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
    var options = []
    var options = []
    options.push({'label' : '-- Select Role --', 'value' : 0})
    this.state.Roles.map((cat) => {
      if (cat.IsActive) {
        options.push({ 'label': cat.RoleName, 'value': cat._id })
      }
    })

  
    let imagePreview = null
    if (this.state._id) {
      if (this.state.Imagechange) {
        let {imagePreviewUrl} = this.state
        imagePreview = (<img src={imagePreviewUrl} alt='No' className='img img-responsive' style={{'height': '100px', 'width': '100px'}} />)
      } else {
        var imgsrc = require('../../upload/RestaurantUsers/thumbnail1/' + this.state._id + '.' + this.state.imagePreviewUrl)

        imagePreview = (<img src={imgsrc} alt='No' className='img img-responsive' style={{'height': '100px', 'width': '100px'}} />)
      }
    }



    return (
      !this.state.isLoading
      ? <div className='loading' />
 : <Fragment>
   <Row>

     <Col xs='12' md='12'>
       <Card>
         <CardHeader>
           <strong>Edit Restaurant User</strong>
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
                 <AvField value={this.state.FirstName} type='text' id='UserName' name='UserName' placeholder='Enter User Name' onChange={this.onTextChange} required />

               </Col>
             </FormGroup>
             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-input'>Select Role</Label>
                 <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
               </Col>
               <Col xs='12' md='4'>
                 <AvField type='select'  name='selectedRoleOption' value={this.state.selectedRoleOption} validate={{myRoleValidation}} onChange={this.handleMultiSelectChange}  required>
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
                 <Label htmlFor='text-email'>Contact</Label>
                 <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
               </Col>
               <Col xs='12' md='4'>
                 <AvField value={this.state.Contact} type='text' id='Contact' name='Contact' placeholder='Enter Contact' onChange={this.onTextChange} required />
               </Col>
             </FormGroup>
             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-email'>Address</Label>
                 <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
               </Col>
               <Col xs='12' md='4'>
                 <AvField value={this.state.Address} type='text' id='Address' name='Address' placeholder='Enter Address' onChange={this.onTextChange} required />
               </Col>
             </FormGroup>
          
     

             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-input'>Image</Label>
                 <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
               </Col>
               <Col xs='12' md='4'>

                 <AvField value={this.state.Image} type='file' id='ItemImage' name='ItemImage' onChange={(e) => this._handleImageChange(e)} />
               </Col>

             </FormGroup>
             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2' />
               <Col xs='12' md='4'>

                 {imagePreview}
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
                   name='IsActive' checked={this.state.IsActive}
                   value={this.state.IsActive} onChange={this.onTextChange}
                    />
               </Col>
             </FormGroup>
             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2' />
               <Col xs='12' md='3'>

                 <Button className='btn  btn-primary'>Submit</Button>
                 <Link className='btn  btn-danger' style={{'marginLeft': '15px'}} to={`/app/restaurantusers`} >Cancel</Link>
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
      )(Edit)
    )


