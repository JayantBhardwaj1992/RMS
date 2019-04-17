import React, { Component, Fragment } from "react";
import { injectIntl} from 'react-intl';
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import {
  Row,
  Card,
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonDropdown,
  UncontrolledDropdown,
  Collapse,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  CardBody,
  CardSubtitle,
  CardImg,
  Label,
  CardText,
  Badge,
  Table,
  CardHeader 
} from "reactstrap";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import CustomSelectInput from "Components/CustomSelectInput";
import classnames from "classnames";

import IntlMessages from "Util/IntlMessages";
import { Colxx, Separator } from "Components/CustomBootstrap";
import { BreadcrumbItems } from "Components/BreadcrumbContainer";

import Pagination from "Components/List/Pagination";
import mouseTrap from "react-mousetrap";
import axios from 'axios';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

function collect(props) {
  return { data: props.data };
}
const apiUrl ="http://api.crealeaf.com/cakes/paging"

class Category extends Component {
    constructor(props) {
      super(props);
      this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);
      this.toggleSplit = this.toggleSplit.bind(this);
      this.dataListRender = this.dataListRender.bind(this);
      this.toggleModal = this.toggleModal.bind(this);
      this.getIndex = this.getIndex.bind(this);
      this.onContextMenuClick = this.onContextMenuClick.bind(this);
      this.toggle = this.toggle.bind(this)
      this.delete = this.delete.bind(this)
      this.changeOrderBy = this.changeOrderBy.bind(this)
      this.onTextChange =this.onTextChange.bind(this)
      this.state = {
        displayMode: "list",
        pageSizes: [10, 20, 30, 50, 100],
        selectedPageSize: 10,
        categories:  [
          {label:'Cakes',value:'Cakes',key:0},
          {label:'Cupcakes',value:'Cupcakes',key:1},
          {label:'Desserts',value:'Desserts',key:2},
        ],
        orderOptions:[
          {column: "title",label: "Product Name"},
          {column: "category",label: "Category"},
          {column: "status",label: "Status"}
        ],
        selectedOrderOption:  "",
        selectedOrderField:"",
        dropdownSplitOpen: false,
        modalOpen: false,
        currentPage: 1,
        totalItemCount: 0,
        totalPage: 1,
        search: "",
        selectedItems: [],
        lastChecked: null,
        displayOptionsIsOpen: false,
        isLoading:false,
        Categories: [],
        RestaurantId:'',
        _id: '',
        index: 0
      };
    }
    changeOrderBy= (type, { sortField, sortOrder, data }) => {
  
      this.setState({
        selectedOrderField:sortField,
        selectedOrderOption: sortOrder,
        isLoading:true
      }, function(){
        this.dataListRender()
      })
    
   
      
    }
    delete () {
        var RestaurantId = this.state.RestaurantId
      axios.delete('/api/category/delete/' + this.state._id + '/' + RestaurantId, {token: localStorage.getItem('user_id') , RestaurantId: this.state.RestaurantId}).then((res) => {
       console.log(res)
        if (res.data.success) {    
          this.setState({
            modal: !this.state.modal
          }, function(){
            this.dataListRender()
          })   
       
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
    toggle (_id, index) {
      this.setState({
        modal: !this.state.modal,
        _id: _id,
        index: index
      })
    }
    componentWillMount() {
      this.props.bindShortcut(["ctrl+a", "command+a"], () =>
        this.handleChangeSelectAll(false)
      );
      this.props.bindShortcut(["ctrl+d", "command+d"], () => {
        this.setState({
          selectedItems: []
        });
        return false;
      });

    
    }

    toggleModal() {
      this.setState({
        modalOpen: !this.state.modalOpen
      });
    }
    toggleDisplayOptions() {
      this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
    }
    toggleSplit() {
      this.setState(prevState => ({
        dropdownSplitOpen: !prevState.dropdownSplitOpen
      }));
    }
    changeOrderBy(column) {
      this.setState(
        {
          selectedOrderOption: this.state.orderOptions.find(
            x => x.column === column
          )
        },
        () => this.dataListRender()
      );
    }
    changePageSize(size) {
      this.setState(
        {
          selectedPageSize: size,
          currentPage: 1
        },
        () => this.dataListRender()
      );
    }
    changeDisplayMode(mode) {
      this.setState({
        displayMode: mode
      });
      return false;
    }
    onChangePage(page) {
      this.setState(
        {
          currentPage: page
        },
        () => this.dataListRender()
      );
    }
    onTextChange (event) {     
      const target = event.target
      var search = target.value
      const name = target.name
      this.setState({
        [name]: search,
        isLoading:true
      },  function(){
        this.dataListRender()
      })

    }
    handleKeyPress(e) {
      if (e.key === "Enter") {
        this.setState(
          {
            search: e.target.value.toLowerCase()
          },
          () => this.dataListRender()
        );
      }
    }

    handleCheckChange(event, id) {
      if (
        event.target.tagName == "A" ||
        (event.target.parentElement &&
          event.target.parentElement.tagName == "A")
      ) {
        return true;
      }
      if (this.state.lastChecked == null) {
        this.setState({
          lastChecked: id
        });
      }

      let selectedItems = this.state.selectedItems;
      if (selectedItems.includes(id)) {
        selectedItems = selectedItems.filter(x => x !== id);
      } else {
        selectedItems.push(id);
      }
      this.setState({
        selectedItems
      });

      if (event.shiftKey) {
        var items = this.state.items;
        var start = this.getIndex(id, items, "id");
        var end = this.getIndex(this.state.lastChecked, items, "id");
        items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
        selectedItems.push(
          ...items.map(item => {
            return item.id;
          })
        );
        selectedItems = Array.from(new Set(selectedItems));
        this.setState({
          selectedItems
        });
      }
      document.activeElement.blur();
    }

    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    }
    handleChangeSelectAll(isToggle) {
      if (this.state.selectedItems.length >= this.state.items.length) {
        if (isToggle) {
          this.setState({
            selectedItems: []
          });
        }
      } else {
        this.setState({
          selectedItems: this.state.items.map(x => x.id)
        });
      }
      document.activeElement.blur();
      return false;
    }
    componentDidMount() {
      this.setState({
        RestaurantId: this.props.user.RestaurantDetail.ResId
      }, function(){
        this.dataListRender()
      })
    
    }

    dataListRender() {
      const {selectedPageSize,currentPage,selectedOrderOption , selectedOrderField , RestaurantId} = this.state;
      var   search  = this.state.search.trim() === "" ? "no":this.state.search
      const pageSize = selectedPageSize
      const orderBy = selectedOrderField === "" ? "CreatedOn" : selectedOrderField
      const orderAs = selectedOrderOption === "" ? "desc" : selectedOrderOption
      axios.get('/api/category/list/' + pageSize + '/' + currentPage +'/'+ orderBy + '/' + orderAs + '/'+ search + '/' + RestaurantId, {token: localStorage.getItem('user_id')}).then((res) => { 
        if (res.data.success) {
          var  totalPages = 0
         if(res.data.Data.length > 0)
         {
            totalPages =Math.ceil(res.data.Count/pageSize);
         }

          this.setState({
             totalPage: parseInt(totalPages),
             Categories: res.data.Data,
             totalItemCount : res.data.Count,
             isLoading:true
           });
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

    onContextMenuClick = (e, data, target) => {
      console.log("onContextMenuClick - selected items",this.state.selectedItems)
      console.log("onContextMenuClick - action : ", data.action);
    };

    onContextMenu = (e, data) => {
      const clickedProductId = data.data;
      if (!this.state.selectedItems.includes(clickedProductId)) {
        this.setState({
          selectedItems :[clickedProductId]
        });
      }

      return true;
    };
  
    render() {
      const columns = [{
        dataField: '_id',
        text: 'S.No.',
        headerAlign: 'center',
        style: {
         
          width:'8%'
        },
        headerStyle: {
          width:'8%'
        },
        align: 'center',
        formatter: (cell, row, rowIndex, extraData) => (
            <span>{(this.state.currentPage-1)*this.state.selectedPageSize + rowIndex +1}
            </span>    
        )
      }, 
      
      {
        dataField: 'CategoryName',
        text: 'Category Name',
        headerAlign: 'center',
        align: 'center',
       
        sort: true,
        sortCaret: (order, column) => {
          if (!order) return (<i className='fas fa-sort' style={{'float': 'right'}} />);
          else if (order === 'asc') return (<i className='fas fa-sort-amount-up'  style={{'float': 'right'}} />);
          else if (order === 'desc') return (<i className='fas fa-sort-amount-down'  style={{'float': 'right'}} />);
          return null;
        }
      },
      {
        dataField: 'IsActive',
        text: 'Active/Inactive',
        headerAlign: 'center',
        align: 'center',
      
        sort: true,
        sortCaret: (order, column) => {
          if (!order) return (<i className='fas fa-sort' style={{'float': 'right'}} />);
          else if (order === 'asc') return (<i className='fas fa-sort-amount-up'  style={{'float': 'right'}} />);
          else if (order === 'desc') return (<i className='fas fa-sort-amount-down'  style={{'float': 'right'}} />);
          return null;
        },
        formatter: (cell, row, rowIndex, extraData) => (
          <Badge color={row.IsActive ? 'success' : 'danger'}>{row.IsActive ? 'Active' : 'InActive'}</Badge>   
      )
      },
      {
        text: 'Action',
        style: {       
          width:'12%'
        },
        headerStyle: {
          width:'12%'
        },
        formatter: (cell, row, rowIndex, extraData) => (
          
         <div>
           
              <Link to={`/app/category/detail/${row._id}`} data-toggle="tooltip" title="Detail" ><i className='iconsmind-Information' /></Link>
                  <Link to={`/app/category/edit/${row._id}`} style={{'marginLeft': '15px'}} data-toggle="tooltip" title="Edit" ><i className='simple-icon-pencil' /></Link>
                  <Link to='#'onClick={e => this.toggle(row._id, rowIndex)} style={{'marginLeft': '15px'}} data-toggle="tooltip" title="Delete" ><i className='simple-icon-trash' /></Link>
         </div>  
      )
      }
      ];



 var categories = this.state.Categories




      const category = this.state.Categories.slice(0).reverse().map((res, index) => (

        <tr key={index}>
          <td>{index + 1 }</td>
          <td>{res.CategoryName}</td>    
          <td>
            <Badge color={res.IsActive ? 'success' : 'danger'}>{res.IsActive ? 'Active' : 'InActive'}</Badge>
          </td>
          <td>
          <Link to={`/app/category/detail/${res._id}`} data-toggle="tooltip" title="Detail" ><i className='iconsmind-Information' /></Link>
            <Link to={`/app/category/edit/${res._id}`} data-toggle="tooltip" title="Edit" style={{'marginLeft': '15px'}} ><i className='simple-icon-pencil' /></Link>
            <Link to='#'onClick={e => this.toggle(res._id, index)} data-toggle="tooltip" title="Delete" style={{'marginLeft': '15px'}} ><i className='simple-icon-trash' /></Link>
          </td>
        </tr>
      ))




      const startIndex= (this.state.currentPage-1)*this.state.selectedPageSize
      const endIndex= (this.state.currentPage)*this.state.selectedPageSize
      const {messages} = this.props.intl;
      return (
        !this.state.isLoading?
          <div className="loading"></div>
       :
        <Fragment>
        <div className="disable-text-selection">
            <Row>
              <Colxx xxs="12" style={{'paddingRight':'0px', 'paddingLeft':'0px'}} >
       
              <label className="col-md-3" style={{'paddingRight':'0px', 'paddingLeft':'0px'}}><h5 style={{'marginTop':'.5rem'}}><b>Category list</b></h5></label>  
            
              
                <Link className='btn btn btn-primary' style={{'float':'right' ,'marginBottom':'15px'}} color='primary' to={`/app/category/add`} >New Category<img className='img img-responsive' style={{'marginLeft':'10px','marginBottom':'5px', 'height':'22px'}} src='../../assets/img/hotel-white.png'></img></Link>
                    {"  "}    
        
              </Colxx>
            </Row>
            <Row>
            <Card>
              <CardHeader>
                <div className='row'>
                  <div className='col-md-8'>
                  <div className="float-md-left">
                      <span className="text-muted text-small mr-1">{`${startIndex +1}-${endIndex} of ${
                        this.state.totalItemCount
                      } `}</span>
                      <UncontrolledDropdown className="d-inline-block">
                        <DropdownToggle caret color="outline-blue" size="xs">
                          {this.state.selectedPageSize}
                        </DropdownToggle>
                        <DropdownMenu right style={{'minWidth':'3rem'}}>
                          {this.state.pageSizes.map((size, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                onClick={() => this.changePageSize(size)}
                              >
                                {size}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </div>
                  <div className='col-md-1' >
                  <label style={{'display': 'inline-block', 'float': 'right', 'marginRight': '10px', 'verticalAlign': 'middle', 'marginTop':'0.4rem'}}>search :</label>
                  </div>
                  <div className='col-md-3'>
                
                  <input value={this.state.search} className="form-control" type='text' id='search' name='search'  style={{'display': 'inline-block', 'float': 'right'}} onChange={this.onTextChange}  />
                 
                  </div>
                </div>
             
               </CardHeader>
              <CardBody style={{'padding':'0px'}}>
                <div id='table'>
                <BootstrapTable  keyField='_id'  remote={ { sort: true } } data={  categories }  columns={ columns } bordered={ true } noDataIndication="Table is Empty" onTableChange={this.changeOrderBy}   hover condensed   />
                </div>
                <div className='row'>
                  
      <div className='col-md-12'>
        <Pagination style={{'lineHeight':'1.2', 'float':'right'}}
                currentPage={this.state.currentPage}
                totalPage={this.state.totalPage}
                onChangePage={i => this.onChangePage(i)}
              />

</div>
                    </div>
                   
                  </CardBody>
                  

           </Card>

            </Row>
          </div>

          <ContextMenu
            id="menu_id"
            onShow={e => this.onContextMenu(e, e.detail.data)}
          >
            <MenuItem
              onClick={this.onContextMenuClick}
              data={{ action: "copy" }}
            >
              <i className="simple-icon-docs" /> <span>Copy</span>
            </MenuItem>
            <MenuItem
              onClick={this.onContextMenuClick}
              data={{ action: "move" }}
            >
              <i className="simple-icon-drawer" /> <span>Move to archive</span>
            </MenuItem>
            <MenuItem
              onClick={this.onContextMenuClick}
              data={{ action: "delete" }}
            >
              <i className="simple-icon-trash" /> <span>Delete</span>
            </MenuItem>
          </ContextMenu>
          <Modal isOpen={this.state.modal} toggle={this.toggle}
          className='modal-danger '>
          <ModalHeader toggle={this.toggleDanger}>Delete Category</ModalHeader>
          <ModalBody>
                Are you sure to delete this Category?
                  </ModalBody>
          <ModalFooter>
            <Button color='danger' onClick={this.delete}>Yes</Button>{' '}
            <Button color='secondary' onClick={this.toggle}>No</Button>
          </ModalFooter>
        </Modal>
        </Fragment>
      );
    }
  }



  const mapStateToProps = ({  authUser }) => {

      const { user } = authUser
      return {
      
        user
      }
    };
    export default withRouter(
      connect(
        mapStateToProps
      )(injectIntl(mouseTrap(Category)))
    )
    

