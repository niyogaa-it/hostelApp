import React, { Component } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import API from "../../../shared/admin-axios";
import logo from "../../../assets/images/hostel-logo.png";
import { showErrorMessage } from "../../../shared/handle_error";
import swal from "sweetalert";
import "yup-phone-lite";
import useRazorpay from "react-razorpay";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";


class Reg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      planDetail: [],
      userconut: 0,
      Invalid: false,
      meal: 0,
      laundry: 0,
      
    };

  }


  componentDidMount() {

    if (
      this.props.auth.userToken.permissions.payment_activities == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {

          const planid = decodeURIComponent(this.props.match.params.id);

          API.get(`/admin/secure/plan/view_payment_details/${planid}`)
          .then((res) => {
            console.log("res:",res.data.result);
            this.setState({
              planDetail: res.data.result

            });


              this.setState({
                meal: this.state.planDetail.meal ?  this.state.planDetail.meal : 	this.state.planDetail.monthly_mess_fee,
                laundry: this.state.planDetail.laundry ?  this.state.planDetail.laundry : 	this.state.planDetail.monthly_laundry_fee
        
              });

          })
            .catch((err) => {
              console.log("err:", err);
              //showErrorMessage(err, this.props);
          });

    } else {
      this.setState({
        Invalid: true,
      });
    }    

  }
 
    render() {


      if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
      else {

        if (this.state.planDetail.length === 0) {
          return null;
        }
        return (

            <>
              
              <section className="register-panel">
                <div className="reg-header">
                  <a href="https://www.ranimeyyammaihostel.org/" target="_blank">
                    <img
                      src={logo}
                      height="150px"
                      alt="Chettinad Rani Meyyammai Hostel"
                    />
                  </a>
                  <p>
                    No. 25, Ethiraj Salai, Egmore Chennai – 600 008.
                    <br />
                    Telephone: 044 2827 1617
                  </p>
                </div>
                <div className="reg-content">

                    <div className="container-fluid">
                      <h1>Invoice Details:-</h1>

                      <div className="row">
                      
                             <table >
                            <tbody>
                                <tr >
                                  <td colSpan="9" ></td>
                                  <td colSpan="5" align="center" valign="middle">BILLED TO</td>
                                </tr>
                                <tr>
                                  <td colSpan="4" valign="middle" ><p >State: TAMILNADU</p></td>
                                <td colSpan="5" ><p >NAME:  
                                    {
                                  this.state.planDetail[0].SFname.toUpperCase()
                                }</p><p >Room :  {
                                  this.state.planDetail[0].room_number
                                }</p></td>
                              </tr>
                              <tr align="center" valign="middle">
                                <td width="8%" rowSpan="2" >S. No.</td>
                                <td width="14%" rowSpan="2" >Description</td>
                                <td width="13%" rowSpan="2" >HSN / SAC<br />
                                code, if any</td>
                                <td width="15%" rowSpan="2" >Taxable Value</td>
                                <td colSpan="2" >CGST</td>
                                <td colSpan="2" >SGST</td>
                                <td width="14%" rowSpan="2" >Total in Rs.</td>
                                </tr>
                              <tr>
                                <td width="7%" >Rate</td>
                                <td width="11%" >Amount</td>
                                <td width="7%" >Rate</td>
                                <td width="11%" >Amount</td>
                              </tr>

                              <tr align="center" valign="middle">
                                  <td >1</td>
                                  <td >Room Rent</td>
                                  <td >996322</td>
                                  <td >0</td>
                                  <td >12%</td>
                                  <td >{this.state.planDetail[0].room_rent}</td>
                                  <td >12%</td>
                                  <td >{this.state.planDetail[0].room_rent}</td>
                                  <td >{this.state.planDetail[0].room_rent}</td>
                              </tr>

                              <tr align="center" valign="middle">
                                <td >2</td>
                                <td >Cultural fees</td>
                                <td >996322</td>
                                <td >0</td>
                                <td >12%</td>
                                <td >{this.state.planDetail[0].cultural_fees}</td>
                                <td >12%</td>
                                <td >{this.state.planDetail[0].cultural_fees}</td>
                                <td >{this.state.planDetail[0].cultural_fees}</td>
                              </tr>

                              <tr align="center" valign="middle">
                                <td >3</td>
                                <td >Admission fees</td>
                                <td >996322</td>
                                <td >0</td>
                                <td >12%</td>
                                <td >{this.state.planDetail[0].addmission_fee}</td>
                                <td >12%</td>
                                <td >{this.state.planDetail[0].addmission_fee}</td>
                                <td >{this.state.planDetail[0].addmission_fee}</td>
                              </tr>

                              <tr align="center" valign="middle">
                                <td >4</td>
                                <td >Admission Kit</td>
                                <td >996322</td>
                                <td >0</td>
                                <td >12%</td>
                                <td >{this.state.planDetail[0].admisson_kit}</td>
                                <td >12%</td>
                                <td >{this.state.planDetail[0].admisson_kit}0</td>
                                <td >{this.state.planDetail[0].admisson_kit}</td>
                              </tr>


                              <tr align="center" valign="middle">
                                <td >5</td>
                                <td >Meal Fees</td>
                                <td >996333</td>
                                <td >0</td>
                                <td >5%</td>
                                <td >{this.state.meal >0 ? this.state.meal:0}</td>
                                <td >5%</td>
                                <td >{this.state.meal >0 ? this.state.meal:0}</td>
                                <td >{this.state.meal >0 ? this.state.meal:0 }</td>
                              </tr>

                              <tr align="center" valign="middle">
                                <td >6</td>
                                <td >Laundry</td>
                                <td >996322</td>
                                <td >0</td>
                                <td >12%</td>
                                <td >{this.state.laundry>0 ? this.state.laundry: 0}</td>
                                <td >12%</td>
                                <td >{this.state.laundry>0 ? this.state.laundry: 0}</td>
                                <td >{this.state.laundry>0 ? this.state.laundry: 0}</td>
                              </tr> 


                              
                              
                              <tr align="center" valign="middle">
                                <td >7</td>
                                <td >Parking</td>
                                <td >996322</td>
                                <td >0</td>
                                <td >12%</td>
                                <td >{this.state.planDetail[0].parking}</td>
                                <td >12%</td>
                                <td >{this.state.planDetail[0].parking}</td>
                                <td >{this.state.planDetail[0].parking}</td>
                              </tr>

                              <tr align="center" valign="middle">
                                <td >8</td>
                                <td >Transportation<br />fees</td>
                                <td >996411</td>
                                <td >0</td>
                                <td> 18%</td>
                                <td >{this.state.planDetail[0].transportation}</td>
                                <td >18%</td>
                                <td >{this.state.planDetail[0].transportation}</td>
                                <td >{this.state.planDetail[0].transportation}</td>
                              </tr>


                              <tr align="center" valign="middle">
                                <td >9</td>
                                <td >Water Bill</td>
                                <td >0</td>
                                <td >0</td>
                                <td >0%</td>
                                <td >{this.state.planDetail[0].monthly_water_bill}</td>
                                <td >0%</td>
                                <td >{this.state.planDetail[0].monthly_water_bill}</td>
                                <td >{this.state.planDetail[0].monthly_water_bill}</td>
                              </tr>


                              <tr align="center" valign="middle">
                                <td >10</td>
                                <td >Electricity bill</td>
                                <td >0</td>
                                <td >0</td>
                                <td >0%</td>
                                <td >{this.state.planDetail[0].monthly_electricity_bill}</td>
                                <td >0%</td>
                                <td >{this.state.planDetail[0].monthly_electricity_bill}</td>
                                <td >{this.state.planDetail[0].monthly_electricity_bill}</td>
                              </tr>

                              <tr>
                                <td colSpan="4" align="center" valign="middle" bgcolor="#45aadc" ><strong>Total Amount in Words</strong></td>
                                <td colSpan="4" >Total Amount before Tax</td>
                                <td >{this.state.planDetail[0].to_pay}</td>
                              </tr>

                              <tr>
                                  <td colSpan="4" rowSpan="4" ><p>Rupees {this.state.planDetail[0].to_pay} only.</p></td>
                                  <td colSpan="4" >Add: CGST</td>
                                  <td>13,331.96</td>
                              </tr>

                              <tr>
                                <td colSpan="4" >Add: SGST</td>
                                <td >13,331.96</td>
                              </tr>

                              <tr>
                                <td colSpan="4" >Total Tax Amount</td>
                                <td >26,663.92</td>
                              </tr>

                              <tr>
                                <td colSpan="4" >Total Amount including Tax</td>
                                <td >{this.state.planDetail[0].to_pay}</td>
                              </tr>

                              <tr>
                                <td colSpan="4" rowSpan="4" valign="middle"></td>
                                <td colSpan="5" align="center" ><p  >Certified that the particulars </p><p >given above are true and correct</p></td>
                              </tr>

                              <tr>
                                <td colSpan="5" align="center" ><strong>For Rani Meyyammai Hostel</strong></td>
                              </tr>

                              <tr>
                                <td height="125" colSpan="5">&nbsp;</td>
                              </tr>

                              <tr>
                                <td colSpan="4" align="center" >Authorised Signatory</td>
                              </tr>

                            </tbody>
                          </table>

                          <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" >
                            <tbody>
                              <tr bgcolor="#45aadc">
                                <td colspan="2" align="center" >RECEIPT</td>
                              </tr>
                              <tr>
                                <td colspan="2" >
                                <p  >Received with thanks from {this.state.planDetail[0].SFname} a sum of Rs.{this.state.planDetail[0].to_pay}/-</p>
                                <p  >(Rupees {this.state.planDetail[0].to_pay} only.)</p>
                                <p  >towards settlement of invoice no. XXXXXXXX dated <span >{ moment().format("DD-MM-YYYY")}</span></p></td>
                              </tr>
                              <tr>
                                <td width="535" rowspan="2">&nbsp;</td>
                                <td width="535" align="center" ><p ><b>For Rani Meyyammai Hostel</b></p><p >Authorised Signatory</p></td>
                              </tr>
                            
                            </tbody>
                          </table>



                            <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" >
                            <tbody>
                              <tr bgcolor="#45aadc">
                                <td colspan="2" align="center" >RECEIPT</td>
                              </tr>
                              <tr>
                                <td colspan="2" >
                                <p  >Received with thanks from {this.state.planDetail[0].SFname} a sum of Rs.{this.state.planDetail[0].caution_deposit}/-</p>
                                <p  >(Rupees {this.state.planDetail[0].caution_deposit} only.)</p>
                                <p  >towards refundable caution deposit.<span >{ moment().format("DD-MM-YYYY")}</span></p></td>
                              </tr>
                              <tr>
                                <td width="535" rowspan="2">&nbsp;</td>
                                <td width="535" align="center" ><p ><b>For Rani Meyyammai Hostel</b></p><p >Authorised Signatory</p></td>
                              </tr>
                            </tbody>
                          </table> 
                                      
                                      



                      </div> 

                    </div>
                </div>
              </section>               
                  
            </>
        );
      }  
    }
   
}
const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(Reg));
