import React, { Component, Fragment } from 'react';
import IntlMessages from 'Util/IntlMessages';
import { Row, Card, CardTitle, Form, Label, Input, Button ,   Modal,
  ModalHeader,
  ModalBody,Alert,
  ModalFooter } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios'

import { Colxx } from 'Components/CustomBootstrap';

class ForgotPasswordLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      modal: false,
      isError: false
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

    if (this.state.email !== '') {

      const UserName = this.state.email
      axios.put('/api/restaurants/forgotpassword/'+UserName ).then((res) => {
   
        if (res.data.success) {
          this.setState({
            isError: false,
            modal: !this.state.modal,
          
          })
        }
        else
        {
          this.setState({
            isError: true
          
          })
        } 
      }).catch((err) => {
          
          console.log(err)
            // on error
        })
    }
  }
  componentDidMount () {
    document.body.classList.add('background')
  }
  componentWillUnmount () {
    document.body.classList.remove('background')
  }
  render () {
    let AlertMessage = null
    if(this.state.isError)
    {
      AlertMessage = (
    <Alert color="danger">
       Email does not exists!
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
                      <IntlMessages id='user.forgot-password' />
                    </CardTitle>
                    <Form>
                      <Label className='form-group has-float-label mb-4'>
                        <Input type='email' name='email'  value={this.state.email} onChange={this.onTextChange} />
                        <IntlMessages id='user.email' />
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
                Your new password is sent on your Email.
                  </ModalBody>
          <ModalFooter>
            <Button color='danger' onClick={this.Gotologin}>Ok</Button>{' '}
           
          </ModalFooter>
        </Modal>
      </Fragment>
    )
  }
}

export default ForgotPasswordLayout
