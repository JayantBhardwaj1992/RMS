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
import update from 'immutability-helper'
import { AvForm, AvField } from 'availity-reactstrap-validation'
import { connect } from 'react-redux'
import 'chartjs-plugin-datalabels'
import 'react-circular-progressbar/dist/styles.css'
import axios from 'axios'


class Add extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this)
    this._handleImageChange = this._handleImageChange.bind(this)
    this.onTextTableChange = this.onTextTableChange.bind(this)
    this.onPersonCapicityChange = this.onPersonCapicityChange.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.getBase64 = this.getBase64.bind(this)
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this)
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
      PremisesType: [],
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

  handleMultiSelectChange (selectedOptions) {
    debugger
    this.setState({
      selectedOption: selectedOptions.target.value
    })
  }
  onTextTableChange (e, index) {
    debugger
    var op = []
    var is = false
    if (this.state.TableDetails.length > 0) {
      this.state.TableDetails.map((ta, i) => {
        if (ta.id === index) {
          is = true
          var data = this.state.TableDetails
          var updatedData = update(data[i], {
            TableName: { $set: e.target.value },
            PersonCapicity: { $set: data[i].PersonCapicity }
          })
          var newData = update(data, {
            $splice: [[i, 1, updatedData]]
          })
          this.setState({ TableDetails: newData })
        }
      })
    } else {
      op.id = index
      op.TableName = e.target.value
      op.PersonCapicity = ''
      this.setState({
        TableDetails: this.state.TableDetails.concat([op])
      })
    }
    if (!is) {
      op.id = index
      op.TableName = e.target.value
      op.PersonCapicity = ''
      this.setState({
        TableDetails: this.state.TableDetails.concat([op])
      })
    }
  }

  onPersonCapicityChange (e, index) {
    var op = []
    var is = false

    if (this.state.TableDetails.length > 0) {
      this.state.TableDetails.map((ta, i) => {
        if (ta.id === index) {
          is = true
          var data = this.state.TableDetails
          var updatedData = update(data[i], {
            TableName: { $set: data[i].TableName },
            PersonCapicity: { $set: e.target.value }
          })
          var newData = update(data, {
            $splice: [[i, 1, updatedData]]
          })
          this.setState({ TableDetails: newData })
        }
      })
    } else {
      op.id = index
      op.TableName = ''
      op.PersonCapicity = e.target.value
      this.setState({
        TableDetails: this.state.TableDetails.concat([op])
      })
    }
    if (!is) {
      op.id = index
      op.TableName = ''
      op.PersonCapicity = e.target.value
      this.setState({
        TableDetails: this.state.TableDetails.concat([op])
      })
    }
  }

  onTextChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    if (name === 'Tables') {
      if (this.state.TableDetails.length > 0) {
        this.setState({
          pTableDetails: this.state.TableDetails,
          [name]: value
        })
      } else {
        this.setState({
          [name]: value
        })
      }
    } else {
      this.setState({
        [name]: value
      })
    }
  }
  handleInvalidSubmit (errors, values) {
    this.setState({errors, values})
  }

  componentDidMount () {
    this.setState({
    RestaurantId: this.props.user.RestaurantDetail.ResId
  }, function () {
      var RestaurantId = this.props.user.RestaurantDetail.ResId
    axios.get('/api/premisestype/listAll/' + RestaurantId).then((res) => {
        debugger
      this.setState({
           PremisesType: res.data.Data,
          isLoading: true,
          RestaurantId: this.props.user.RestaurantDetail.ResId
        })
    }).catch(() => {
        // on error
      })
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
    } else {
    
      var TotalPerson = 0;
      var isError = false;
      if (this.state.TableDetails.length > 0) {
        this.state.TableDetails.map((ta, i) => {
            TotalPerson = TotalPerson + (ta.PersonCapicity === "" || undefined ? 0 : parseInt(ta.PersonCapicity))  
        })  
   
      }
      if(TotalPerson >  parseInt(this.state.Capacity))
      {
        isError = true;
        this.setState({
          isError: true,
          errmessage: 'Total person can not be greater than Capacity'
        })
      }
      else
      {
        isError = false
        this.setState({
          isError: false,
         
        })
      }
     if(!isError){
  
      var tdetails = []
      this.state.TableDetails.map((d, i) => {
        tdetails.push({ id: d.id +1, TableName: d.TableName, PersonCapicity: d.PersonCapicity })
      })

      // var date = new Date().getDate()
      var formData = new FormData()
      formData.RestaurantId = this.state.RestaurantId
      debugger
      formData.PremisiveTypeId = this.state.selectedOption
      formData.Floor = this.state.Floor
      formData.RestaurantPremisesName = this.state.RestaurantPremisesName
      formData.Capacity = this.state.Capacity
      formData.Tables = this.state.Tables
      formData.TableDetails = tdetails
      formData.IsActive = this.state.IsActive
      formData.CreatedBy = this.state.RestaurantId
      formData.CreatedOn = this.state.CreatedOn
      axios.post('/api/restaurantpremises/add', { formData }).then((res) => {
        if (res.data.success) {
          this.props.history.push('/app/restaurantpremises')
        } else {
          this.setState({
            isError: true,
            errmessage: res.data.message
          })
        }
      }).catch((error) => {
      // on error
      })
           
     }
    }
  }
  render () {
    var jsontable = []
    if (this.state.Tables > 0) {
      for (var i = 1; i <= this.state.Tables; i++) {
        jsontable.push({ 'id': i, 'tableName': '', PersonCapicity: '' })
      }
    }
    
    var options = []
    this.state.PremisesType.map((cat) => {
      if (cat.IsActive) {
        options.push({ 'label': cat.PremisesType, 'value': cat._id })
      }
    })

    let TablesCapacity = []
    if (this.state.Tables !== '' && this.state.Tables > 0) {
      jsontable.map((j, index) => {
        return (
        TablesCapacity.push(<FormGroup row>

          <Col md='6'>
            <AvField value={j.TableName} type='text' id={'TableName' + j.id} name={`TableName${index}`} placeholder='Table Name' onChange={e => this.onTextTableChange(e, index)} required />
          </Col>

          <Col xs='12' md='6'>
            <AvField value={j.PersonCapacity} type='number' id={'PersonCapacity' + j.id} name={`PersonCapacity${index}`} placeholder='Person Capacity' onChange={e => this.onPersonCapicityChange(e, index)} required />
          </Col>
        </FormGroup>)
        )
      })
    }
    let Tabledefinition = null
    if (this.state.Tables !== '' && this.state.Tables > 0) {
      Tabledefinition = (
        <FormGroup row>
          <Col className='col-md-3' />
          <Col md='2'>
            <Label htmlFor='text-input'>Tables Details</Label>
          </Col>
          <Col xs='12' md='4'>
            {TablesCapacity}
          </Col>
        </FormGroup>
    )
    }

    let AlertMessage = null
    if (this.state.isError) {
      AlertMessage = (
        <Alert color='danger' >
          {this.state.errmessage}
        </Alert>
    )
    }

    return (
        !this.state.isLoading
        ? <div className='loading' /> :
      <Fragment>
        <Row>

          <Col xs='12' md='12'>
            <Card>
              <CardHeader>
                <strong>Add Restaurant Premises </strong>
                {AlertMessage}
              </CardHeader>
              <CardBody>
                <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.handleSubmit} encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>

                   <FormGroup row>
                   <Col className='col-md-3' />
                   <Col md='2'>
                      <Label htmlFor='text-input'> Premises Name</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                   <Col xs='12' md='4'>
                      <AvField value={this.state.RestaurantPremisesName} type='tesxt' id='RestaurantPremisesName' name='RestaurantPremisesName' placeholder='Enter Restaurant Premises Name' onChange={this.onTextChange} required />

                    </Col>
                 </FormGroup>
                 <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Select Premises Type</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField type='select' name='PremisesType'  onChange={this.handleMultiSelectChange}   required>
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
                      <Label htmlFor='text-input'>Floor</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.Floor}  id='Floor' name='Floor' placeholder='Enter Floor Number' onChange={this.onTextChange} validate={{number: true, maxLength: {value: 3}}} required />

                    </Col>
                  </FormGroup>
                   <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Capacity</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.Capacity}    id='Capacity' name='Capacity' placeholder='Enter Capacity' validate={{number: true, maxLength: {value: 3}}} onChange={this.onTextChange} required />

                    </Col>
                  </FormGroup>

                   <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Total Tables</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.Tables} validate={{number: true, maxLength: {value: 2}}} id='Tables' name='Tables' placeholder='Enter Tables' onChange={this.onTextChange} required />

                    </Col>
                  </FormGroup>
                   {Tabledefinition}
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
                    <Col xs='12' md='3'>

                      <Button className='btn  btn-primary'>Submit</Button>
                      <Link className='btn  btn-danger' style={{'marginLeft': '15px'}} to={`/app/restaurantpremises`} >Cancel</Link>
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


