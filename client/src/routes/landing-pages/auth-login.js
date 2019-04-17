import React, { Component, Fragment } from "react";
import { Container, Row, Button, Label, Input, Form , Card  , CardTitle , Alert} from "reactstrap";
import { MenuMultipage, MenuMultipageMobile } from "Components/LandingPage/SectionMenu";
import Headroom from 'react-headroom';
import scrollToComponent from 'react-scroll-to-component';
import { NavLink } from "react-router-dom";
import { injectIntl } from 'react-intl';
import { Colxx } from "Components/CustomBootstrap";
import IntlMessages from "Util/IntlMessages";

import { connect } from "react-redux";
import {landingPageMobileMenuToggle,landingPageMobileMenuClose , loginUser} from "Redux/actions";


class AuthLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isRestaurant: true,
      isError: false
    }
    this.onTextChange = this.onTextChange.bind(this)
 
  }
  onTextChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }
  onUserLogin () {

    if (this.state.email !== '' && this.state.password !== '') {
       this.props.loginUser(this.state, this.props.history)
    }

  }
  onMobileMenuToggle(){
    this.props.landingPageMobileMenuToggle()
  }
  onUnmountingMobileMenu(){
    this.props.landingPageMobileMenuClose()
    return true;
  }
  onResizeLandingPage() {
    //var rowOffestHome = document.querySelector(".home-row").offsetLeft;
   // document.querySelector(".landing-page .section.home").style.backgroundPositionX=rowOffestHome - 270 + "px";
}
  componentDidMount() {
    document.title = "Restaurant Admin"
    scrollToComponent(this["home"], { align: 'top', duration: 10 });
    this.onResizeLandingPage()
    window.addEventListener("resize", this.onResizeLandingPage, true);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResizeLandingPage, true);
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
}
  render() {
    const { messages } = this.props.intl;
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
        <div className='fixed-background' style={{'background' : 'url(/assets/img/Restaurantbg.jpg) no-repeat center center fixed' , 'backgroundSize': 'cover'}} />
        <main style={{'marginLeft':'135px'}}>
          <div className='container'>
            <Row className='h-100'>
              <Colxx xxs='4' md='4' className='mx-auto my-auto'>
                <Card className='auth-card'>
                {AlertMessage}
                  <div className='form-side' style={{'width': '100%', 'padding': '40px'}}>

                    <CardTitle className='mb-4'>
                      <IntlMessages id='user.login-title' />
                    </CardTitle>
                    <Form className="dark-background">

<Label className="form-group has-top-label">
  <Input type="email" value={this.state.email} name='email' onChange={this.onTextChange} />
  <IntlMessages id="lp.login.email" />
</Label>

<Label className="form-group has-top-label">
  <Input type="password" value={this.state.password} name='password' onChange={this.onTextChange} />
  <IntlMessages id="lp.login.password" />
</Label>

<Button color='primary' className='btn-shadow'
                          size='lg'
                          onClick={() => this.onUserLogin()} style={{'float': 'right'}}>
  {messages["lp.login.buttonlabel"]}
</Button>

</Form>
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>
      </Fragment>



    );
  }
}


const mapStateToProps = ({ landingPage , authUser }) => {
  const { isMobileMenuOpen } = landingPage;
  const { user, loading } = authUser;
  return { isMobileMenuOpen , user ,loading  };
}




export default connect(mapStateToProps, {landingPageMobileMenuToggle,landingPageMobileMenuClose , loginUser})(injectIntl(AuthLogin))