import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Tooltip, OverlayTrigger, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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

class CheckRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkroomlist: [],
      roomcount: 0,
      Invalid: false,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.master_data_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/room/room_list`)
        .then((res) => {
          this.setState({
            checkroomlist: res.data.result_data,
            roomcount: res.data.result_data.length,
          });
        })
        .catch((err) => {
          console.log("err:", err);
          // showErrorMessage(err, this.props);
        });
    } else {
      this.setState({
        Invalid: true,
      });
    }
  }
  confirmDelete = (event, id) => {
    event.preventDefault();
    // swal delete api call
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        API.post(`/admin/secure/room/delete/${id}`)
          .then((res) => {
            if (res.data && res.data.status === 200) {
              swal("Room deleted succesfully", {
                icon: "success",
              });
              this.componentDidMount();
            } else {
              swal("Something went wrong!", {
                icon: "warning",
                text: res.data.message,
              });
            }
          })
          .catch((err) => {
            console.log("err:", err);
            swal("Something went wrong!", {
              icon: "warning",
            });
          });
      }
    });
  };

  handleEditRoom = (event, id) => {
    console.log("id:", id);
    window.location.href = `/admin/edit_room/${id}`;
  };

  CellFormatter(cell, row) {
    let bgColor = "#FFFFFF";
    if (row.total_occupancy == row.vaccancy) {
      // Green color
      bgColor = "#008000";
    } else if (row.vaccancy == 1) {
      // Orange color
      bgColor = "#FFA500";
    } else if (row.vaccancy == 0) {
      // RED color
      bgColor = "#ff0000";
    } else if (Math.round(row.total_occupancy / 2) == row.vaccancy) {
      // Yellow Color
      bgColor = "#FFFF00";
    }

    return { backgroundColor: bgColor };
  }

  render() {
    const actionFormatter = () => (cell) => {
      return (
        <>
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
          <button
            onClick={(e) => this.handleEditRoom(e, cell)}
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#d7f5fc",
              color: "#883495",
              fontWeight: "bold",
              border: "none",
              margin: "3%",
            }}
          >
            EDIT
          </button>
        </>
      );
    };
    if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
    else {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <div className="row">
                <h3 className="card-title">
                  <span className="sp1">Home /</span>
                  <span className="sp1"> Master Data /</span>
                  <span className="sp2"> Room List</span>
                </h3>
                <div className="col-lg-12 col-sm-12 col-xs-12"></div>
              </div>
            </section>
            <section className="content">
              <div className="box">
                <div className="box-body">
                  <BootstrapTable
                    data={this.state.checkroomlist}
                    pagination
                    search
                  >
                    <TableHeaderColumn
                      isKey
                      dataField="id"
                      dataAlign="center"
                      dataSort
                      width="150"

                      // dataFormat={custContent(this)}
                    >
                      Room ID
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="room_number"
                      dataAlign="center"
                      dataSort
                      width="150"
                    >
                      Room number
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="building_name"
                      dataAlign="center"
                      dataSort
                      width="150"
                    >
                      Building name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="occupancy"
                      dataAlign="center"
                      dataSort
                      width="150"
                    >
                      Occupancy
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="vaccancy"
                      dataAlign="center"
                      dataSort
                      width="150"
                      tdStyle={this.CellFormatter}
                    >
                      Vaccancy
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="floor"
                      dataAlign="center"
                      dataSort
                      width="150"
                    >
                      Floor
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="room_type"
                      dataAlign="center"
                      dataSort
                      width="150"
                    >
                      Room type
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="toilet_type"
                      dataAlign="center"
                      dataSort
                      width="150"
                    >
                      Toilet type
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="id"
                      dataAlign="center"
                      dataFormat={actionFormatter(this)}
                      width="150"
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

export default withRouter(connect(mapStateToProps)(CheckRoom));
