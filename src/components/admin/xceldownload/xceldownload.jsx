import React, { Component } from "react";
import Layout from "../layout/Layout";
import whitelogo from "../../../assets/images/drreddylogo_white.png";
import swal from "sweetalert";
import API from "../../../shared/admin-axios";
import { showErrorMessage } from "../../../shared/handle_error";

import XcelTable from "./XcelTable";
class Xceldownload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desigList: [],
      isLoading: true,
      activePage: 1,
      totalCount: 0,
      itemPerPage: 20,
      settingDetails: [],
      settingsData: [],
      settingsFlagId: 0,
      desig_id: "",
      showModal: false,
      showModalLoader: false,
      get_access_data: false,
      setUserInfo: {
        languages: [],
        response: [],
      },
    };
  }

  modalSubmitHandler = (event) => {
    event.preventDefault();
    let data = this.state.settingsData.map((el) => {
      return { type: el.type, status: String(el.status) };
    });
    this.setState({
      isLoading: true,
    });
    API.put(`/api/adm/update_excel_config`, {
      data,
      desig: this.state.desig_id,
    })
      .then((res) => {
        swal({
          closeOnClickOutside: false,
          title: "Success",
          text: "Data updated successfully.",
          icon: "success",
        });

        this.setState({
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        showErrorMessage(err, this.props);
      });
    this.setState({
      isLoading: false,
    });
  };

  designationList = () => {
    API.get("/api/employees/designations?excel=1")
      .then((res) => {
        var all_designation = [];
        for (let index = 0; index < res.data.data.length; index++) {
          const element = res.data.data[index];
          if (element["desig_id"] != 6) {
            all_designation.push(element);
          }
        }
        this.setState({
          desigList: all_designation,
          isLoading: false,
        });
      })
      .catch((err) => {
        showErrorMessage(err, this.props);
        console.log({ err });
      });
  };
  getExcelList = (desig = 1) => {
    if (desig == "") {
      this.setState({
        settingsData: [],
      });
    } else {
      this.setState({
        desig_id: desig,
      });

      API.get(`/api/adm/excel_config/${desig}`)
        .then((res) => {
          console.log(res.data);
          this.setState({
            settingsData: res.data.data,
            isLoading: false,
          });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          showErrorMessage(err, this.props);
        });
      this.setState({
        isLoading: false,
      });
    }
  };

  componentDidMount() {
    this.getExcelList();
    this.designationList();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <>
          <div className="loderOuter">
            <div className="loading_reddy_outer">
              <div className="loading_reddy">
                <img src={whitelogo} alt="logo" />
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <h1>
                    Excel Data
                    <small />
                  </h1>
                </div>
              </div>
            </section>
            <section className="content">
              <div className="box">
                <div className="box-body">
                  <label>Spoc Designation</label>
                  <div className="" style={{ width: "25%" }}>
                    <select
                      name="designation"
                      id="designation"
                      className="form-control"
                      onChange={(e) => {
                        this.getExcelList(e.target.value);
                      }}
                      defaultValue={"BM"}
                    >
                      <option value="">Select designation</option>
                      {this.state.desigList.map((designation, i) =>
                        designation.desig_id == 1 ? (
                          <option key={i} value={designation.desig_id} selected>
                            {designation.desig_name}
                          </option>
                        ) : (
                          <option key={i} value={designation.desig_id}>
                            {designation.desig_name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <XcelTable settingsData={this.state.settingsData}></XcelTable>
                  {this.state.settingsData.length > 0 && (
                    <button
                      type="submit"
                      className="btn btn-info btn-sm"
                      onClick={(e) => this.modalSubmitHandler(e)}
                    >
                      Save Button
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>
        </Layout>
      );
    }
  }
}
export default Xceldownload;
