import React, { Component } from "react";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";

class ParkingSloat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }
  // get params id from url
  componentDidMount() {
    const { id } = this.props.match.params;
    API.get(`/admin/secure/parking/slot/${id}`)
      .then((res) => {
        this.setState({
          data: res.data.result_data,
        });
      })
      .catch((err) => {
        console.log("err:", err);
        // showErrorMessage(err, this.props);
      });
  }
  render() {
    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <div className="row">
              <div className="col-lg-10">
                <h3 className="card-title">
                  <span className="sp1">Home /</span>
                  <span className="sp1"> Master Data /</span>
                  <span className="sp2">
                   {" "}
                    Parking: {this.state.data && this.state.data.length > 0 ? (
                      <>
                        {this.state.data[0].parking_name} (
                        {this.state.data[0].parking_id})
                      </>
                    ) : null}
                  </span>
                </h3>
              </div>
            </div>
            <div className="row">
              {this.state.data.length > 0 &&
                this.state.data.map((item, i) => (
                  <div
                    className="card-m-t col-sm-1 m-4"
                    key={i}
                    style={{
                      width: "100px",
                      height: "130px",
                      textAlign: "center",
                      paddingTop: "5px",
                      backgroundColor:
                        item.is_alloted === 1 ? "#ff3e1d" : "#71dd37",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        textAlign: "center",
                        fontWeight: "bold",
                        marginTop: "5px",
                        color: "white",
                      }}
                    >
                      Slot No {item.id}
                    </p>
                    {item.is_alloted === 0 ? (
                      <p
                        style={{
                          fontSize: "13px",
                          textAlign: "center",
                          fontWeight: "bold",
                          marginTop: "5px",
                          color: "white",
                        }}
                      >
                        Available
                      </p>
                    ) : (
                      <p
                        style={{
                          fontSize: "13px",
                          textAlign: "center",
                          fontWeight: "bold",
                          marginTop: "5px",
                          color: "white",
                        }}
                      >
                        Not Available <br />
                        Student Id: {item.student_id}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </section>
        </div>
      </Layout>
    );
  }
}

export default ParkingSloat;
