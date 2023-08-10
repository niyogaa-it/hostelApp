import React, { Component } from "react";
import moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Tooltip, OverlayTrigger, Modal } from "react-bootstrap";
//import { Label } from 'reactstrap';
import { Link } from "react-router-dom";
import swal from "sweetalert";
import Layout from "../layout/Layout";
import whitelogo from "../../../assets/images/logo.svg";
import API from "../../../shared/admin-axios";
import { showErrorMessage } from "../../../shared/handle_error";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

const dateFormatting = () => (date) => {
  return moment(date).format("dddd, DD/MM/YYYY");
};
const descriptionlinebreak = (item) => {
  return (
    <>
      <span style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
        {item}
      </span>
    </>
  );
};
const imageShow = () => (img) => {
  return (
    <>
      <img style={{ width: "100%" }} src={img} alt="" />
    </>
  );
};

class EventsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      eventsList: [],
      eventsCount: 0,
      Invalid: false,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.events == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/events`)
        .then((res) => {
          this.setState({
            eventsList: res.data.result_data,
            eventsCount: res.data.result_data.length,
            isLoading: false,
          });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          console.log("err:", err);
          showErrorMessage(err, this.props);
        });
    } else {
      this.setState({
        Invalid: true,
      });
    }
  }

  confirmDelete = (event, id) => {
    event.preventDefault();
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.deleteEvent(id);
      }
    });
  };

  deleteEvent = (id) => {
    if (id) {
      API.post(`/admin/secure/event/del/`, { id: id })
        .then((res) => {
          swal({
            closeOnClickOutside: false,
            title: "Success",
            text: "Event deleted successfully.",
            icon: "success",
          }).then(() => {
            this.setState({ activePage: 1 });
            this.componentDidMount();
          });
        })
        .catch((err) => {
          showErrorMessage(err, this.props);
        });
    }
  };

  handleEditEvent = (event, id) => {
    window.location.href = `/admin/event_edit/${id}`;
  };

  render() {
    const actionFormatter = () => (cell) => {
      return (
        <>
        <button
        onClick={(e) => this.handleEditEvent(e, cell)}
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
        </button>
        <button
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
        </>
      );
    };
    if (this.state.isLoading === true) {
      return (
        <>
          <div className="loderOuter">
            <div className="loading_reddy_outer">
              <div className="loading_reddy">
                {/*    <img src={whitelogo} alt="logo" /> */}
              </div>
            </div>
          </div>
        </>
      );
    } else {
      if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
      else {
        return (
          <Layout {...this.props}>
            <div className="content-wrapper">
              <section className="content-header">
                <div className="row">
                  <h3 className="card-title">
                    <span className="sp1">Home /</span>
                    <span className="sp2"> Events List</span>
                  </h3>
                  <div className="col-lg-12 col-sm-12 col-xs-12"></div>
                </div>
              </section>
              <section></section>
              <section className="content">
                <div className="box">
                  <div className="box-body">
                    <BootstrapTable
                      data={this.state.eventsList}
                      search
                      pagination
                    >
                      <TableHeaderColumn
                        isKey
                        dataField="id"
                        dataSort={true}
                        dataAlign="center"
                      >
                        ID
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="image_url"
                        dataFormat={imageShow(this)}
                        dataAlign="center"
                      >
                        EVENT IMAGE
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="event_name"
                        dataSort={true}
                        dataAlign="center"
                        dataFormat={descriptionlinebreak}
                      >
                        EVENT NAME
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="event_start_date"
                        dataFormat={dateFormatting(this)}
                        dataSort={true}
                        dataAlign="center"
                      >
                        EVENT START TIME
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="event_end_date"
                        dataFormat={dateFormatting(this)}
                        dataSort={true}
                        dataAlign="center"
                      >
                        EVENT END TIME
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="des"
                        dataSort={true}
                        dataAlign="center"
                        dataFormat={descriptionlinebreak}
                      >
                        DESCRIPTION
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="id"
                        dataAlign="center"
                        dataFormat={actionFormatter(this)}
                      >
                        ACTION
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
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(EventsList));
