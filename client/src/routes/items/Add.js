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
      ItemName: '',
      ItemDetail: '',
      Availability: '',
      Price: '',
      Veg_NonVeg: '',
      RestaurantId: '',
      IsActive: false,
      ItemImage: '',
      CreatedBy: '',
      imagePreviewUrl: '',
      file: '',
      selectedOption: [],
      isLoading: false,
      Avail: [
        {id: 1, label: 'Lunch', value: 'Lunch', isChecked: false},
        {id: 2, label: 'Dinner', value: 'Dinner', isChecked: false},
        {id: 3, label: 'Breakfast', value: 'Breakfast', isChecked: false},
        {id: 4, label: 'Not Available', value: 'Not Available', isChecked: false}
      ],
      Category: [],
      Base64Image: '',
      Tax: [],
      selectedTaxOption: [],
      errmessage: '',
      isError: false
    }
  }
  handleMultiSelectChange (e) {
   
    this.setState({
      selectedOption: e.target.selectedOptions
    })
  }
  handleInvalidSubmit (errors, values) {
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
    if (errors.length > 0) {
      this.setState({errors, values})
    } else {
      var date = new Date().getDate()
      var formData = new FormData()
      formData.RestaurantId = this.state.RestaurantId
      formData.ItemName = this.state.ItemName
      formData.ItemDetail = this.state.ItemDetail
      formData.Availability = this.state.Avail

      formData.Price = this.state.Price
      formData.Veg_NonVeg = this.state.Veg_NonVeg
      formData.ItemImage = this.state.file.name
      formData.IsActive = this.state.IsActive
      formData.CreatedBy = this.state.RestaurantId
      formData.CreatedOn = date
 
      var Category = [];
      if(this.state.selectedOption.length > 0)
      {
        Array.from(this.state.selectedOption).map((s) => {
          Category.push(s.value)
        })
      }

      var Tax = []
      if(this.state.selectedTaxOption.length > 0)
      {
        Array.from(this.state.selectedTaxOption).map((s) => {
          Tax.push(s.value)
        })
      }
     
      formData.Category = Category
      formData.Tax = Tax
      axios.post('/api/items/add', {formData}).then((res) => {
     
        if (res.data.success) {
          if (this.state.file) {
            let data = new FormData()
            data.append('image', this.state.file, res.data.item._id + '.' + this.state.file.name)

            axios.post('/api/items/uploaditemimage', data, {
              headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`
              }
            })
              .then((res) => {
                if (res.data.success) {
                  this.props.history.push('/app/items')
                } else {
                  this.setState({
                    isError: true,
                    errmessage: res.data.message
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
            errmessage: res.data.message
          })
        }
      }).catch(() => {
        // on error
      })
    }
  }

  componentDidMount () {
    
    var RestaurantId = this.props.user.RestaurantDetail.ResId

    axios.get('/api/items/categorywithtax/' + RestaurantId).then((res) => {
      this.setState({
        Category: res.data.Category,
        Tax: res.data.Tax,
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
    this.state.Category.map((cat) => {
      if (cat.IsActive) {
        options.push({ 'label': cat.CategoryName, 'value': cat._id })
      }
    })

    var taxoptions = []
    this.state.Tax.map((tax) => {
      if (tax.IsActive) {
        taxoptions.push({ 'label': tax.TaxName, 'value': tax._id })
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
      ? <div className='loading' /> :
      <Fragment>
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
                      <Label htmlFor='text-input'>Item Name</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.ItemName} type='text' id='ItemName' name='ItemName' placeholder='Enter Item Name' onChange={this.onTextChange} required />

                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Select Category</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField type='select' name='Category'  onChange={this.handleMultiSelectChange} helpMessage='Select ctrl + right click to select multiple !' multiple required>
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
                      <Label htmlFor='text-input'>Select Tax type</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>

                    <AvField type='select' name='Tax'  onChange={this.handleMultiSelectTaxChange} helpMessage='Select ctrl + right click to select multiple !' multiple required>
                        {
                        taxoptions.map((o) => {
                          return (<option value={o.value}>{o.label}</option>)
                        })
                      }

                      </AvField>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-email'>Price</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvField value={this.state.Price} type='text' id='Price' name='Price' placeholder='Enter Price' onChange={this.onTextChange} required />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-email'>Availability</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='5'>
                      <AvCheckboxGroup inline value={this.state.Availability} name='Availability' required >

                        {
          this.state.Avail.map((Avail) => {
            return (<AvCheckbox customInput label={Avail.label} value={Avail.value} checked={Avail.isChecked} onChange={this.handleCheckChieldElement} />)
          })
        }

                      </AvCheckboxGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Veg/NonVeg</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <AvRadioGroup inline name='Veg_NonVeg' required>
                        <AvRadio customInput label='Veg' value='Veg' checked={this.state.selectedOption === 'Veg'} onChange={this.handleOptionChange} />
                        <AvRadio customInput label='NonVeg' value='NonVeg' checked={this.state.selectedOption === 'NonVeg'} onChange={this.handleOptionChange} />

                      </AvRadioGroup>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>Item Image</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>

                      <AvField value={this.state.ItemImage} type='file' id='ItemImage' name='ItemImage' onChange={(e) => this._handleImageChange(e)} required />
                    </Col>

                    <Col md='2'>
                      { imagePreview}
                    </Col>

                  </FormGroup>
                  <FormGroup row>
                    <Col className='col-md-3' />
                    <Col md='2'>
                      <Label htmlFor='text-input'>About Item</Label>
                      <Label htmlFor='text-input' style={{'color': 'red'}}>*</Label>
                    </Col>
                    <Col xs='12' md='4'>
                      <textarea value={this.state.ItemDetail} id='ItemDetail' name='ItemDetail' placeholder='Enter Item Detail' onChange={this.onTextChange} rows='4' cols='50' />

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
