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
import Select from 'react-select'
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation'
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
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this)
    this.handleMultiSelectTaxChange = this.handleMultiSelectTaxChange.bind(this)
    this.handleCheckChieldElement = this.handleCheckChieldElement.bind(this)
    this.getBase64 = this.getBase64.bind(this)
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
      selectedOption: '',
      CategoryOptions: [],
      TaxOptions: [],
      isLoading: false,
      Imagechange: false,
      selectedTaxOption: [],
      selectedCategoryOption: [],
      Avail: [],
      Category: [],
      Base64Image: '',
      Tax: [],

      errmessage: '',
      isError: false
    }
  }
  handleMultiSelectChange (e) {
    this.setState({
      selectedCategoryOption: e.target.selectedOptions
    })
  }
  handleMultiSelectTaxChange (e) {
    this.setState({
      selectedTaxOption: e.target.selectedOptions
    })
  }
  handleInvalidSubmit (errors, values) {
    this.setState({errors, values})
  }
  handleCheckChieldElement (event) {
    debugger
    let checked = this.state.Avail
    checked.forEach(Avail => {
      if (Avail.value === event.target.value) { Avail.isChecked = event.target.checked }
    })
    this.setState({Avail: checked})
  }

  componentDidMount () {
    this.setState({
      RestaurantId: this.props.user.RestaurantDetail.ResId
    }, function () {
      var RestaurantId = this.props.user.RestaurantDetail.ResId
      var _id = this.props.match.params._id

      axios.get('/api/items/list/' + _id + '/' + RestaurantId).then((res) => {

        this.setState({
          RestaurantId: RestaurantId,
          ItemName: res.data.Data.ItemName,
          Category: res.data.Data.Category,
          Tax: res.data.Data.Tax,
          Availability: res.data.Data.Availability,
          Price: res.data.Data.Price,
          imagePreviewUrl: res.data.Data.ItemImage,

          Veg_NonVeg: res.data.Data.Veg_NonVeg,
          selectedOption: res.data.Data.Veg_NonVeg,
          IsActive: res.data.Data.IsActive,
          CreatedBy: res.data.Data.CreatedBy,
          CreatedOn: res.data.Data.CreatedOn,
          Avail: res.data.Data.Availability,
          ItemDetail: res.data.Data.ItemDetail,

          _id: _id
        })
        axios.get('/api/items/categorywithtax/' + RestaurantId).then((res) => {
          this.setState({
            CategoryOptions: res.data.Category,
            TaxOptions: res.data.Tax,
            isLoading: true
          })
        }).catch(() => {
        // on error
        })
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
        imagePreviewUrl: reader.result,
        Imagechange: true
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
      formData.ItemImage = this.state.imagePreviewUrl
      formData.Price = this.state.Price
      formData.Veg_NonVeg = this.state.Veg_NonVeg
      formData.IsActive = this.state.IsActive
      formData.CreatedBy = this.state.CreatedBy
      formData.CreatedOn = date

      var Category = []
      if (this.state.Category.length > 0) {
        if (this.state.selectedCategoryOption.length > 0) {
          Array.from(this.state.selectedCategoryOption).map((s) => {
            Category.push(s.value)
          })
          formData.Category = Category
        } else {
          formData.Category = this.state.Category
        }
      }

      var Tax = []
      if (this.state.Tax.length > 0) {
        if (this.state.selectedTaxOption.length > 0) {
          Array.from(this.state.selectedTaxOption).map((s) => {
            Category.push(s.value)
          })
          formData.Tax = Tax
        } else {
          formData.Tax = this.state.Tax
        }
      }

      if (this.state.Imagechange) {
        formData.ItemImage = this.state.file.name
      } else {
        formData.ItemImage = this.state.imagePreviewUrl
      }

      axios.put('/api/items/update/' + this.state._id + '/' + this.state.RestaurantId, {formData}).then((res) => {
        if (res.data.success) {
          let data = new FormData()
          if (this.state.Imagechange) {
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
              }).catch((error) => {
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

  handleOptionChange (changeEvent) {
    this.setState({
      Veg_NonVeg: changeEvent.target.value
    })
  }
  render () {
    let AlertMessage = null
    var isMulti = true
    if (this.state.isError) {
      AlertMessage = (
        <Alert color='danger' >
          {this.state.errmessage}
        </Alert>
    )
    }
    var options = []
    this.state.CategoryOptions.map((cat) => {
      if (cat.IsActive) {
        options.push({ 'label': cat.CategoryName, 'value': cat._id })
      }
    })

    var taxoptions = []
    this.state.TaxOptions.map((tax) => {
      if (tax.IsActive) {
        taxoptions.push({ 'label': tax.TaxName, 'value': tax._id })
      }
    })

    var radiooptions = []
    radiooptions.push({text: 'Veg', value: 'Veg' })
    radiooptions.push({text: 'NonVeg', value: 'NonVeg' })

    let imagePreview = null
    if (this.state._id) {
      if (this.state.Imagechange) {
        let {imagePreviewUrl} = this.state
        imagePreview = (<img src={imagePreviewUrl} alt='No' className='img img-responsive' style={{'height': '100px', 'width': '100px'}} />)
      } else {
        var imgsrc = require('../../upload/items/thumbnail1/' + this.state._id + '.' + this.state.imagePreviewUrl)

        imagePreview = (<img src={imgsrc} alt='No' className='img img-responsive' style={{'height': '100px', 'width': '100px'}} />)
      }
    }

    const defaultValues = {
      Veg_NonVeg: this.state.Veg_NonVeg
    }

    return (
      !this.state.isLoading
      ? <div className='loading' />
 : <Fragment>
   <Row>

     <Col xs='12' md='12'>
       <Card>
         <CardHeader>
           <strong>Edit Item</strong>
           {AlertMessage}
         </CardHeader>
         <CardBody>
           <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.handleSubmit} model={defaultValues} encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>

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
                 <AvField type='select' name='Category' value={this.state.Category} onChange={this.handleMultiSelectChange} helpMessage='Select ctrl + right click to select multiple !' multiple required>
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

                 <AvField type='select' name='Tax' value={this.state.Tax} onChange={this.handleMultiSelectTaxChange} helpMessage='Select ctrl + right click to select multiple !' multiple required>
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
               <Col xs='12' md='4'>
                 <AvCheckboxGroup inline  name='Avail' required>

                   {
this.state.Avail.map((Avail) => {
  return (<AvCheckbox customInput name={Avail.label} label={Avail.label} value={Avail.value} checked={Avail.isChecked} onChange={this.handleCheckChieldElement} />)
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
                   {
                   radiooptions.map((r) => {
                     return (<AvRadio customInput label={r.text} value={r.value} onChange={this.handleOptionChange} />)
                   })
                 }

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

                 <AvField value={this.state.ItemImage} type='file' id='ItemImage' name='ItemImage' onChange={(e) => this._handleImageChange(e)} />
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
      )(Edit)
    )
