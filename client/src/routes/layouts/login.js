import React, { Component, Fragment } from 'react';
import IntlMessages from 'Util/IntlMessages';
import { Row, Card, CardTitle, Form, Label, Input, Button, Alert} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import { Colxx } from 'Components/CustomBootstrap';

import { connect } from 'react-redux';
import { loginUser } from 'Redux/actions';

class LoginLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      isRestaurant: false,
      isError: false

    }
    this.onTextChange = this.onTextChange.bind(this)
  }
  onUserLogin = () => {

    if (this.state.email !== '' && this.state.password !== '') {
       this.props.loginUser(this.state, this.props.history)

     
    }
   
   
  }

  componentWillReceiveProps(preProps) {

    if(preProps.user != null || preProps.user != undefined)
    {
      if(!preProps.user.isLogin)
      {
         this.setState({
          isError:true
         })
       
      }
    }
   
    // this.setState({
    //   modified: nextProps.myProp + "IsSoModified"
    // });
  }
  onTextChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }
  componentDidMount () {
     document.title = "Restaurant Management System  ( Version 1.0 )"
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
        Invalid Email or Password!
      </Alert>
      )
    }
    return (
      <Fragment>
        <div className='fixed-background' style={{'background' : 'url(/assets/img/superAdminbg.jpg) no-repeat center center fixed' , 'backgroundSize': 'cover'}} />
        <main>
          <div className='container'>
            <Row className='h-100'>
              <Colxx xxs='4' md='4' className='mx-auto my-auto'>
                <Card className='auth-card'>
                {AlertMessage}
                  <div className='form-side' style={{'width': '100%', 'padding': '50px'}}>

                    <CardTitle className='mb-4'>
                      <IntlMessages id='user.login-title' />
                    </CardTitle>
                    <Form>
                      <Label className='form-group has-float-label mb-4'>
                        <Input type='email' name='email' defaultValue={this.state.email} onChange={this.onTextChange} />
                        <IntlMessages id='user.email' />
                      </Label>
                      <Label className='form-group has-float-label mb-4'>
                        <Input type='password' name='password' onChange={this.onTextChange} />
                        <IntlMessages
                          id='user.password' 
                          defaultValue={this.state.password}
                        />
                      </Label>
                      <div className='d-flex justify-content-between align-items-center'>
                        <NavLink to={`/forgot-password`}>
                          <IntlMessages id='user.forgot-password-question' />
                        </NavLink>
                        <Button
                          color='primary'
                          className='btn-shadow'
                          size='lg'
                          onClick={() => this.onUserLogin()}
                        >
                          <IntlMessages id='user.login-button' />
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>
      </Fragment>
    )
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(
  mapStateToProps,
  {
    loginUser
  }
)(LoginLayout);
