import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import IntlMessages from 'Util/IntlMessages';
import { Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import {
  setContainerClassnames,
  addContainerClassname,
  changeDefaultClassnames,
  loginUserSuccess
} from 'Redux/actions';

class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.addEvents = this.addEvents.bind(this)
    this.removeEvents = this.removeEvents.bind(this)
    this.handleDocumentClick = this.handleDocumentClick.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handleProps = this.handleProps.bind(this)
    this.getContainer = this.getContainer.bind(this)
    this.getMenuClassesForResize = this.getMenuClassesForResize.bind(this)
    this.setSelectedLiActive = this.setSelectedLiActive.bind(this)
    this.setLiActive = this.setLiActive.bind(this)

    this.state = {
      selectedParentMenu: '',
      viewingParentMenu: '',
      Role: ''
    }
  }
 
  handleWindowResize (event) {
    if (event && !event.isTrusted) {
      return
    }
    const { containerClassnames } = this.props
    let nextClasses = this.getMenuClassesForResize(containerClassnames)
    this.props.setContainerClassnames(0, nextClasses.join(' '))
  }

  handleDocumentClick (e) {
    const container = this.getContainer()
    let isMenuClick = false
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('menu-button') ||
        e.target.classList.contains('menu-button-mobile'))
    ) {
      isMenuClick = true
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      (e.target.parentElement.classList.contains('menu-button') ||
        e.target.parentElement.classList.contains('menu-button-mobile'))
    ) {
      isMenuClick = true
    } else if (
      e.target.parentElement &&
      e.target.parentElement.parentElement &&
      e.target.parentElement.parentElement.classList &&
      (e.target.parentElement.parentElement.classList.contains('menu-button') ||
        e.target.parentElement.parentElement.classList.contains(
          'menu-button-mobile'
        ))
    ) {
      isMenuClick = true
    }
    if (
      (container.contains(e.target) || container === e.target) ||
      isMenuClick
    ) {
      return
    }
    this.toggle(e)
    this.setState({
      viewingParentMenu: ''
    })
  }

  getMenuClassesForResize (classes) {
    const { menuHiddenBreakpoint, subHiddenBreakpoint } = this.props
    let nextClasses = classes.split(' ').filter(x => x != '')
    const windowWidth = window.innerWidth
    if (windowWidth < menuHiddenBreakpoint) {
      nextClasses.push('menu-mobile')
    } else if (windowWidth < subHiddenBreakpoint) {
      nextClasses = nextClasses.filter(x => x != 'menu-mobile')
      if (
        nextClasses.includes('menu-default') &&
        !nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses.push('menu-sub-hidden')
      }
    } else {
      nextClasses = nextClasses.filter(x => x != 'menu-mobile')
      if (
        nextClasses.includes('menu-default') &&
        nextClasses.includes('menu-sub-hidden')
      ) {
        nextClasses = nextClasses.filter(x => x != 'menu-sub-hidden')
      }
    }
    return nextClasses
  }

  getContainer () {
    return ReactDOM.findDOMNode(this)
  }

  toggle () {
    const { containerClassnames, menuClickCount } = this.props
    const currentClasses = containerClassnames
      ? containerClassnames.split(' ').filter(x => x != '')
      : '';

    if (currentClasses.includes('menu-sub-hidden') && menuClickCount == 3) {
      this.props.setContainerClassnames(2, containerClassnames)
    } else if (
      currentClasses.includes('menu-hidden') ||
      currentClasses.includes('menu-mobile')
    ) {
      this.props.setContainerClassnames(0, containerClassnames)
    }
  }

  handleProps () {
    this.addEvents()
  }

  addEvents () {
    ['click', 'touchstart'].forEach(event =>
      document.addEventListener(event, this.handleDocumentClick, true)
    )
  }
  removeEvents () {
    ['click', 'touchstart'].forEach(event =>
      document.removeEventListener(event, this.handleDocumentClick, true)
    )
  }
  setLiActive(e, ActiveName)
  {
    const oldli = document.querySelector('li.active')
    if (oldli != null) {
      oldli.classList.remove('active')
      e.target.parentElement.parentElement.classList.add('active')
    }
  }
  setSelectedLiActive () {
    var oldli = document.querySelector('.sub-menu  li.active')
    if (oldli != null) {
      oldli.classList.remove('active')
    }
    else
    {
      oldli = document.querySelector('li.active')
      if (oldli != null) {
        oldli.classList.remove('active')
      }
    }
    /* set selected parent menu */
    const selectedlink = document.querySelector('.sub-menu  a.active')
    if (selectedlink != null) {
      selectedlink.parentElement.classList.add('active')
      this.setState({
        selectedParentMenu: selectedlink.parentElement.parentElement.getAttribute(
          'data-parent'
        )
      })
    } else{
      var selectedParentNoSubItem = document.querySelector('.main-menu  li a.active')
      if (selectedParentNoSubItem != null) {
        this.setState({
          selectedParentMenu: selectedParentNoSubItem.getAttribute(
            'data-flag'
          )
        })
      } else if (this.state.selectedParentMenu == '') {
        this.setState({
          selectedParentMenu: 'dashboards'
        })
      }
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setSelectedLiActive()
      this.toggle()
      window.scrollTo(0, 0)
    }
    this.handleProps()
  }

  componentDidMount () {
    this.setState({
      Role: this.props.user.Role
    })
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
    this.handleProps()
    this.setSelectedLiActive()
  }

  componentWillUnmount () {
    this.removeEvents()
    window.removeEventListener('resize', this.handleWindowResize)
  }

  changeDefaultMenuType (e, containerClassnames) {
    e.preventDefault()
    let nextClasses = this.getMenuClassesForResize(containerClassnames)
    this.props.setContainerClassnames(0, nextClasses.join(' '))
  }

  openSubMenu (e, selectedParent) {
    e.preventDefault()
 
    const { containerClassnames, menuClickCount } = this.props
    const currentClasses = containerClassnames
      ? containerClassnames.split(' ').filter(x => x != '')
      : '';

    if (!currentClasses.includes('menu-mobile')) {
 
      if (
        currentClasses.includes('menu-sub-hidden') &&
        (menuClickCount == 2 || menuClickCount == 0)
      ) {
        this.props.setContainerClassnames(3, containerClassnames)
      } else if (
        currentClasses.includes('menu-hidden') &&
        (menuClickCount == 1 || menuClickCount == 3)
      ) {
        this.props.setContainerClassnames(2, containerClassnames)
      } else if (
        currentClasses.includes('menu-default') &&
        !currentClasses.includes('menu-sub-hidden') &&
        (menuClickCount == 1 || menuClickCount == 3)
      ) {
        this.props.setContainerClassnames(0, containerClassnames)
      }
    } else {
      this.props.addContainerClassname(
        'sub-show-temporary',
        containerClassnames
      )
    }
    this.setState({
      viewingParentMenu: selectedParent
    })
  }
  changeViewingParentMenu (menu) {
    this.toggle()

    this.setState({
      viewingParentMenu: menu
    })
  }

  render () {
    var Role = this.state.Role
    let RoleNav = null

    if(Role === "SuperAdmin")
    {
      RoleNav = (
        <div className='scroll'>
        <PerfectScrollbar
          option={{ suppressScrollX: true, wheelPropagation: false }}
        >
          <Nav vertical className='list-unstyled'>
            {/* <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'dashboards' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'dashboards')
              })}
            >
              <NavLink
                to='/app/dashboards/default'
                onClick={e => this.setLiActive(e, 'dashboards')}
              >
                <i className='iconsmind-Shop-4' />{' '}
                <IntlMessages id='menu.dashboards' />
              </NavLink>
            </NavItem> */}
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'Restaurants' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'Restaurants')
              })}
            >
              <NavLink
                to='/app/restaurants'

              >
                <i className='iconsmind-Hotel' />{' '}
                <IntlMessages id='Restaurants' />
              </NavLink>
            </NavItem>

            {/* <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'layouts' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'layouts')
              })}
            >
              <NavLink
                to='/app/layouts'
                onClick={e => this.openSubMenu(e, 'layouts')}
              >
                <i className='iconsmind-Digital-Drawing' />{' '}
                <IntlMessages id='menu.layouts' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'applications' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'applications')
              })}
            >
              <NavLink
                to='/app/applications'
                onClick={e => this.openSubMenu(e, 'applications')}
              >
                <i className='iconsmind-Air-Balloon' />{' '}
                <IntlMessages id='menu.applications' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'ui' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'ui')
              })}
            >
              <NavLink
                to='/app/ui'
                onClick={e => this.openSubMenu(e, 'ui')}
              >
                <i className='iconsmind-Pantone' />{' '}
                <IntlMessages id='menu.ui' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'landingpage' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'landingpage')
              })}
            >
              <NavLink
                to='/landingpage'
                onClick={e => this.openSubMenu(e, 'landingpage')}
              >
                <i className='iconsmind-Space-Needle' />{' '}
                <IntlMessages id='menu.landingpage' />
              </NavLink>
            </NavItem>

            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'menu' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'menu')
              })}
            >
              <NavLink
                to='/app/menu'
                onClick={e => this.openSubMenu(e, 'menu')}
              >
                <i className='iconsmind-Three-ArrowFork' />{' '}
                <IntlMessages id='menu.menu' />
              </NavLink>
            </NavItem> */}
          </Nav>
        </PerfectScrollbar>
      </div>
      )
    }
    else if(Role === 'RAdmin')
    {
      RoleNav = (
        <div className='scroll'>
        <PerfectScrollbar
          option={{ suppressScrollX: true, wheelPropagation: false }}
        >
          <Nav vertical className='list-unstyled'>
           
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'Category' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'Category')
              })}
            >
              <NavLink
                to='/app/category'
                onClick={e => this.setLiActive(e, 'Category')}
              >
                <i className='iconsmind-Hotel' />{' '}
                <IntlMessages id='Category' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'Items' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'Items')
              })}
            >
              <NavLink
                to='/app/items'
                onClick={e => this.setLiActive(e, 'Items')}
              >
                <i className='iconsmind-Hotel' />{' '}
                <IntlMessages id='Items' />
              </NavLink>
            </NavItem> 
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'Tax' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'Tax')
              })}
            >
              <NavLink
                to='/app/tax'
                onClick={e => this.setLiActive(e, 'Tax')}
              >
                <i className='iconsmind-Hotel' />{' '}
                <IntlMessages id='Tax' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'Premisestype' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'Premisestype')
              })}
            >
              <NavLink
                to='/app/premisestype'
                onClick={e => this.setLiActive(e, 'Tax')}
              >
                <i className='iconsmind-Hotel' />{' '}
                <IntlMessages id='Premises Type' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'Restaurant Premises' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'Restaurant Premises')
              })}
            >
              <NavLink
                to='/app/restaurantpremises'
                onClick={e => this.setLiActive(e, 'Tax')}
              >
                <i className='iconsmind-Hotel' />{' '}
                <IntlMessages id='Restaurant Premises' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'Role' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'Role')
              })}
            >
              <NavLink
                to='/app/role'
                onClick={e => this.setLiActive(e, 'Role')}
              >
                <i className='iconsmind-Hotel' />{' '}
                <IntlMessages id='Role' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'RestaurantUsers' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'RestaurantUsers')
              })}
            >
              <NavLink
                to='/app/restaurantusers'
                onClick={e => this.setLiActive(e, 'RestaurantUsers')}
              >
                <i className='iconsmind-Hotel' />{' '}
                <IntlMessages id='Restaurant Users' />
              </NavLink>
            </NavItem>
            {/* <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'dashboards' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'dashboards')
              })}
            >
              <NavLink
                to='/app/dashboards/default'
                onClick={e => this.openSubMenu(e, 'dashboards')}
              >
                <i className='iconsmind-Shop-4' />{' '}
                <IntlMessages id='menu.dashboards' />
              </NavLink>
            </NavItem> */}
            {/* <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'layouts' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'layouts')
              })}
            >
              <NavLink
                to='/app/layouts'
                onClick={e => this.openSubMenu(e, 'layouts')}
              >
                <i className='iconsmind-Digital-Drawing' />{' '}
                <IntlMessages id='menu.layouts' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'applications' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'applications')
              })}
            >
              <NavLink
                to='/app/applications'
                onClick={e => this.openSubMenu(e, 'applications')}
              >
                <i className='iconsmind-Air-Balloon' />{' '}
                <IntlMessages id='menu.applications' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'ui' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'ui')
              })}
            >
              <NavLink
                to='/app/ui'
                onClick={e => this.openSubMenu(e, 'ui')}
              >
                <i className='iconsmind-Pantone' />{' '}
                <IntlMessages id='menu.ui' />
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'landingpage' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'landingpage')
              })}
            >
              <NavLink
                to='/landingpage'
                onClick={e => this.openSubMenu(e, 'landingpage')}
              >
                <i className='iconsmind-Space-Needle' />{' '}
                <IntlMessages id='menu.landingpage' />
              </NavLink>
            </NavItem>

            <NavItem
              className={classnames({
                active: ((this.state.selectedParentMenu == 'menu' && this.state.viewingParentMenu == '') || this.state.viewingParentMenu == 'menu')
              })}
            >
              <NavLink
                to='/app/menu'
                onClick={e => this.openSubMenu(e, 'menu')}
              >
                <i className='iconsmind-Three-ArrowFork' />{' '}
                <IntlMessages id='menu.menu' />
              </NavLink>
            </NavItem> */}
          </Nav>
        </PerfectScrollbar>
      </div>
      )
    }
    return (
      <div className='sidebar'>
        <div className='main-menu'>
         {RoleNav}
        </div>

      
      </div>
    )
  }
}

const mapStateToProps = ({ menu , authUser }) => {

  const {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount

  } = menu
  const { user } = authUser
  return {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    user
  }
};
export default withRouter(
  connect(
    mapStateToProps,
    { setContainerClassnames, addContainerClassname, changeDefaultClassnames }
  )(Sidebar)
)
