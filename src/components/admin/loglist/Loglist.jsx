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
  return moment(date).format("DD/MM/YYYY, h:mm:ss a");
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

class Loginlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      logList: [],
      logCount: 0,
      Invalid: false,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.events == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/logs`)
        .then((res) => {
          this.setState({
            logList: res.data.result_data,
            logCount: res.data.result_data.length,
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

  
  handleEditEvent = (event, id) => {
    window.location.href = `/admin/event_edit/${id}`;
  };

  render() {
    
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
                    <span className="sp2"> Log List</span>
                  </h3>
                  <div className="col-lg-12 col-sm-12 col-xs-12"></div>
                </div>
              </section>
              <section></section>
              <section className="content">
                <div className="box">
                  <div className="box-body">
                    <BootstrapTable
                      data={this.state.logList}
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
                        dataField="userName"
                        dataSort={true}
                        dataAlign="center"
                        dataFormat={descriptionlinebreak}
                      >
                        USER NAME
                      </TableHeaderColumn>

					            <TableHeaderColumn
                        dataField="moduleName"
                        dataSort={true}
                        dataAlign="center"
                        dataFormat={descriptionlinebreak}
                      >
                        Module Name
                      </TableHeaderColumn>



                      {/* <TableHeaderColumn
                        dataField="action_perform"
                        dataSort={true}
                        dataAlign="center"
                        dataFormat={descriptionlinebreak}
                      >
                        Action
                      </TableHeaderColumn> */}



                      <TableHeaderColumn
                        dataField="action_date"
                        dataFormat={dateFormatting(this)}
                        dataSort={true}
                        dataAlign="center"
                      >
                        Log date and Time
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

export default withRouter(connect(mapStateToProps)(Loginlist));
