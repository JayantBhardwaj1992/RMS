import React, { Component, Fragment } from 'react';
import IntlMessages from 'Util/IntlMessages';
import { Row, Card, CardTitle, Form, Label, Input, Button ,   Modal,
  ModalHeader,
  ModalBody,
  ModalFooter , Alert } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import { connect } from 'react-redux';
import { loginUserSuccess } from 'Redux/actions';
import { Colxx } from 'Components/CustomBootstrap';

class ResetPasswordLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      modal: false,
      rpassword:'',
      password:'',
      isError: false,
      errmessage: ''
    }
    this.toggle = this.toggle.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.Gotologin = this.Gotologin.bind(this)
  }
  toggle () {
    this.setState({
      modal: !this.state.modal,
    
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


  Gotologin () {
    this.props.history.push('/login')
  }


  onResetPassword () {

    if (this.state.password !== '' && this.state.rpassword !== '') {

      if(this.state.password !== this.state.rpassword)
      {
 this.setState({
  isError: true,
  errmessage: 'Password does not match!'
 })
      }
      else
      {
        this.setState({
  isError: false,

 })
        var formData = new FormData()
        formData.Password = this.state.password
        const UserName = this.state.email
        axios.put('/api/restaurants/resetpassword/'+UserName,{formData} ).then((res) => {

          if (res.data.success) {
            this.setState({
              modal: !this.state.modal,
            
            })
          } 
        }).catch((err) => {
            
            console.log(err)
              // on error
          })
      }
     
    }
  }
  componentDidMount () {

 
    if(this.props.user != null)
    {
      var email = this.props.user.data.UserName;
      this.setState({
        email:email
      })
    }
    else
    {
      this.props.history.push('/login')
    }
   
    document.body.classList.add('background')
  }
  componentWillMount () {

    document.body.classList.remove('background')
  }
  componentWillUnmount () {
   
    document.body.classList.remove('background')
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
    return (
      <Fragment>
        <div className='fixed-background' />
        <main>
          <div className='container'>
            <Row className='h-100'>
              <Colxx xxs='4' md='4' className='mx-auto my-auto'>
                <Card className='auth-card'>
                {AlertMessage}
                  <div className='form-side' style={{'width' : '100%', 'padding': '30px'}}>

                    <CardTitle className='mb-4'>
                      <IntlMessages id='Reset Password' />
                    </CardTitle>
                   
                    <Form>
                  
                      <Label className='form-group has-float-label mb-4'>
                        <Input type='password' name='password'  value={this.state.password} onChange={this.onTextChange} />
                        <IntlMessages id='New Password' />
                      </Label>

                      <Label className='form-group has-float-label mb-4'>
                        <Input type='password' name='rpassword'  value={this.state.rpassword} onChange={this.onTextChange} />
                        <IntlMessages id='Retype New Password' />
                      </Label>

                      <div className='d-flex justify-content-end align-items-center'>
                        <Button
                       
                          color='primary'
                          className='btn-shadow'
                          size='lg'  onClick={() => this.onResetPassword()}
                        >
                          <IntlMessages id='user.reset-password-button' />
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>
        <Modal isOpen={this.state.modal} toggle={this.toggle}
          className='modal-danger '>
          <ModalHeader></ModalHeader>
          <ModalBody>
                Your new password is updated successfully.
                  </ModalBody>
          <ModalFooter>
            <Button color='danger' onClick={this.Gotologin}>Ok</Button>{' '}
           
          </ModalFooter>
        </Modal>
      </Fragment>
    )
  }
}


function mapStateToProps (state) {

  const { user } = state.authUser

  return {
    user
  
  }
}
export default connect(
  mapStateToProps,
  {
    loginUserSuccess
  }
)(ResetPasswordLayout)

