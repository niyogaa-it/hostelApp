import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import {
  Row,
  Col,
  ButtonToolbar,
  Button,
  Tooltip,
  OverlayTrigger,
  Modal,
} from "react-bootstrap";
//import { Label } from 'reactstrap';
import { Link } from "react-router-dom";
import swal from "sweetalert";

import Layout from "../layout/Layout";
import whitelogo from "../../../assets/images/drreddylogo_white.png";
import API from "../../../shared/admin-axios";
import { showErrorMessage } from "../../../shared/handle_error";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

function LinkWithTooltip({ id, children, href, tooltip, clicked }) {
  return (
    <OverlayTrigger
      overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
      placement="left"
      delayShow={300}
      delayHide={150}
      trigger={["hover"]}
    >
      <Link to={href} onClick={clicked}>
        {children}
      </Link>
    </OverlayTrigger>
  );
}

const actionFormatter1 = (refObj) => (cell) => {
  return (
    <div className="actionStyle">
      <LinkWithTooltip
        tooltip="Click to Delete"
        href="#"
        clicked={(e) => refObj.confirmDelete(e, cell)}
        id="tooltip-1"
      >
        <i className="far fa-trash-alt" />
      </LinkWithTooltip>
    </div>
  );
};

class Region extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      get_access_data: false,
      activePage: 1,
      totalCount: 0,
      itemPerPage: 20,
      regionDetails: [],
      regionflagId: 0,
      selectStatus: [
        { id: "0", name: "Inactive" },
        { id: "1", name: "Active" },
      ],
      showModal: false,
      search_region_name: "",
      search_region_code: "",
      search_status: "",
      remove_search: false,
      showModalLoader: false,
      roombookinglist: [],
      roombookingcount: 0,
      Invalid:false,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.master_data_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
    API.get(`/admin/secure/building`)
      .then((res) => {
        this.setState({
          roombookinglist: res.data.result_data,
          roombookingcount: res.data.result_data.length,
        });
      })
      .catch((err) => {
        console.log("err:", err);
        showErrorMessage(err, this.props);
      });}
      else{
        {
          this.setState({
            Invalid: true,
          });
        }
      }
  }

  confirmDelete = (event, id) => {
    event.preventDefault();
    // swal delete api
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        API.post(`/admin/secure/building/delete/${id}`).then((res) => {
          if (res.data && res.data.status === 200) {
            swal({
              closeOnClickOutside: false,
              title: "Success",
              text: "Building deleted successfully.",
              icon: "success",
            });
            this.componentDidMount()
          } else {
            swal({
              closeOnClickOutside: false,
              // title: "Error",
              text: res.data.message,
              icon: "warning",
            });
            this.componentDidMount()
          }
        });
        //
      }
    });
  };

  handleEditBuilding = (event, id) => {
    console.log("id:", id);
    window.location.href = `/admin/edit_building/${id}`;
  };

  render() {
    const actionFormatter = () => (cell) => {
      return (
        <><button
        onClick={(e) => this.confirmDelete(e, cell)}
        style={{
          padding: "0.5rem",
          borderRadius: "5px",
          backgroundColor: "#ffe0db",
          color: "#ff3e1d",
          fontWeight: "bold",
          border: "none",
        }}
        >
        DELETE
        </button>
        <button
        onClick={(e) => this.handleEditBuilding(e, cell)}
        style={{
          padding: "0.5rem",
          borderRadius: "5px",
          backgroundColor: "#d7f5fc",
          color: "#883495",
          fontWeight: "bold",
          border: "none",
          margin: "3%"
        }}
      >
          EDIT
        </button></>
      );
    };
    if (this.state.Invalid) return <Redirect to="/admin/dashboard" />
    else {
    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <div className="row">
              <h3 className="card-title">
                <span className="sp1">Home /</span>
                <span className="sp1"> Master Data /</span>
                <span className="sp2"> Building List</span>
              </h3>
              <div className="col-lg-12 col-sm-12 col-xs-12"></div>
            </div>
          </section>
          <section className="content">
            <div className="box">
              <div className="box-body">
                <BootstrapTable
                  data={this.state.roombookinglist}
                  pagination
                  search
                >
                  <TableHeaderColumn
                    isKey
                    dataField="id"
                    dataAlign="center" 
                    dataSort
                    // dataFormat={custContent(this)}
                  >
                    Building ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="building_name"
                    dataAlign="center" 
                    dataSort
                    // dataFormat={custContent(this)}
                  >
                    Building Name
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="no_of_floor"  dataAlign="center" 
                    dataSort >
                    No of Floors
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="id"
                    dataFormat={actionFormatter(this)}
                    dataAlign="center" 
                  
                  >
                    Actions
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(Region));

