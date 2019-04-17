import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Label, Alert,
  Row,
  CustomInput
} from 'reactstrap'
import axios from 'axios'
import { connect } from 'react-redux'
import { AvForm, AvField   } from 'availity-reactstrap-validation'
import update from 'immutability-helper'
class Edit extends Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.toggleFade = this.toggleFade.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.Edit = this.Edit.bind(this)
    this.handleMultiSelectChange =  this.handleMultiSelectChange.bind(this)
    this.onTextTableChange = this.onTextTableChange.bind(this)
    this.onPersonCapicityChange = this.onPersonCapicityChange.bind(this)
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      PremisesType: [],
      RestaurantId: '',
      IsActive: false,
      CreatedBy: '',
      _id: '',
      errmessage: '',
      isError: false,
      SelectedPremisesType:'',
      Floor: '',
      Capacity: '',
      Tables: 0,
      TableDetails: [],
      OldTablesCount:0,
      RestaurantPremisesName :'',
      isLoading: false
    }
  }
  handleInvalidSubmit(errors, values) {
    this.setState({errors, values});
  }

  handleMultiSelectChange(SelectedPremisesType)
  {
    this.setState({
      SelectedPremisesType: SelectedPremisesType
    })
  }
  onTextTableChange (e) {
 
    var op = []
    var is = false
    if (this.state.TableDetails.length > 0) {
      this.state.TableDetails.map((ta, i) => {
        if (ta.id === parseInt(e.target.id)) {
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
      op.id = parseInt(e.target.id)
      op.TableName = e.target.value
      op.PersonCapicity = ''
      this.setState({
        TableDetails: this.state.TableDetails.concat([op])
      })
    }
    if (!is) {
      op.id = parseInt(e.target.id)
      op.TableName = e.target.value
      op.PersonCapicity = ''
      this.setState({
        TableDetails: this.state.TableDetails.concat([op])
      })
    }
  }

  onPersonCapicityChange (e) {
      debugger;
      var op = []
      var is = false
      if (this.state.TableDetails.length > 0) {
        this.state.TableDetails.map((ta, i) => {
          if (ta.id === parseInt(e.target.id)) {
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
        op.id = parseInt(e.target.id)
        op.TableName = ''
        op.PersonCapicity = e.target.value
        this.setState({
          TableDetails: this.state.TableDetails.concat([op])
        })
      }
      if (!is) {
        op.id = parseInt(e.target.id)
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
    this.setState({
      [name]: value
    })

  }
  Edit (e) {
    e.preventDefault()
    if (this.state.RestaurantPremisesName === '' || this.state.SelectedPremisesType === '' || this.state.Floor === '' || this.state.Tables === '' || this.state.Capacity === '') {
    } else {   
    var tdetails = []
    var TotalPerson = 0;
    var isError = false;
    if (this.state.TableDetails.length > 0) {
      this.state.TableDetails.map((ta, i) => {
        if(i < this.state.Tables)
        {
          TotalPerson = TotalPerson + (ta.PersonCapicity === "" || undefined ? 0 : parseInt(ta.PersonCapicity))
        }
         
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

   if(!isError)
    {
 
     this.state.TableDetails.map((d, i) => {
       if(i < this.state.Tables)
       {
        tdetails.push({ id: d.id, TableName: d.TableName, PersonCapicity: d.PersonCapicity })
       }
      
     })
    var formData = new FormData()
    formData.RestaurantId = this.state.RestaurantId
  
    formData.PremisiveTypeId = this.state.SelectedPremisesType
    formData.RestaurantPremisesName = this.state.RestaurantPremisesName
    formData.Floor = this.state.Floor
    formData.Capacity = this.state.Capacity
    formData.Tables = this.state.Tables
    formData.TableDetails = tdetails
    formData.RestaurantId = this.state.RestaurantId
    formData.IsActive = this.state.IsActive
    formData.CreatedBy = this.state.CreatedBy
    formData.CreatedOn = this.state.CreatedOn
    debugger
     var _id = this.state._id
        axios.put('/api/restaurantpremises/update/'+ _id + '/' + this.state.RestaurantId, {formData}).then((res) => {
        debugger
            if (res.data.success) {
        this.props.history.push('/app/restaurantpremises')
      } else {
        this.setState({
          isError: true,
          errmessage: res.data.message
        })
      }
    }).catch(() => {
       // on error
    })
  }
  }
  }
  toggle () {
    this.setState({ collapse: !this.state.collapse })
  }

  toggleFade () {
    this.setState((prevState) => { return { fadeIn: !prevState } })
  }
  componentDidMount () {
      debugger
    var RestaurantId = this.props.user.RestaurantDetail.ResId
    var _id = this.props.match.params._id
    axios.get('/api/restaurantpremises/list/' + _id + '/' + RestaurantId, {token: localStorage.getItem('user_id')}).then((res) => {
      debugger
     
      this.setState({
        RestaurantId: RestaurantId,
        SelectedPremisesType:  res.data.Data.PremisiveTypeId._id,
       RestaurantPremisesName : res.data.Data.RestaurantPremisesName,
       Floor: res.data.Data.Floor,
       Capacity: res.data.Data.Capacity,
       OldTablesCount:res.data.Data.Tables,
       Tables: res.data.Data.Tables,
       TableDetails: res.data.Data.TableDetails,
//SelectedPremisesType: SelectedPremisesType,
         IsActive: res.data.Data.IsActive,
         CreatedBy: res.data.Data.CreatedBy,
         CreatedOn: res.data.Data.CreatedOn,
        _id: this.props.match.params._id
      })
      axios.get('/api/premisestype/listAll/' + RestaurantId).then((res) => {
        debugger
      this.setState({
           PremisesType: res.data.Data,
          isLoading: true,
         
        })
    }).catch(() => {
        // on error
      })
    }).catch(() => {
    // on error
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
    this.state.PremisesType.map((cat) => {
      if (cat.IsActive) {
        options.push({ 'label': cat.PremisesType, 'value': cat._id })
      }
    })
 

    let TablesCapacity = []
    var TablesCapacityCount = 0
    if(this.state.Tables > 0)
    {
     for(var i=0;i<this.state.Tables;i++)
     {

       var TableName = ""
       var PersonCapicity = ""
      TablesCapacityCount = TablesCapacityCount + 1

      if(i >= this.state.TableDetails.length)
      {
        debugger;
        var id = this.state.TableDetails[this.state.TableDetails.length -1].id +  i + 1
        TablesCapacity.push(<FormGroup row>    
          <Col md='6'>
            <AvField value={TableName}  type='text' id={id} name={`TableName${id}`} placeholder='Table Name' onChange={e => this.onTextTableChange(e)} required />
          </Col>
  
          <Col xs='12' md='6'>
            <AvField value={PersonCapicity}  type='number' id={id} name={`PersonCapicity${id}`} placeholder='Person Capacity' onChange={e => this.onPersonCapicityChange(e)} required />
          </Col>
        </FormGroup>)
      }
      else{
      
        id = this.state.TableDetails[i].id
         TableName = this.state.TableDetails[i].TableName === undefined ? "" :this.state.TableDetails[i].TableName
         PersonCapicity = this.state.TableDetails[i].PersonCapicity === undefined ? "" :this.state.TableDetails[i].PersonCapicity
        TablesCapacity.push(<FormGroup row>
       
          <Col md='6'>
            <AvField value={TableName}  type='text' id={id} name={`TableName${id}`} placeholder='Table Name' onChange={e => this.onTextTableChange(e)} required />
          </Col>
  
          <Col xs='12' md='6'>
            <AvField value={PersonCapicity}  type='number' id={id} name={`PersonCapicity${id}`} placeholder='Person Capacity' onChange={e => this.onPersonCapicityChange(e)} required />
          </Col>
        </FormGroup>)
      }
     
     }
    }
  

    let Tabledefinition = null
    if (TablesCapacityCount !== '' && TablesCapacityCount > 0) {
      Tabledefinition = (
        <FormGroup row>
          <Col className='col-md-3' />
          <Col md='2'>
            <Label htmlFor='text-input'>Tables Details</Label>
            <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
          </Col>
          <Col xs='12' md='4'>
            {TablesCapacity}
          </Col>
        </FormGroup>
    )
    }
    var checked = false
    if (this.state.IsActive)    {
      checked = true
    }

    return (
        !this.state.isLoading
        ? <div className='loading' />
   :
      <div className='animated fadeIn'>
        <Row className='justify-content-center'>
          <Col xs='12' md='12'>
            <Card>
              <CardHeader>
              <strong>Edit Restaurant Premises Type</strong>
              {AlertMessage}
            </CardHeader>
              <CardBody>
              <AvForm onInvalidSubmit={this.handleInvalidSubmit} onSubmit={this.Edit} encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>
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
                      <Label htmlFor='text-input'>Premises Type</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                    <AvField type='select' name='SelectedPremisesType' value = {this.state.SelectedPremisesType}  onChange={this.handleMultiSelectChange}   required>
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
                      <AvField value={this.state.Floor} type='number' id='Floor' name='Floor' placeholder='Enter Floor Number' onChange={this.onTextChange} required />

                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Capacity</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.Capacity} type='number' id='Capacity' name='Capacity' placeholder='Enter Capacity' onChange={this.onTextChange} required />

                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Total Tables</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.Tables} type='number' id='Tables' name='Tables' placeholder='Enter Tables' onChange={this.onTextChange} required />

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

                    <Button  className='btn  btn-primary'>Submit</Button>
                    <Link className='btn  btn-danger' style={{'marginLeft': '15px'}} to={`/app/restaurantpremises`} >Cancel</Link>
                  </Col>
                </FormGroup>

              </AvForm>
            </CardBody>

            </Card>
          </Col>
        </Row>
      </div>
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
