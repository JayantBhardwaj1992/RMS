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

class Detail extends Component {
  constructor (props) {
    super(props)
  
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
 
  componentDidMount () {
    this.setState({
      RestaurantId: this.props.user.RestaurantDetail.ResId
    }, function () {
      var RestaurantId = this.props.user.RestaurantDetail.ResId
      var _id = this.props.match.params._id

      axios.get('/api/items/list/' + _id + '/' + RestaurantId).then((res) => {
        debugger
        debugger
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
    this.state.Category.map((pat) => {
      this.state.CategoryOptions.map((cat) => {
        if (cat.IsActive && pat === cat._id) {
        options.push({ 'label': cat.CategoryName, 'value': cat._id })
      }
      })
    })
    var taxoptions = []
    this.state.Tax.map((pat) => {
    this.state.TaxOptions.map((tax) => {
      if (tax.IsActive && pat === tax._id) {
        taxoptions.push({ 'label': tax.TaxName, 'value': tax._id })
      }
    })
})
    
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
           <strong>Detail Item</strong>
           <Link className='btn btn btn-primary' style={{'float':'right'}} color='primary' to={`/app/items`} >Back</Link>
         </CardHeader>
         <CardBody>
           <AvForm onInvalidSubmit={this.handleInvalidSubmit} onValidSubmit={this.handleSubmit} model={defaultValues} encType='multipart/form-data' className='form-horizontal' style={{'marginTop': '15px'}}>

             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-input'>Item Name</Label>
               </Col>
               <Col md='1'>
                 <Label htmlFor='text-input'>:</Label>
               </Col>
               <Col xs='12' md='4'>
               {this.state.ItemName}
               </Col>
             </FormGroup>
             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-input'> Category</Label>
               </Col>
               <Col md='1'>
                 <Label htmlFor='text-input'>:</Label>
               </Col>
               <Col xs='12' md='4'>
               <ul style={{'margin': '0px','padding' :'0px 0px 0px 20px'}}>
                   {
                        options.map((o) => {
                          return (<li value={o.value}>{o.label}</li>)
                        })
                      }
              </ul>
               </Col>
             </FormGroup>

             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-input'> Tax type</Label>
               </Col>
               <Col md='1'>
                 <Label htmlFor='text-input'>:</Label>
               </Col>
               <Col xs='12' md='4'>
               <ul style={{'margin': '0px','padding' :'0px 0px 0px 20px'}}>
                   {
                        taxoptions.map((o) => {
                          return (<li value={o.value}>{o.label}</li>)
                        })
                      }
              </ul>
              
               </Col>
             </FormGroup>

             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-email'>Price</Label>
               </Col>
               <Col md='1'>
                 <Label htmlFor='text-input'>:</Label>
               </Col>
               <Col xs='12' md='4'>
               {this.state.Price}
               </Col>
             </FormGroup>
             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-email'>Availability</Label>
               </Col>
               <Col md='1'>
                 <Label htmlFor='text-input'>:</Label>
               </Col>
               <Col xs='12' md='4'>
               <ul style={{'margin': '0px','padding' :'0px 0px 0px 20px'}}>
                   {
                        this.state.Avail.map((o) => {
                            if(o.isChecked){
                                return (<li value={o.value}>{o.label}</li>)
                            }
                        
                        })
                      }
              </ul>
                 
               </Col>
             </FormGroup>
             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-input'>Veg/NonVeg</Label>
               </Col>
               <Col md='1'>
                 <Label htmlFor='text-input'>:</Label>
               </Col>
               <Col xs='12' md='3'>
               {this.state.Veg_NonVeg}
               </Col>
             </FormGroup>

             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-input'>Item Image</Label>
               </Col>
               <Col md='1'>
                 <Label htmlFor='text-input'>:</Label>
               </Col>
               <Col xs='12' md='3'>

               {imagePreview}
               </Col>

             </FormGroup>
      
             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-input'>About Item</Label>
               </Col>
               <Col md='1'>
                 <Label htmlFor='text-input'>:</Label>
               </Col>
               <Col xs='12' md='4'>
              { this.state.ItemDetail}
               </Col>
             </FormGroup>
             <FormGroup row>
               <Col className='col-md-3' />
               <Col md='2'>
                 <Label htmlFor='text-input'>IsActive</Label>
               </Col>
               <Col md='1'>
                 <Label htmlFor='text-input'>:</Label>
               </Col>
               <Col xs='12' md='3'>
                {this.state.IsActive ? "True" : "False"}
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
      )(Detail)
    )
