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

class Edit extends Component {
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
      RestaurantId: '',
      PremisesType: '',
      message: '',
      IsActive: false,
      isError: false,
      Base64Image: '',
      errmessage: ''
    }
  }
  handleInvalidSubmit (errors, values) {
    this.setState({errors, values})
  }

  componentDidMount () {
    this.setState({
    RestaurantId: this.props.user.RestaurantDetail.ResId,
    isLoading : false
  })

    var RestaurantId = this.props.user.RestaurantDetail.ResId
    const _id = this.props.match.params._id

    axios.get('/api/premisestype/list/' + _id + '/' + RestaurantId, {token: localStorage.getItem('user_id')}).then((res) => {
    if (res.data.success) {
    debugger
    this.setState({
        _id: this.props.match.params._id,
        RestaurantId: res.data.PremisesType.RestaurantId,
        PremisesType: res.data.PremisesType.PremisesType,
        IsActive: res.data.PremisesType.IsActive,
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
      formData.RestaurantId = this.state.RestaurantId
      formData.PremisesType = this.state.PremisesType
      formData.IsActive = this.state.IsActive
      formData.token = localStorage.getItem('user_id')
      formData.CreatedBy = this.state.RestaurantId
      formData.CreatedOn = date

      axios.put('/api/premisestype/update/' + this.state._id + '/' + this.state.RestaurantId, {formData}).then((res) => {
          if (res.data.success) {
            this.props.history.push('/app/premisestype')
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
              errmessage: err.response.data.err.errors[key].message
            })
            break
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

    var checked = false
    if (this.state.IsActive)    {
      checked = true
    }

    return (
      !this.state.isLoading ?
        <div className='loading' />
   :      <Fragment>
        <Row>

          <Col xs='12' md='12'>
            <Card>
              <CardHeader>
                <strong>Edit Category</strong>
                {AlertMessage}
              </CardHeader>
              <CardBody>
                <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.handleSubmit} encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>

                   <FormGroup row>
                     <Col className='col-md-3' />
                     <Col md='2'>
                      <Label htmlFor='text-input'>Premises Type</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                     <Col xs='12' md='4'>
                      <AvField value={this.state.PremisesType} type='text' id='PremisesType' name='PremisesType' placeholder='Enter Premises type' onChange={this.onTextChange} required />

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
                      name='IsActive' checked={checked}
                      value={this.state.IsActive} onChange={this.onTextChange}
                    />
                    </Col>
                  </FormGroup>
                   <FormGroup row>
                     <Col className='col-md-3' />
                     <Col md='2' />
                     <Col xs='12' md='3'>

                      <Button className='btn  btn-primary'>Submit</Button>
                      <Link className='btn  btn-danger' style={{'marginLeft': '15px'}} to={`/app/premisestype`} >Cancel</Link>
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


