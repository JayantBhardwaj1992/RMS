import React from "react";
import { Colxx } from "Components/CustomBootstrap";
import { Nav, NavItem, NavLink } from "reactstrap";
import '../../assets/css/pagination.css'
class Pagination extends React.Component {
  componentDidMount() {}
  onChangePage(e) {
    this.props.onChangePage(e);
  }
  render() {
    const {
      totalPage = 0,
      currentPage = 1,
      numberLimit = 5,
      lastIsActive = true,
      firstIsActive = true
    } = this.props;

    let startPoint = 1;
    let endPoint = numberLimit;

    if (numberLimit > totalPage) {
      startPoint = 1;
      endPoint = totalPage;
    } else if (currentPage <= parseInt(numberLimit / 2, 10)) {
      startPoint = 1;
      endPoint = numberLimit;
    } else if (currentPage + parseInt(numberLimit / 2, 10) <= totalPage) {
      startPoint = currentPage - parseInt(numberLimit / 2, 10);
      endPoint = currentPage + parseInt(numberLimit / 2, 10);
    } else {
      startPoint = totalPage - (numberLimit - 1);
      endPoint = totalPage;
    }
    startPoint = startPoint === 0 ? 1 : startPoint;
    const points = [];
    for (var i = startPoint; i <= endPoint; i++) {
      points.push(i);
    }

    let firstPageButtonClassName = currentPage <= 1 ? "disabled" : "";
    let lastPageButtonClassName = currentPage >= totalPage ? "disabled" : "";
    let prevPageButtonClassName = currentPage <= 1 ? "disabled" : "";
    let nextPageButtonClassName = currentPage >= totalPage ? "disabled" : "";
    return totalPage > 1 ? (
 
        <Nav className="pagination justify-content-end" style={{'marginRight': '20px'}}>
          {firstIsActive && (
            <NavItem className={`page-item ${firstPageButtonClassName}`}>
              <NavLink style={{'lineHeight':'1', 'paddingRight':'0px', 'paddingLeft':'0px'}}
                className="page-link first"
                onClick={() => this.onChangePage(1)}
              >
                  <label style={{'marginLeft':'15px', 'marginRight':'15px'}}> Previous</label>
              </NavLink>
            </NavItem>
          )}

          <NavItem className={`page-item ${prevPageButtonClassName}`}>
            <NavLink style={{'lineHeight':'1', 'paddingLeft':'0px'}}
              className="page-link prev"
              onClick={() => this.onChangePage(currentPage - 1)}
            >
              <i className="simple-icon-arrow-left" />
            </NavLink>
          </NavItem>
          {points.map(i => {
            return (
              <NavItem
                key={i}
                className={`page-item ${currentPage === i && "active"}`}
              >
                <NavLink style={{'lineHeight':'1'}}
                  className="page-link"
                  onClick={() => this.onChangePage(i)}
                >
                  {i}
                </NavLink>
              </NavItem>
            );
          })}
          <NavItem className={`page-item ${nextPageButtonClassName}`}>
            <NavLink style={{'lineHeight':'1'}}
              className="page-link next"
              onClick={() => this.onChangePage(currentPage + 1)}
            >
              <i className="simple-icon-arrow-right" />
            </NavLink>
          </NavItem>
          {lastIsActive && (
            <NavItem className={`page-item ${lastPageButtonClassName}`}>
              <NavLink style={{'lineHeight':'1'}}
                className="page-link last"
                onClick={() => this.onChangePage(totalPage)}
              >
              <label style={{'marginLeft':'15px', 'marginRight':'15px'}}> Next</label>
               
              </NavLink>
            </NavItem>
          )}
        </Nav>
  
    ) : (
      <Colxx xxs="12" className="mt-2" />
    );
  }
}

export default Pagination;
