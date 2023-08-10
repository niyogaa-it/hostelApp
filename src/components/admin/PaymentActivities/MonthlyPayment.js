import React, { Component } from "react";
import axios from "axios";
import useRazorpay from "react-razorpay";
import swal from "sweetalert";
class AppPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payment: [],
    };
  }
  // RozarPay Payment Gateway
  componentDidMount() {
    const token = this.props.match.params.token;
    const amount = this.props.match.params.amount;
    const type = this.props.match.params.type;
    const id = this.props.match.params.id;
    if (token && amount && id) {
      const options = {
        //key: "rzp_test_IRmV5lo58NFlHA", // Enter the Key ID generated from the Dashboard //TEST KEY
        key: "rzp_live_btcHlfmCQZz7pq", // Enter the Key ID generated from the Dashboard
        // amount conver to paisa
        amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Rani Meyyammai",
        description: "Transaction",
        image: "http://3.110.86.116:3000/assets/img/favicon/favicon.ico",
        handler: function (response) {
          const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
          // ---- Move Authorized to Captured
          axios.post(`${REACT_APP_API_URL}/admin/un/secure/move_authorized_captured`, {"payment_id":response.razorpay_payment_id, "amount": amount * 100})
          .then((res) => {
            console.log("res", res);
          })
          .catch((err) => {
            console.log("Error", err.message);
          });
          
          axios
            .post(
              `${REACT_APP_API_URL}/student/secure/recharge/monthly`,
              {
                payment_id: response.razorpay_payment_id,
                id: id,
                amount: amount,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "auth-token": token,
                },
              }
            )
            .then((response) => {
              if (response.data.status === 201) {
                swal("Success", response.data.message, "success");
              } else {
                swal("Warning", response.data.message, "warning");
              }
            })
            .catch((error) => {
              console.log(error);
              alert("Something went wrong");
            });
        },
        prefill: {},
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
      });
      rzp1.open();
      // integartion of razorpay
    }
  }
  render() {
    return <div></div>;
  }
}
export default AppPayment;
