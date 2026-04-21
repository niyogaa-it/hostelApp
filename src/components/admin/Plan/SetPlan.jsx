import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import "./masterdata.css";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import moment from "moment";

const startDate = new Date(process.env.REACT_APP_HOSTEL_START);
const endDate = new Date(process.env.REACT_APP_HOSTEL_END);



let initialValues = {
  student_type: "",
  bed_type: "",
  term: "",
  monthly_type: "",
};

let initialMonthlyValues = {
  monthly_transportation_fee: 0,
  monthly_parking_fee: 0,
  monthly_water_bill: 0,
  monthly_electricity_bill: 0,
  monthly_mess_fee: 0,
  monthly_laundry_fee: 0,
  monthly_room_rent: 0,
  monthly_admission_kit: 0,
  monthly_cultural_fee : 0,
  monthly_caution_deposit: 0,
  monthly_admission_fee: 0,
  monthly_other_fees: 0,
  monthly_month_name: "",
  monthly_other_fees_remark: "",
  parking_start_date: "",
  parking_end_date:"",
  transport_start_date:"",
  transport_end_date : "",
  temporary_start_date : "",
  temporary_end_date : "",
  lateral_start_date : "",
  lateral_end_date : "",
  no_of_can: 0,
  per_can_cost: 0,
  opening_unit: 0,
  closing_unit : 0,
  per_unit_cost : 0,
  no_of_occupied : 0
};


class SetPlan extends Component {
 
  constructor(props) {
    const studentid = decodeURIComponent(props.match.params.id);
    super(props);
    this.state = {
      server_error: "",
      success: "",
      show_buliding: false,
      bed_type: "",
      monthly_type: "",
      building_name: "",
      building_id: "",
      building_dta: [],
      planList: [],
      student_plan_history: [],
      floor_list: [],
      singel_building: [],
      room_number_aloted: false,
      bedType: [],
      studenttype: "",
      oneTime: [],
      total_price: 0,
      to_pay: 0,
      temporarySubTotal: 0,
      studentDetails: "",
      termI: [],
      termII: [],
      package_price: [],
      gstIncluded: 'yes',
      monthly_mess_fee: 0,
      monthly_laundry_fee: 0,
      monthly_room_rent: 0,
      per_can_cost : 38,      
      per_unit_cost : 11.76,
      formValues: {
        student_type: "",
        bed_type: "",
        term: "",
        monthly_type: "",
        plan_type: "",
      },
      monthlyFormValues: {
        monthly_transportation_fee: 0,
        monthly_parking_fee: 0 ,
        monthly_water_bill: 0,
        monthly_electricity_bill: 0,
        monthly_mess_fee: 0,
        monthly_laundry_fee: 0,
        monthly_admission_fee: 0,
        monthly_admission_kit: 0,
        monthly_room_rent: 0,
        monthly_cultural_fee : 0,
        monthly_caution_deposit: 0,
        monthly_other_fees: 0,
        monthly_month_name: "",
        monthly_other_fees_remark: "",
        parking_start_date: "",
        parking_end_date:"",
        transport_start_date:"",
        transport_end_date : "",
        temporary_start_date : "",
        temporary_end_date : "",
        lateral_start_date : "",
        lateral_end_date : "",
        no_of_can: 0,
        // per_can_cost: 0,
        opening_unit: 0,
        closing_unit : 0,
        // per_unit_cost : 0,
        no_of_occupied : 0,
       
      },
      temporaryFormValues: {
        temporary_start_date : "",
        temporary_end_date : "",
        is_adjust: 'no',
        adjust_value: 0,
        
      },
      temporaryFormValuesWithoutGST: {},
    };
  }


  componentDidMount() {

    API.get(`/admin/secure/plan/all`)
    .then((res) => {
    
      this.setState({
        planList: res.data.result_data
      });
      
    })
    .catch((err) => {
      console.log("err:", err);
      
    });
    
  
    API.get(
      `/admin/secure/plan/student_plan_history/${decodeURIComponent(
        this.props.match.params.id
        )}`
      )
    .then((res) => {
      
       const resultData = res.data.result_data;
        this.setState({
          student_plan_history: Array.isArray(resultData) && resultData.length > 0 ? resultData : [],
        });
    })
    .catch((err) => {
      console.log("err:", err);
    });

  }


  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.temporaryFormValuesWithoutGST !== this.state.temporaryFormValuesWithoutGST
    ) {
      this.calculateTemporarySubTotalWithoutGST();
    }
  }

  monthDiff = (d1, d2 ) => {
      const firstDate  = new Date(d1);
      const secondDate  = new Date(d2);
      const firstYear = firstDate.getFullYear();
      const firstMonth = firstDate.getMonth();
      //const firstDay = firstDate.getDate();
      const secondYear = secondDate.getFullYear();
      const secondMonth = secondDate.getMonth();
      //const secondDay = secondDate.getDate();
      const yearDifference = secondYear - firstYear;
      const monthDifference = secondMonth - firstMonth + (yearDifference * 12);
      return monthDifference;
  }

  handleChange = (e) => {
    let studenttype = {
      student_id: decodeURIComponent(this.props.match.params.id),
      student_type: e.target.value,
    };
    this.setState({ studenttype: e.target.value });

    API.post("/admin/secure/plan/get_bed", studenttype)
    .then((response) => {
      if (response.data.status === 200) {
        this.setState({
          bedType: response.data.bed_type,
        });
      }
      if (response.data.status === 401) {
        swal("Warning", response.data.message, "warning");
      }
    })
    .catch((error) => {
      swal("Error", error, "warning");
    });
  };

  handleChangeBedType = (e) => {
    this.setState({ bed_type: e.target.value });
  };

  handleChangeTerm = (e) => {
    
    let bedtype = {
      student_id: decodeURIComponent(this.props.match.params.id),
      student_type: this.state.studenttype,
      bed_type: this.state.bed_type,
      term: e.target.value,
    };
    this.setState({
      formValues: {
        student_type: this.state.studenttype,
        bed_type: this.state.bed_type,
        term: e.target.value,
        plan_type:e.target.options[e.target.selectedIndex].text,
      },
    });

    if (e.target.value == "5") {
     
      API.post("/admin/secure/plan/get_plan", bedtype)
      .then((response) => {
       
        if(response.data.status === 200) {
          
          this.setState({
            oneTime: response.data.oneTime,
            studentDetails: response.data.student_details
          });
          

          this.setState({
            monthlyFormValues: {
              monthly_admission_fee:response.data.oneTime[0].addmission_fee ? response.data.oneTime[0].addmission_fee : 0,
              monthly_admission_kit:response.data.oneTime[0].admisson_kit ? response.data.oneTime[0].admisson_kit : 0,
              monthly_cultural_fee:response.data.oneTime[0].cultural_fees ? response.data.oneTime[0].cultural_fees : 0,
              monthly_caution_deposit:response.data.oneTime[0].caution_deposit ? response.data.oneTime[0].caution_deposit : 0,
              monthly_room_rent:response.data.oneTime[0].room_rent ? response.data.oneTime[0].room_rent : 0,
              monthly_mess_fee:response.data.oneTime[0].monthly_mess_fee ? response.data.oneTime[0].monthly_mess_fee : 0,
              monthly_laundry_fee:response.data.oneTime[0].monthly_laundry_fee ? response.data.oneTime[0].monthly_laundry_fee : 0,
              monthly_mess_fee: response.data.messFees ? response.data.messFees : 0,
              monthly_laundry_fee: response.data.laundryfees ? response.data.laundryfees : 0,
              no_of_occupied : response.data.room_occupied ? response.data.room_occupied : 0,
              monthly_parking_fee: response.data.parkingPrice ? response.data.parkingPrice : 0,
              monthly_transportation_fee: response.data.transportPrice ? response.data.transportPrice : 0,
            },
          });

            this.setState({
              package_price: {
                transportation_fee: response.data.transportPrice ? response.data.transportPrice : 0,
                monthly_parking_fee: response.data.parkingPrice ? response.data.parkingPrice : 0,
              }
            });
          
        }
      })
      .catch((error) => {
    
        swal("Error", error, "warning");
      });

    }else{

      API.post("/admin/secure/plan/get_plan", bedtype)
      .then((response) => {

        if(response.data.status === 200) {
          this.setState({
            studentDetails: response.data.student_details,
            oneTime: response.data.oneTime,
            termI: response.data.termI,
            termII: response.data.termII
          });
          
          if(this.state.formValues.term==1){
            this.setState({
              total_price:
              response.data.oneTime[0].total +
              response.data.termI.meal_price_t1 +
              response.data.termI.laundry_t1 +
              response.data.termII.meal_price_t2 +
              response.data.termII.laundry_t2,
            });
          } else if (this.state.formValues.term==2){

            this.setState({
              total_price:
              response.data.oneTime[0].total +
              response.data.termI.meal_price_t1 +
              response.data.termI.laundry_t1,
            });
          } else if (this.state.formValues.term==3){

            this.setState({
              total_price:
              response.data.oneTime[0].total +
              response.data.termII.meal_price_t2 +
              response.data.termII.laundry_t2,
            });
          } else if (this.state.formValues.term==4){

            this.setState({
              total_price:
              response.data.termII.meal_price_t2 +
              response.data.termII.laundry_t2,
            });
          } 
        }

        if (response.data.status === 401) {

          this.setState({
            studentDetails: "",
            oneTime: "",
            termI:"",
            termII:"",
            total_price: ""
          });
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        swal("Error", error, "warning");
      });
    }

  };

  handleMonthlyType= (e) => {
    this.setState({ monthly_type: e.target.value });
  
    API.get(
      `/admin/secure/per/student/${decodeURIComponent(
        this.props.match.params.id
        )}`
      )
    .then((response) => {
        
      if (response.data.status === 200) {

          this.setState({ temporarySubTotal: 0 });
          this.setState({ to_pay: 0 });
          this.setState({ total_price: 0 });
        
    
        if(this.state.monthly_type === "prepaid"){

          this.setState({
            monthlyFormValues: {
              monthly_transportation_fee: (this.state.studentDetails.transportation=='Yes') ? this.state.package_price.transportation_fee : 0,
              monthly_parking_fee: (this.state.studentDetails.parking=='Yes') ? this.state.package_price.monthly_parking_fee : 0,
              //no_of_occupied : this.state.monthlyFormValues.no_of_occupied,
              no_of_occupied : 1,
              monthly_admission_fee: this.state.monthlyFormValues.monthly_admission_fee,
              monthly_admission_kit: this.state.monthlyFormValues.monthly_admission_kit,
              monthly_room_rent: this.state.monthlyFormValues.monthly_room_rent,
              monthly_cultural_fee: this.state.monthlyFormValues.monthly_cultural_fee,
              monthly_caution_deposit: this.state.monthlyFormValues.monthly_caution_deposit,
              monthly_mess_fee: this.state.monthlyFormValues.monthly_mess_fee,
              monthly_laundry_fee: this.state.monthlyFormValues.monthly_laundry_fee,
              monthly_other_fees: 0,
              monthly_electricity_bill:0,
              monthly_water_bill:0,
              no_of_occupied : 1,
            },
          });
         
        }

        if(this.state.monthly_type === "postpaid"){
         
          this.setState({
            monthlyFormValues: {
              monthly_other_fees: 0,
              monthly_electricity_bill:0,
              monthly_water_bill:0,
              //no_of_occupied : this.state.monthlyFormValues.no_of_occupied,
              monthly_transportation_fee: 0,
              monthly_parking_fee: 0,
              monthly_admission_fee: this.state.monthlyFormValues.monthly_admission_fee,
              monthly_admission_kit: this.state.monthlyFormValues.monthly_admission_kit,
              monthly_room_rent: this.state.monthlyFormValues.monthly_room_rent,
              monthly_cultural_fee: this.state.monthlyFormValues.monthly_cultural_fee,
              monthly_caution_deposit: this.state.monthlyFormValues.monthly_caution_deposit,
              monthly_mess_fee: this.state.monthlyFormValues.monthly_mess_fee,
              monthly_laundry_fee: this.state.monthlyFormValues.monthly_laundry_fee,
            }
          });

          
        }

        if(this.state.monthly_type === "lateral"){

    
          this.setState({
            monthlyFormValues: {
              monthly_admission_fee: this.state.monthlyFormValues.monthly_admission_fee,
              monthly_admission_kit: this.state.monthlyFormValues.monthly_admission_kit,
              monthly_cultural_fee: this.state.monthlyFormValues.monthly_cultural_fee,
              monthly_caution_deposit: this.state.monthlyFormValues.monthly_caution_deposit,
              monthly_room_rent: this.state.monthlyFormValues.monthly_room_rent,
              monthly_mess_fee: this.state.monthlyFormValues.monthly_mess_fee,
              monthly_laundry_fee: this.state.monthlyFormValues.monthly_laundry_fee,
              monthly_other_fees: 0,
              monthly_electricity_bill:0,
              monthly_water_bill:0,
             
              //no_of_occupied : this.state.monthlyFormValues.no_of_occupied,
              no_of_occupied : 1,
             
            },
            monthly_mess_fee: this.state.monthlyFormValues.monthly_mess_fee,
            monthly_laundry_fee: this.state.monthlyFormValues.monthly_laundry_fee,
            monthly_room_rent: this.state.monthlyFormValues.monthly_room_rent,
        
           });

        }

        if(this.state.monthly_type === "temporary"){

           this.setState({
            temporaryFormValues: {
              monthly_admission_fee: 0,
              monthly_admission_kit: 0,
              monthly_room_rent: 0,
              monthly_cultural_fee: 0,
              monthly_caution_deposit: 0,
              monthly_mess_fee: 0,
              monthly_laundry_fee: 0,
              temporary_start_date : "",
              temporary_end_date : "",
              monthly_electricity_bill:0,
              monthly_water_bill:0,
              monthly_transportation_fee: 0,
              monthly_parking_fee: 0,
              monthly_other_fees: 0,
              is_adjust: 'no',
              adjust_value: 0,
             
            }
           
           });

        
           this.setState({
            temporaryFormValuesWithoutGST: {
              without_gst_monthly_admission_fee: 0,
              without_gst_monthly_admission_kit: 0,
              without_gst_monthly_room_rent: 0,
              without_gst_monthly_cultural_fee: 0,
              without_gst_monthly_caution_deposit: 0,
              without_gst_monthly_mess_fee: 0,
              without_gst_monthly_laundry_fee: 0,
              without_gst_monthly_electricity_bill:0,
              without_gst_monthly_water_bill:0,
              without_gst_monthly_transportation_fee: 0,
              without_gst_monthly_parking_fee: 0,
              without_gst_monthly_other_fees: 0,
              is_adjust: 'no',
              adjust_value: 0,
            }
           
           });


           this.setState({
            monthlyFormValues: {
              monthly_other_fees: 0,
              monthly_electricity_bill:0,
              monthly_water_bill:0,
            
              //no_of_occupied : this.state.monthlyFormValues.no_of_occupied,
              no_of_occupied : 1,
             
              monthly_admission_fee: this.state.monthlyFormValues.monthly_admission_fee,
              monthly_admission_kit: this.state.monthlyFormValues.monthly_admission_kit,
              monthly_room_rent: this.state.monthlyFormValues.monthly_room_rent,
              monthly_cultural_fee: this.state.monthlyFormValues.monthly_cultural_fee,
              monthly_caution_deposit: this.state.monthlyFormValues.monthly_caution_deposit,
              monthly_mess_fee: this.state.monthlyFormValues.monthly_mess_fee,
              monthly_laundry_fee: this.state.monthlyFormValues.monthly_laundry_fee,
            }
           
           });
        }
        
      
      }
      if (response.data.status === 401) {
        swal("Warning", response.data.message, "warning");
      }
    })
    .catch((error) => {
      swal("Error", error, "warning");
    });
  };

 
  submitAlert = (values, item) => {
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to set this plan",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {
      if (willSet) {
        this.handleSetPlan(values, item);
      }
    });
  };

  handleSetPlan = (values, item) => {
   

    let postData = [];

    if(values.term==1){
      postData = {
        student_id: decodeURIComponent(this.props.match.params.id),
        StudEmail: this.state.studentDetails.StudEmail,
        SmobNo: this.state.studentDetails.SmobNo,
        SFname: this.state.studentDetails.SFname,
        student_type: values.student_type,
        plan_id: this.state.formValues.term,
        plan_type: this.state.formValues.plan_type,
        term: values.term,
        bed_type: item.bed_type,
        room_no: this.state.studentDetails.room_id,
        parking_type: this.state.studentDetails.parking_type,
        meal_type: this.state.studentDetails.food_preference,
        room_rent: item.room_rent,
        cultural_fees: item.cultural_fees,
        caution_deposit: item.caution_deposit,
        addmission_fee: item.addmission_fee,
        admisson_kit: item.admisson_kit,
        meal_t1: this.state.termI.meal_price_t1,
        meal_t2: this.state.termII.meal_price_t2,
        laundry_t1: this.state.termI.laundry_t1,
        laundry_t2: this.state.termII.laundry_t2,
        total: this.state.total_price,
        to_pay: this.state.total_price,
        total_one_time: this.state.oneTime[0].total
      };
    }

    if(values.term==2){
      postData = {
      student_id: decodeURIComponent(this.props.match.params.id),
      StudEmail: this.state.studentDetails.StudEmail,
      SmobNo: this.state.studentDetails.SmobNo,
      SFname: this.state.studentDetails.SFname,
      student_type: values.student_type,
      plan_id: this.state.formValues.term,
      plan_type: this.state.formValues.plan_type,
      term: values.term,
      bed_type: item.bed_type,
      room_no: this.state.studentDetails.room_id,
      parking_type: this.state.studentDetails.parking_type,
      meal_type: this.state.studentDetails.food_preference,
      room_rent: item.room_rent,
      cultural_fees: item.cultural_fees,
      caution_deposit: item.caution_deposit,
      addmission_fee: item.addmission_fee,
      admisson_kit: item.admisson_kit,
      meal_t1: this.state.termI.meal_price_t1,
      laundry_t1: this.state.termI.laundry_t1,
      total: this.state.total_price,
      to_pay: this.state.total_price,
      total_one_time: this.state.oneTime[0].total
      };
    }

    if(values.term==3){
        postData = {
        student_id: decodeURIComponent(this.props.match.params.id),
        StudEmail: this.state.studentDetails.StudEmail,
        SmobNo: this.state.studentDetails.SmobNo,
        SFname: this.state.studentDetails.SFname,
        student_type: values.student_type,
        plan_id: this.state.formValues.term,
        plan_type: this.state.formValues.plan_type,
        term: values.term,
        bed_type: item.bed_type,
        room_no: this.state.studentDetails.room_id,
        parking_type: this.state.studentDetails.parking_type,
        meal_type: this.state.studentDetails.food_preference,
        room_rent: item.room_rent,
        cultural_fees: item.cultural_fees,
        caution_deposit: item.caution_deposit,
        addmission_fee: item.addmission_fee,
        admisson_kit: item.admisson_kit,
        meal_t2: this.state.termII.meal_price_t2,
        laundry_t2: this.state.termII.laundry_t2,
        total: this.state.total_price,
        to_pay: this.state.total_price,
        total_one_time: this.state.oneTime[0].total
        };
    }

    if(values.term==4){
      postData = {
        student_id: decodeURIComponent(this.props.match.params.id),
        StudEmail: this.state.studentDetails.StudEmail,
        SmobNo: this.state.studentDetails.SmobNo,
        SFname: this.state.studentDetails.SFname,
        student_type: values.student_type,
        plan_id: this.state.formValues.term,
        plan_type: this.state.formValues.plan_type,
        term: values.term,
        bed_type: item.bed_type,
        room_no: this.state.studentDetails.room_id,
        parking_type: this.state.studentDetails.parking_type,
        meal_type: this.state.studentDetails.food_preference,
        meal_t2: this.state.termII.meal_price_t2,
        laundry_t2: this.state.termII.laundry_t2,
        total: this.state.total_price,
        to_pay: this.state.total_price,
        total_one_time: this.state.oneTime[0].total,
      };
    }
    
    API.post("/admin/secure/plan/set_plan", postData)
    .then((response) => {
  
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        this.props.history.push("/admin/view_student/");
      }
      if (response.data.status === 401) {
        console.log(response.data.message);
        swal("Warning", response.data.message, "warning");
      }
    })
    .catch((error) => {
      swal("Error", error, "warning");
    });


  };

  handleSubmitEvent = (e) => {
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to set this plan",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {

      if (willSet) {

        let postData = [];

        let monthly_month_name = 0;
        if(this.state.temporaryFormValues.monthly_month_name){
          monthly_month_name = this.state.temporaryFormValues.monthly_month_name;
        }else if (this.state.monthlyFormValues.monthly_month_name){
          monthly_month_name = this.state.monthlyFormValues.monthly_month_name ;
        }
       
        if(this.state.monthly_type=='prepaid'){

          postData = {
            student_id: decodeURIComponent(this.props.match.params.id),
            StudEmail: this.state.studentDetails.StudEmail,
            SmobNo: this.state.studentDetails.SmobNo,
            SFname: this.state.studentDetails.SFname,
            student_type: this.state.formValues.student_type,
            plan_id: this.state.formValues.term,
            plan_type: this.state.monthly_type,
            term: this.state.formValues.term,
            bed_type: this.state.formValues.bed_type == "Lower Berth" ? "lb" : "ub",
            room_no: this.state.studentDetails.room_id,
            parking_type: this.state.studentDetails.parking_type,
            meal_type: this.state.studentDetails.food_preference,
            monthly: 0,
            parking_start_date: (this.state.monthlyFormValues.parking_start_date != undefined) ? this.state.monthlyFormValues.parking_start_date : "",
            parking_end_date: (this.state.monthlyFormValues.parking_end_date != undefined) ? this.state.monthlyFormValues.parking_end_date : "",
            transport_start_date: (this.state.monthlyFormValues.transport_start_date != undefined) ? this.state.monthlyFormValues.transport_start_date : "",
            transport_end_date: (this.state.monthlyFormValues.transport_end_date != undefined) ? this.state.monthlyFormValues.transport_end_date : "",
            parking:  (this.state.monthlyFormValues.monthly_parking_fee > 0) ? this.state.monthlyFormValues.monthly_parking_fee: 0,
            transportation: (this.state.monthlyFormValues.monthly_transportation_fee > 0) ? this.state.monthlyFormValues.monthly_transportation_fee: 0,
            total: this.state.total_price,
            to_pay: this.state.total_price,
            total_one_time: this.state.total_price,
          };


        }

        if(this.state.monthly_type=='postpaid'){

          //console.log('this.state.monthlyFormValues',this.state.monthlyFormValues);
          postData = {
            student_id: decodeURIComponent(this.props.match.params.id),
            StudEmail: this.state.studentDetails.StudEmail,
            SmobNo: this.state.studentDetails.SmobNo,
            SFname: this.state.studentDetails.SFname,
            student_type: this.state.formValues.student_type,
            plan_id: this.state.formValues.term,
            plan_type: this.state.monthly_type,
            term: this.state.formValues.term,
            bed_type: this.state.formValues.bed_type == "Lower Berth" ? "lb" : "ub",
            room_no: this.state.studentDetails.room_id,
            parking_type: this.state.studentDetails.parking_type,
            meal_type: this.state.studentDetails.food_preference,
            monthly: (monthly_month_name != null) ? monthly_month_name: 0,
            monthly_water_bill: (this.state.monthlyFormValues.monthly_water_bill > 0) ? this.state.monthlyFormValues.monthly_water_bill: 0,
            monthly_electricity_bill: (this.state.monthlyFormValues.monthly_electricity_bill > 0) ? this.state.monthlyFormValues.monthly_electricity_bill: 0,
            monthly_other_fees: (this.state.monthlyFormValues.monthly_other_fees > 0) ? this.state.monthlyFormValues.monthly_other_fees: 0,
            monthly_other_fees_remark: (this.state.monthlyFormValues.monthly_other_fees_remark != null) ? this.state.monthlyFormValues.monthly_other_fees_remark: "",
            total: this.state.total_price,
            to_pay: this.state.total_price,
            total_one_time: this.state.total_price,
          };
        }

        if(this.state.monthly_type=='lateral'){

          postData = {
            student_id: decodeURIComponent(this.props.match.params.id),
            StudEmail: this.state.studentDetails.StudEmail,
            SmobNo: this.state.studentDetails.SmobNo,
            SFname: this.state.studentDetails.SFname,
            student_type: this.state.formValues.student_type,
            plan_id: this.state.formValues.term,
            plan_type: this.state.monthly_type,
            term: this.state.formValues.term,
            bed_type: this.state.formValues.bed_type == "Lower Berth" ? "lb" : "ub",
            room_no: this.state.studentDetails.room_id,
            parking_type: this.state.studentDetails.parking_type,
            meal_type: this.state.studentDetails.food_preference,
            monthly: 0,
  
            addmission_fee: (this.state.monthlyFormValues.monthly_admission_fee > 0) ? this.state.monthlyFormValues.monthly_admission_fee: 0,
            admisson_kit: (this.state.monthlyFormValues.monthly_admission_kit > 0) ? this.state.monthlyFormValues.monthly_admission_kit: 0,
            cultural_fees : (this.state.monthlyFormValues.monthly_cultural_fee > 0) ? this.state.monthlyFormValues.monthly_cultural_fee: 0,
            caution_deposit : (this.state.monthlyFormValues.monthly_caution_deposit > 0) ? this.state.monthlyFormValues.monthly_caution_deposit: 0, 
            lateral_start_date: (this.state.monthlyFormValues.lateral_start_date) ? this.state.monthlyFormValues.lateral_start_date : "",
            lateral_end_date: (this.state.monthlyFormValues.lateral_end_date) ? this.state.monthlyFormValues.lateral_end_date : "",
            room_rent : (this.state.monthly_room_rent > 0) ? this.state.monthly_room_rent: 0, 
            monthly_laundry_fee : (this.state.monthly_laundry_fee > 0) ? this.state.monthly_laundry_fee: 0, 
            monthly_mess_fee : (this.state.monthly_mess_fee > 0) ? this.state.monthly_mess_fee: 0, 
            monthly_other_fees_remark: (this.state.monthlyFormValues.monthly_other_fees_remark != null) ? this.state.monthlyFormValues.monthly_other_fees_remark: "",
            total: this.state.total_price,
            to_pay: this.state.total_price,
            total_one_time: this.state.total_price,
          };


        }

        if(this.state.monthly_type=='temporary'){
         
          postData = {
            student_id: decodeURIComponent(this.props.match.params.id),
            StudEmail: this.state.studentDetails.StudEmail,
            SmobNo: this.state.studentDetails.SmobNo,
            SFname: this.state.studentDetails.SFname,
            student_type: this.state.formValues.student_type,
            plan_id: this.state.formValues.term,
            plan_type: this.state.monthly_type,
            term: this.state.formValues.term,
            bed_type: this.state.formValues.bed_type == "Lower Berth" ? "lb" : "ub",
            room_no: this.state.studentDetails.room_id,
            parking_type: this.state.studentDetails.parking_type,
            meal_type: this.state.studentDetails.food_preference,
           // monthly: (monthly_month_name != null) ? monthly_month_name: 0,
            temporary_start_date: (this.state.temporaryFormValues.temporary_start_date) ? this.state.temporaryFormValues.temporary_start_date : "",
            temporary_end_date: (this.state.temporaryFormValues.temporary_end_date) ? this.state.temporaryFormValues.temporary_end_date : "",
            addmission_fee: (this.state.temporaryFormValues.monthly_admission_fee > 0) ? this.state.temporaryFormValues.monthly_admission_fee: 0,
            admisson_kit: (this.state.temporaryFormValues.monthly_admission_kit > 0) ? this.state.temporaryFormValues.monthly_admission_kit: 0,
            cultural_fees : (this.state.temporaryFormValues.monthly_cultural_fee > 0) ? this.state.temporaryFormValues.monthly_cultural_fee: 0,
            caution_deposit : (this.state.temporaryFormValues.monthly_caution_deposit > 0) ? this.state.temporaryFormValues.monthly_caution_deposit: 0, 
            room_rent : (this.state.temporaryFormValues.monthly_room_rent > 0) ? this.state.temporaryFormValues.monthly_room_rent: 0, 
            monthly_mess_fee : (this.state.temporaryFormValues.monthly_mess_fee > 0) ? this.state.temporaryFormValues.monthly_mess_fee: 0, 
            monthly_laundry_fee : (this.state.temporaryFormValues.monthly_laundry_fee > 0) ? this.state.temporaryFormValues.monthly_laundry_fee: 0,
            monthly_electricity_bill : (this.state.temporaryFormValues.monthly_electricity_bill > 0) ? this.state.temporaryFormValues.monthly_electricity_bill: 0, 
            monthly_water_bill : (this.state.temporaryFormValues.monthly_water_bill > 0) ? this.state.temporaryFormValues.monthly_water_bill: 0, 
            parking : (this.state.temporaryFormValues.monthly_parking_fee > 0) ? this.state.temporaryFormValues.monthly_parking_fee: 0, 
            transportation: (this.state.temporaryFormValues.monthly_transportation_fee > 0) ? this.state.temporaryFormValues.monthly_transportation_fee: 0,
            monthly_other_fees : (this.state.temporaryFormValues.monthly_other_fees > 0) ? this.state.temporaryFormValues.monthly_other_fees: 0, 

            monthly_other_fees_remark: (this.state.temporaryFormValues.monthly_other_fees_remark != null) ? this.state.temporaryFormValues.monthly_other_fees_remark: "",
            gstIncluded: (this.state.gstIncluded == 'no') ? this.state.gstIncluded: 'yes',
            is_adjust: this.state.temporaryFormValues.is_adjust,
            adjust_value: this.state.temporaryFormValues.adjust_value,
            //to_pay: this.state.to_pay,
            to_pay: this.state.total_price - this.state.temporaryFormValues.adjust_value,
            total: this.state.total_price,
            total_one_time: this.state.total_price,
          };

        }
        
        API.post("/admin/secure/plan/set_plan", postData)
        .then((response) => {
      
          if (response.data.status === 200) {
            swal("Success", response.data.message, "success");
            this.props.history.push("/admin/view_student/");
          }
          if (response.data.status === 401) {
            console.log(response.data.message);
            swal("Warning", response.data.message, "warning");
          }
        })
        .catch((error) => {
          swal("Error", error, "warning");
        });

      }
    });
  };
  
  onValueChangeTransport = (name, value) => {
    
      if (name === "transport_start_date") {

        this.setState({
          ...this.state,
          monthlyFormValues: {
            ...this.state.monthlyFormValues,
            transport_start_date:
            value,
          },
        }, () => this.validateTransportDate());
        
      } 
      
      if (name === "transport_end_date") {

        this.setState({
          ...this.state,
          monthlyFormValues: {
            ...this.state.monthlyFormValues,
            transport_end_date:
            value,
          },
        }, () => this.validateTransportDate());
      }
  };

  validateTransportDate = (e) => {
  let transportDiff = this.monthDiff(this.state.monthlyFormValues.transport_start_date, this.state.monthlyFormValues.transport_end_date);

  if (transportDiff >= 0) {
    let tracspotationmonths = (transportDiff + 1);
    this.state.monthlyFormValues.monthly_transportation_fee = (tracspotationmonths * this.state.package_price.transportation_fee);

    // Add both transportation and parking fee
    const total_prepaid_entry =
      Number(this.state.monthlyFormValues.monthly_transportation_fee) +
      Number(this.state.monthlyFormValues.monthly_parking_fee);

    this.setState({
      total_price: total_prepaid_entry,
      to_pay: total_prepaid_entry,
    });
  } else {
    this.setState({ temporarySubTotal: 0, to_pay: 0, total_price: 0 });
  }
  }
  
  onValueChangeParking = (name, value) =>{

    if (name === "parking_start_date") {

      this.setState({
        ...this.state,
        monthlyFormValues: {
          ...this.state.monthlyFormValues,
          parking_start_date:
          value,
        },
      }, () => this.validateParkingDate());
    }
    
    if (name === "parking_end_date") {

      this.setState({
        ...this.state,
        monthlyFormValues: {
          ...this.state.monthlyFormValues,
          parking_end_date:
          value,
        },
      }, () => this.validateParkingDate());

    }
  };

  validateParkingDate = (e) => {
  let parking_Difference = this.monthDiff(this.state.monthlyFormValues.parking_start_date, this.state.monthlyFormValues.parking_end_date);

  if (parking_Difference >= 0) {
    let parkingmonths = (parking_Difference + 1);
    this.state.monthlyFormValues.monthly_parking_fee = (parkingmonths * this.state.package_price.monthly_parking_fee);

    // Add both transportation and parking fee
    const total_prepaid_entry =
      Number(this.state.monthlyFormValues.monthly_transportation_fee) +
      Number(this.state.monthlyFormValues.monthly_parking_fee);

    this.setState({
      total_price: total_prepaid_entry,
      to_pay: total_prepaid_entry,
    });
  } else {
    this.setState({ temporarySubTotal: 0, to_pay: 0, total_price: 0 });
  }
  }

  calculatePostPaidTotalPrice = (values) => {
    const waterBill = Number(values.no_of_can || 0) * Number(this.state.per_can_cost || 0);
    const electricityBill = 
      ((Number(values.closing_unit || 0) - Number(values.opening_unit || 0)) * Number(this.state.per_unit_cost || 0)) /
      Number(values.no_of_occupied || 1);
    const otherFees = Number(values.monthly_other_fees || 0);

    const total = waterBill + electricityBill + otherFees;
    return total;
  }

  onValueChangeLateral = (name, value) => {

    if (name === "lateral_start_date") {

      this.setState({
        ...this.state,
        monthlyFormValues: {
          ...this.state.monthlyFormValues,
          lateral_start_date:
          value,
        },
      }, () => this.validateLateralDate());
      
    } 
    
    if (name === "lateral_end_date") {

      this.setState({
        ...this.state,
        monthlyFormValues: {
          ...this.state.monthlyFormValues,
          lateral_end_date:
          value,
        },
      }, () => this.validateLateralDate());

      
    }
  };

  validateLateralDate = (e) => {

    let latertotal = 0;
    let monthly_mess_fee = 0;
    let monthly_laundry_fee = 0;
    let monthly_room_rent = 0;
    let lateralDiff = 0;

    //let lateralDifference = moment(this.state.monthlyFormValues.lateral_end_date, 'YYYY-MM-DD').diff(moment(this.state.monthlyFormValues.lateral_start_date, 'YYYY-MM-DD'), 'months');
    let lateralDifference = this.monthDiff(this.state.monthlyFormValues.lateral_start_date,this.state.monthlyFormValues.lateral_end_date);
    let lateral_start_month = moment(this.state.monthlyFormValues.lateral_start_date, 'YYYY-MM-DD').format('MM');
    let lateral_end_month = moment(this.state.monthlyFormValues.lateral_end_date, 'YYYY-MM-DD').format('MM');

    if(lateralDifference>=0){

      let lateralDiff = 0;

      if(lateral_end_month=='04'){
        lateralDiff = (lateralDifference + 2);
      }else{

        lateralDiff = (lateralDifference + 1);
      }


      //console.log('lateralDiff',lateralDiff);
      monthly_room_rent = Math.round(Math.floor(lateralDiff * (this.state.monthlyFormValues.monthly_room_rent/12)));
      monthly_mess_fee = Math.round(Math.floor(lateralDiff * (this.state.monthlyFormValues.monthly_mess_fee/11)));
      monthly_laundry_fee = Math.round(Math.floor(lateralDiff * (this.state.monthlyFormValues.monthly_laundry_fee/11)));
    
      this.setState({
        monthly_mess_fee: monthly_mess_fee,
        monthly_laundry_fee: monthly_laundry_fee,
        monthly_room_rent: monthly_room_rent,
      });

     
    
      latertotal =  Number(this.state.monthlyFormValues.monthly_admission_fee)  
                      + Number(this.state.monthlyFormValues.monthly_admission_kit) 
                      + Number(this.state.monthlyFormValues.monthly_cultural_fee) 
                      + Number(this.state.monthlyFormValues.monthly_caution_deposit) 
                      + Number(monthly_mess_fee)
                      + Number(monthly_laundry_fee)
                      + Number(monthly_room_rent);

      this.setState({
        total_price: latertotal
      });

    }else{


      monthly_room_rent = 0;
      monthly_mess_fee = 0;
      monthly_laundry_fee = 0;


      this.setState({
        monthly_mess_fee: monthly_mess_fee,
        monthly_laundry_fee: monthly_laundry_fee,
        monthly_room_rent: monthly_room_rent,
      });

      latertotal =  Number(this.state.monthlyFormValues.monthly_admission_fee)  
                      + Number(this.state.monthlyFormValues.monthly_admission_kit) 
                      + Number(this.state.monthlyFormValues.monthly_cultural_fee) 
                      + Number(this.state.monthlyFormValues.monthly_caution_deposit) 
                      + Number(monthly_mess_fee)
                      + Number(monthly_laundry_fee)
                      + Number(monthly_room_rent);


      this.setState({
        total_price: latertotal
      });

    }
  }

  calculateGST = async (field, value) => {
    // Replace with your actual API endpoint and logic
    try {
      const res = await API.post('/admin/secure/plan/calculate_gst', {
        amount: value,
        field: field,
      });

    
      if (res.data && res.data !== undefined) {
        // Update the corresponding with GST value

          if (field === "admission_fees") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_admission_fee: res.data.data,
              },
            })); 
          }

          if (field === "admission_kit") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_admission_kit: res.data.data,
              },
            })); 
          }

          if (field === "room_rent") {

              this.setState((prevState) => ({
                temporaryFormValues: {
                  ...prevState.temporaryFormValues,
                  monthly_room_rent: res.data.data,
                },
              })); 

          } 

          if (field === "cultural_fees") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_cultural_fee: res.data.data,
              },
            })); 
          }

          if (field === "caustion_deposit") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_caution_deposit: res.data.data,
              },
            })); 
          }


          if (field === "meal_fees") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_mess_fee: res.data.data,
              },
            })); 
          }


          if (field === "laundry") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_laundry_fee: res.data.data,
              },
            })); 
          }


          if (field === "electricity_fees") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_electricity_bill: res.data.data,
              },
            })); 
          }


          if (field === "water_fees") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_water_bill: res.data.data,
              },
            })); 
          }


          if (field === "transpotation") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_transportation_fee: res.data.data,
              },
            })); 
          }

          if (field === "parking") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_parking_fee: res.data.data,
              },
            })); 
          }

          if (field === "others_fees") {
            this.setState((prevState) => ({
              temporaryFormValues: {
                ...prevState.temporaryFormValues,
                monthly_other_fees: res.data.data,
              },
            })); 
          }

      }
    } catch (err) {
      // Handle error if needed
    }
  }

  calculateTemporarySubTotalWithoutGST = () => {
      const vals = this.state.temporaryFormValuesWithoutGST || {};
      const subtotal =
        Number(vals.without_gst_monthly_admission_fee) +
        Number(vals.without_gst_monthly_admission_kit) +
        Number(vals.without_gst_monthly_room_rent) +
        Number(vals.without_gst_monthly_cultural_fee) +
        // Number(vals.without_gst_monthly_caution_deposit) + // Uncomment if needed
        Number(vals.without_gst_monthly_mess_fee) +
        Number(vals.without_gst_monthly_laundry_fee) +
        Number(vals.without_gst_monthly_electricity_bill) +
        Number(vals.without_gst_monthly_water_bill) +
        Number(vals.without_gst_monthly_transportation_fee) +
        Number(vals.without_gst_monthly_parking_fee) +
        Number(vals.without_gst_monthly_other_fees);

        if(subtotal<= 20000){

              this.setState({      
              temporaryFormValues: {
                ...this.state.temporaryFormValues,
                monthly_room_rent: this.state.temporaryFormValuesWithoutGST.without_gst_monthly_room_rent,
              },
            });


        }else{

          const room_rent_monthly = this.calculateGST("room_rent", this.state.temporaryFormValuesWithoutGST.without_gst_monthly_room_rent);
         
          this.setState({      
              temporaryFormValues: {
                ...this.state.temporaryFormValues,
                monthly_room_rent: room_rent_monthly,
              },
            });
        }

      this.setState({ temporarySubTotal: subtotal });
  };

render() {

    const validateRoom = Yup.object().shape({
      student_type: Yup.string().required("Student Type is required"),
      bed_type: Yup.string().required("Bed Type is required"),
      term: Yup.string().required("Term is required"),
    });

    const validatePrepaid = Yup.object().shape({
      transport_start_date: Yup.date()
      .nullable(true),
      transport_end_date: Yup.date().min(
          Yup.ref('transport_start_date'),
          "end date can't be before start date"
        ).nullable(true),
        parking_start_date: Yup.date().nullable(true),
        parking_end_date: Yup.date().min(
          Yup.ref('parking_start_date'),
          "end date can't be before start date"
        ).nullable(true),
    });

    const validatePostpaid = Yup.object().shape({

      monthly_month_name: Yup.string().required("Month is Required"),
      no_of_can: Yup.number()
      .required('The number is required!')
      .test(
        'Is positive?', 
        'ERROR: The number must be greater than 0!', 
        (value) => value > 0
      ),

      opening_unit: Yup.number()
      .required('The number is required!')
      .test(
        'Is positive?', 
        'ERROR: The number must be greater than 0!', 
        (value) => value >= 0
      ),

      closing_unit: Yup.number().min(
        Yup.ref('opening_unit'),
        "Opening unit is less than closing unit"
      ).required("The number is required!"),

      no_of_occupied:  Yup.number()
      .required('The number is required!')
      .test(
        'Is positive?', 
        'ERROR: The number must be greater than 0!', 
        (value) => value > 0
      ),
      // monthly_other_fees:  Yup.number()
      // .required('The number is required!')
      // .test(
      //   'Is positive?', 
      //   'ERROR: The number must be greater than 0!', 
      //   (value) => value >= 0
      // ),
    });

    const validateLateral = Yup.object().shape({

      lateral_start_date: Yup.date().required("Start date is Required"),
      lateral_end_date: Yup.date().min(
          Yup.ref('lateral_start_date'),
          "end date can't be before start date"
        ).required("End date is Required"),
    });

    const validateTemporary = Yup.object().shape({
      
      temporary_start_date: Yup.date().required("Start date is Required"),
      temporary_end_date: Yup.date().min(
          Yup.ref('temporary_start_date'),
          "end date can't be before start date"
        ).required("End date is Required"),
  
      monthly_admission_fee: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_admission_kit: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_room_rent: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_cultural_fee: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_caution_deposit: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_mess_fee: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_laundry_fee: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_electricity_bill: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_water_bill: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_transportation_fee: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_parking_fee: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
          monthly_other_fees: Yup.number()
          .required('The number is required!')
          .test(
            'Is positive?', 
            'ERROR: The number must be Positive!', 
            (value) => value >= 0
          ),
         
    });

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <Formik
              initialValues={initialValues}
              validationSchema={validateRoom}
                      //onSubmit={this.handleSubmitEvent}
              >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                <div className="row1">
                <h3 className="card-title">
                <span className="sp1">Home /</span>
                <span className="sp1"> Student /</span>
                <span className="sp2"> Set Plan</span>
                </h3>
                <div
                className="col-lg-8 card card-m-l pty-30"
                style={{
                  width: "97%",
                }}
                >
                <div className="row">
                  <div className="col-lg-6 form-m-t">
                    <div className="form-group">
                      <div className="col-lg-4 ">
                      <label htmlFor="student_type" style={{}}>
                      Student Type
                      </label>
                      </div>
                      <div className="col-lg-5">
                      <Field
                      name="student_type"
                      component="select"
                      autoComplete="off"
                      className="form-control"
                      onChange={(e) => {
                        this.handleChange(e);
                        setFieldValue("student_type", e.target.value);
                        setFieldValue("bed_type", "");
                      }}
                      >
                      <option value="">Default Select</option>
                      <option value="old">Old Student</option>
                      <option value="new">New Student</option>
                      </Field>
                      {errors.student_type && touched.student_type ? (
                        <div className="text-danger">
                        {errors.student_type}
                        </div>
                        ) : null}
                      </div>
                    </div>


                          {this.state.bedType.length > 0 && values.student_type ? (
                  <>
                  <div className="row">

                    <div className="col-lg-12 form-m-t">
                          <div className="form-group">
                              <div className="col-lg-4">
                                  <label htmlFor="bed_type">Bed Type</label>
                              </div>
                              <div className="col-lg-5">
                                      <Field
                                      component="select"
                                      autoComplete="off"
                                      name="bed_type"
                                      className={"form-control"}
                                      onChange={(e) => {
                                        this.handleChangeBedType(e);
                                        setFieldValue("bed_type", e.target.value);
                                        setFieldValue("term", "");
                                      }}
                                      >
                                      <option key="-1" value="">
                                      Default Select
                                      </option>
                                      {this.state.bedType.map((bedtype, i) => (
                                        <option value={bedtype.bedType} key={i}>
                                        {bedtype.bed_type == "ub"
                                        ? "Upper Berth"
                                        : bedtype.bed_type == "lb"
                                        ? "Lower Berth"
                                        : null}
                                        </option>
                                        ))}
                                      </Field>

                                      {errors.bed_type && touched.bed_type ? (
                                        <div className="text-danger">
                                        {errors.bed_type}
                                        </div>
                                        ) : null}
                              </div>
                            </div>
                    </div>

                
                  </div>

                  {values.bed_type == "Upper Berth" ||
                  values.bed_type == "Lower Berth" ? (
                    <div className="row">

                        <div className="col-lg-12 form-m-t">

                        <div className="form-group">
                            <div className="col-lg-4">
                                  <label htmlFor="bed_type">Raise Fee Demand </label>
                            </div>
                            <div className="col-lg-5">
                                    <Field
                                    component="select"
                                    autoComplete="off"
                                    name="term"
                                    className={"form-control"}
                                    onChange={(e) => {
                                      this.handleChangeTerm(e);
                                      setFieldValue("term", e.target.value);
                                    }}
                                    >
                                    <option value="" key="-1">
                                    Default Select
                                    </option>
                                    {this.state.planList.map((plandtl,j) => (
                                      <option value={plandtl.id} key={j}>
                                      {plandtl.plan_name}
                                      </option>
                                      ))}
                                    </Field>
                                  
                                    {errors.term && touched.term ? (
                                      <div className="text-danger">
                                      {errors.term}
                                      </div>
                                      ) : null}
                                 </div>
                            </div>

                        </div> 

                    
                    </div>
                    ) : null}


                  {values.term == "5" ? (
                    <div className="row">

                      <div className="col-lg-12 form-m-t">

                        <div className="form-group">
                           <div className="col-lg-4">
                              <label htmlFor="monthly_type">Monthly Type</label>
                          </div>
                          <div className="col-lg-5">
                              <Field
                              component="select"
                              autoComplete="off"
                              name="monthly_type"
                              className={"form-control"}
                              onChange={(e) => {
                                this.handleMonthlyType(e);
                                setFieldValue("monthly_type", e.target.value);
                              }}
                              >
                              <option value="">
                              Default Select
                              </option>
                              <option value="prepaid">Prepaid</option>
                              <option value="postpaid">Postpaid</option>
                              <option value="lateral">Lateral Entry</option>
                              <option value="temporary">Temporary</option>
                              </Field>

                              {errors.monthly_type && touched.monthly_type ? (
                                <div className="text-danger">
                                {errors.monthly_type}
                                </div>
                                ) : null}
                           </div>
                    </div>

                      </div>


                    
                    </div>
                    ): null}

                  </>
                  ) : null}





                  </div>
                  <div className="col-lg-6">
                        <h4>Student Plan History</h4>
                        {this.state.student_plan_history && this.state.student_plan_history.length > 0 ? (
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Plan Type</th>
                                <th>Term</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Created At</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.student_plan_history.map((plan) => (
                                <tr key={plan.id}>
                                  <td>{plan.plan_type}</td>
                                  <td>{plan.term}</td>
                                  <td>{plan.total ? plan.total.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }) : 0}</td>
                                  <td>{plan.paid}</td>
                                  <td>{plan.created_at ? new Date(plan.created_at).toLocaleDateString() : ""}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div>No plan history found.</div>
                        )}

                  </div>
               
                </div>

              
                </div>
                </div>
                </Form>
                )}
            </Formik>
            <div className="card card-m-l11">

              <div className="row1">
                {this.state.oneTime.length > 0 &&
                this.state.formValues.term != "5" &&
                this.state.formValues.bed_type &&
                this.state.formValues.student_type &&
                this.state.oneTime.map((item) => (
                <>
                <table key={item.id} className="table">
                <tbody>

                <td
                colSpan={2}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                >
                Student Detail
                </td>
                <tr>
                <td>Room No</td>
                <td>{this.state.studentDetails.roomNumber}</td>
                </tr>
                <tr>
                <td>Student Name</td>
                <td>{this.state.studentDetails.SFname}</td>
                </tr>
                <tr>
                <td>Student Phone No</td>
                <td>{this.state.studentDetails.SmobNo}</td>
                </tr>
                <tr>
                <td>Student Email</td>
                <td>{this.state.studentDetails.StudEmail}</td>
                </tr>

                <tr>
                <td>Student type</td>
                <td>{this.state.studentDetails.studentType}</td>
                </tr>

                <tr>
                <td>Type of Room</td>
                <td>{this.state.studentDetails.room_type}</td>
                </tr>
                <tr>
                <td>Type of Sharing</td>
                <td>{this.state.studentDetails.occupancy}</td>
                </tr>

                <tr>
                <td>Toilet type</td>
                <td>{this.state.studentDetails.toilet_type}</td>
                </tr>
                
                {this.state.formValues.term == "1" || this.state.formValues.term == "2" || this.state.formValues.term == "3" ? (
                  <>
                  <td
                  colSpan={2}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}>
                  One Time Payment
                  </td>
                  <tr>
                  <td>Room Rent (including gst)</td>
                  <td>
                  {item.room_rent.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                    style: "currency",
                    currency: "INR",
                  })}
                  </td>
                  </tr>
                  <tr>
                  <td>Cultural Fee (including gst)</td>
                  <td>
                  {item.cultural_fees.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                    style: "currency",
                    currency: "INR",
                  })}
                  </td>
                  </tr>
                  <tr>
                  <td>Caution Deposit </td>
                  <td>
                  {item.caution_deposit.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                    style: "currency",
                    currency: "INR",
                  })}
                  </td>
                  </tr>
                  <tr>
                  <td>Admission Fee (including gst)</td>
                  <td>
                  {item.addmission_fee.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                    style: "currency",
                    currency: "INR",
                  })}
                  </td>
                  </tr>
                  <tr>
                  <td>Admission Kit (including gst)</td>
                  <td>
                  {item.admisson_kit.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                    style: "currency",
                    currency: "INR",
                  })}
                  </td>
                  </tr>
                  </>
                  ) : null}
                
                {this.state.formValues.term == "1" || this.state.formValues.term == "2" ? (
                  <>  
                  <td
                  colSpan={2}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  >
                  Term I
                  </td>
                  <tr>
                  <td>
                  Meal Fees (
                    {this.state.studentDetails.food_preference})
                  (including gst)
                  </td>
                  <td>
                  {this.state.termI && this.state.termI.meal_price_t1 !== undefined
                    ? Number(this.state.termI.meal_price_t1).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 0,
                          style: "currency",
                          currency: "INR",
                        }
                      )
                    : 0}
                  </td>
                  </tr>
                  <tr>
                  <td>Laundry (including gst)</td>
                   <td>
                    {this.state.termI && this.state.termI.laundry_t1 !== undefined
                      ? Number(this.state.termI.laundry_t1).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                            style: "currency",
                            currency: "INR",
                          }
                        )
                      : 0}
                  </td>
                  </tr>
                  </>
                  ) : null}

                {this.state.formValues.term == "1" || this.state.formValues.term == "3"|| this.state.formValues.term == "4" ? (
                  <>  
                  <td
                  colSpan={2}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  >
                  Term II
                  </td>
                  <tr>
                  <td>
                  Meal Fees (
                    {this.state.studentDetails.food_preference})
                  (including gst)
                  </td>
                  <td>
                    {this.state.termII && this.state.termII.meal_price_t2 !== undefined
                      ? Number(this.state.termII.meal_price_t2).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                            style: "currency",
                            currency: "INR",
                          }
                        )
                      : 0}
                  </td>
                  </tr>
                  <tr>
                  <td>Laundry (including gst)</td>
                  <td>
                    {this.state.termII && this.state.termII.laundry_t2 !== undefined
                      ? Number(this.state.termII.laundry_t2).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                            style: "currency",
                            currency: "INR",
                          }
                        )
                      : 0}
                  </td>
                  </tr>
                  
                  </>
                  ) : null}
                <tr>
                <td>
                <b>Total (including gst)</b>
                </td>
                <td>
                <b>
                {this.state.total_price.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 0,
                    style: "currency",
                    currency: "INR",
                  }
                  )}
                </b>
                </td>
                </tr>

                </tbody>
                </table>


                <div style={{ textAlign: "center" }}>
                <button
                type="button"
                onClick={(e) => {
                  this.submitAlert(this.state.formValues, item);
                }}
                style={{
                  padding: "8px 18px 8px 18px",
                  borderRadius: "0.375rem",

                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#883495",
                  borderColor: "#883495",
                  boxShadow:
                  "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                  marginBottom: "60px",
                }}
                >
                Submit
                </button>

                </div>
                <br />
                </>
                ))}
              </div>

              <div className="row1  tbl-form-style">
              {this.state.formValues.term == 5  && this.state.monthly_type === "prepaid" && (
                <>
                <Formik
                initialValues={initialMonthlyValues}
                validationSchema={validatePrepaid}
                onSubmit={this.handleSubmitEvent}
                >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                  <table className="table">
                  <tbody>
                  
                  <tr>
                  <td>Student Name</td>
                  <td>{this.state.studentDetails.SFname}</td>
                  </tr>
                  <tr>
                  <td>Student Phone No</td>
                  <td>{this.state.studentDetails.SmobNo}</td>
                  </tr>
                  <tr>
                  <td>Student Email</td>
                  <td>{this.state.studentDetails.StudEmail}</td>
                  </tr>

                  <tr>
                  <td>Student type</td>
                  <td>{this.state.studentDetails.studentType}</td>
                  </tr>

                  <tr>
                  <td>Room No</td>
                  <td>{this.state.studentDetails.roomNumber}</td>
                  </tr>

                  <tr>
                  <td>Type of Room</td>
                  <td>{this.state.studentDetails.room_type}</td>
                  </tr>
                  <tr>
                  <td>Type of Sharing</td>
                  <td>{this.state.studentDetails.occupancy}</td>
                  </tr>

                  <tr>
                  <td>Toilet type</td>
                  <td>{this.state.studentDetails.toilet_type}</td>
                  </tr>
                  
                  {this.state.studentDetails.transportation == 'Yes'  ? (
                     <>

                      <tr>
                      <td>Transpotation Period</td>
                      <td>
                      
                      <DatePicker 
                      selected={values.transport_start_date}
                      dateFormat="dd/MM/yyyy"
                      placeholder="Start Date"
                      className="form-control"
                      name="transport_start_date"
                      onChange={(transport_start_date) => {
                        this.onValueChangeTransport("transport_start_date", transport_start_date);
                        setFieldValue("transport_start_date", transport_start_date);
                       
                      }}
                      />

                      <DatePicker 
                      selected={values.transport_end_date}
                      dateFormat="dd/MM/yyyy"
                      placeholder="End Date"
                      className="form-control"
                      name="transport_end_date"
                      onChange={(transport_end_date) => {
                        this.onValueChangeTransport("transport_end_date", transport_end_date);
                        setFieldValue("transport_end_date", transport_end_date);
                       
                      }}
                      
                      /> 

                    {errors.transport_start_date && touched.transport_start_date ? (
                    <div className="text-danger">
                    {errors.transport_start_date}
                    </div>
                    ) : null}


                    {errors.transport_end_date && touched.transport_end_date ? (
                    <div className="text-danger">
                    {errors.transport_end_date}
                    </div>
                    ) : null}


                      </td>
                      </tr>
                      
                      <tr>
                      <td>Transportation Fee</td>
                      <td>
                      <Field readOnly
                      name="monthly_transportation_fee"
                      autoComplete="off"
                      className="form-control"
                      type="number"
                      value={this.state.monthlyFormValues.monthly_transportation_fee}
                      
                      >
                      </Field>
                     
                      </td>
                      </tr>
                      </>

                  ) : null }
                  

                  {this.state.studentDetails.parking == 'Yes'  ? (

                    <>
                    <tr>
                    <td>Parking Period</td>
                    <td>

                    <DatePicker 
                    selected={values.parking_start_date}
                    dateFormat="dd/MM/yyyy"
                    placeholder="Start Date"
                    className="form-control"
                    name="parking_start_date"
                    onChange={(parking_start_date) => {
                      this.onValueChangeParking("parking_start_date", parking_start_date);
                      setFieldValue("parking_start_date", parking_start_date);
                    }}
                    />

                    <DatePicker 
                    selected={values.parking_end_date}
                    dateFormat="dd/MM/yyyy"
                    placeholder="End Date"
                    className="form-control"
                    name="parking_end_date"
                    onChange={(parking_end_date) => {
                      this.onValueChangeParking("parking_end_date", parking_end_date);
                      setFieldValue("parking_end_date", parking_end_date);
                    }}
                    
                    /> 

                    {errors.parking_start_date && touched.parking_start_date ? (
                    <div className="text-danger">
                    {errors.parking_start_date}
                    </div>
                    ) : null}


                    {errors.parking_end_date && touched.parking_end_date ? (
                    <div className="text-danger">
                    {errors.parking_end_date}
                    </div>
                    ) : null}
                    
                    </td>
                    </tr>

                    <tr>
                    <td>Parking Fee ({this.state.studentDetails.parking_type} Wheeler)</td>
                    <td>
                    <Field
                    readOnly        
                    name="monthly_parking_fee"
                    autoComplete="off"
                    className="form-control"
                    type="number"
                    value={this.state.monthlyFormValues.monthly_parking_fee}
                    
                    ></Field>
                    
                    </td>
                    </tr>  
                    
                    </>
                    ) : null}

                  <tr>
                  <td>Other Remark</td>
                  <td>
                  <Field
                  name="monthly_other_fees_remark"
                  autoComplete="off"
                  className="form-control"
                  type="textarea"
                  onChange={(e) => {
                    this.setState({
                      ...this.state,
                      monthlyFormValues: {
                        ...this.state.monthlyFormValues,
                        monthly_other_fees_remark:
                        e.target.value,
                      },
                    });
                    setFieldValue(
                      "monthly_other_fees_remark",
                      e.target.value
                      );
                  }}
                  ></Field>
                  {errors.monthly_other_fees_remark &&
                  touched.monthly_other_fees_remark ? (
                    <div className="text-danger">
                    {errors.monthly_other_fees_remark}
                    </div>
                    ) : null}
                  </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Total (including gst)</b>
                    </td>
                    <td>
                    <b>

                       


                        {(this.state.total_price).toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            }
                          )}



                          {errors.monthly_parking_fee && touched.monthly_parking_fee ? (
                            <div className="text-danger">
                            {errors.monthly_parking_fee}
                            </div>
                            ) : null}
                  </b>
                  </td>
                  </tr>


                  </tbody>
                  </table>
                  <div style={{ textAlign: "center" }}>
                  <button
                  type="submit"
                  style={{
                    padding: "8px 18px 8px 18px",
                    borderRadius: "0.375rem",

                    fontSize: "16px",
                    color: "#fff",
                    backgroundColor: "#883495",
                    borderColor: "#883495",
                    boxShadow:
                    "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                    marginBottom: "60px",
                  }}
                  >
                  Submit
                  </button>

                  </div>
                  </Form>
                  )}
              </Formik>

              <br />
              </>
              )}
              </div>

              <div className="row1">
              {this.state.formValues.term == 5  && this.state.monthly_type === "postpaid" && (
                <>
                <Formik
                initialValues={initialMonthlyValues}
                validationSchema={validatePostpaid}
                onSubmit={this.handleSubmitEvent}
                >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                  <table className="table">
                  <tbody>
                 
                  <tr>
                  <td>Student Name</td>
                  <td>{this.state.studentDetails.SFname}</td>
                  </tr>
                  <tr>
                  <td>Student Phone No</td>
                  <td>{this.state.studentDetails.SmobNo}</td>
                  </tr>
                  <tr>
                  <td>Student Email</td>
                  <td>{this.state.studentDetails.StudEmail}</td>
                  </tr>

                  <tr>
                  <td>Student type</td>
                  <td>{this.state.studentDetails.studentType}</td>
                  </tr>

                  <tr>
                  <td>Room No</td>
                  <td>{this.state.studentDetails.roomNumber}</td>
                  </tr>

                  <tr>
                  <td>Type of Room</td>
                  <td>{this.state.studentDetails.room_type}</td>
                  </tr>
                  <tr>
                  <td>Type of Sharing</td>
                  <td>{this.state.studentDetails.occupancy}</td>
                  </tr>


                  <tr>
                  <td>Toilet type</td>
                  <td>{this.state.studentDetails.toilet_type}</td>
                  </tr>

                  <tr>
                  <td>Month</td>
                  <td>
                  <Field
                  component="select"
                  autoComplete="off"
                  name="monthly_month_name"
                  className={"form-control"}
                  onChange={(e) => {
                    this.setState({
                      ...this.state,
                      monthlyFormValues: {
                        ...this.state.monthlyFormValues,
                        monthly_month_name:
                        e.target.value,
                      },
                    });
                    setFieldValue(
                      "monthly_month_name",
                      e.target.value
                      );
                  }}
                  >
                  <option value="">
                  Default Select
                  </option>
                  <option value="1">JAN</option>
                  <option value="2">FEB</option>
                  <option value="3">MAR</option>
                  <option value="4">APRIL</option>
                  <option value="5">MAY</option>
                  <option value="6">JUN</option>
                  <option value="7">JUL</option>
                  <option value="8">AUG</option>
                  <option value="9">SEP</option>
                  <option value="10">OCT</option>
                  <option value="11">NOV</option>
                  <option value="12">DEC</option>
                  
                  </Field>

                  {errors.monthly_month_name && touched.monthly_month_name ? (
                    <div className="text-danger">
                    {errors.monthly_month_name}
                    </div>
                    ) : null}
                  </td>
                  </tr>

                  <tr>
                  <td>Water Bill</td>
                  <td>
                  <div className="row">
                  <div className="col-sm-6 col-md-4">
                  <span>No of Can</span>
                  <Field
                  name="no_of_can"
                  autoComplete="off"
                  placeholder="No of Can"
                  min={0}
                  className="form-control"
                  type="number"
                  // onChange={(e) => {
                  //   this.setState({
                  //     ...this.state,
                  //     monthlyFormValues: {
                  //       ...this.state.monthlyFormValues,
                  //       no_of_can:
                  //       e.target.value,
                  //     },
                  //   });
                  //   setFieldValue(
                  //     "no_of_can",
                  //     e.target.value
                  //     );

                  //     this.setState({
                  //       ...this.state,
                  //       monthlyFormValues: {
                  //         ...this.state.monthlyFormValues,
                  //         monthly_water_bill:
                  //         (Number(e.target.value) * Number(this.state.per_can_cost)),
                  //       },
                  //     });
                     
                      
                  // }}

                  onChange={(e) => {
                    const newValues = {
                      ...values,
                      no_of_can: e.target.value,
                    };
                    this.setState({
                      ...this.state,
                      monthlyFormValues: {
                        ...this.state.monthlyFormValues,
                        no_of_can: e.target.value,
                        monthly_water_bill: (Number(e.target.value) * Number(this.state.per_can_cost)),
                      },
                      total_price: this.calculatePostPaidTotalPrice(newValues),
                    });
                    setFieldValue("no_of_can", e.target.value);
                  }}
                  ></Field>

                    {errors.no_of_can && touched.no_of_can ? (
                    <div className="text-danger">
                    {errors.no_of_can}
                    </div>
                    ) : null}
                  </div>
                  <div className="col-sm-6 col-md-4">
                   <span>Cost Per Can Rs</span>

                
                  <Field
                  name="per_can_cost"
                  autoComplete="off"
                  placeholder="Per Can cost"
                  readOnly
                  value = {this.state.per_can_cost}
                  className="form-control"
        
                  ></Field>
                  </div>
                  <div className="col-sm-6 col-md-4">
                  <span> Value Rs</span>
                   <Field
                      name="monthly_water_bill"
                      autoComplete="off"
                      readOnly
                      min={0}
                      className="form-control"
                      value = {(Number(values.no_of_can) * Number(this.state.per_can_cost))}
                      onChange={(e) => {
                        this.setState({
                          ...this.state,
                          monthlyFormValues: {
                            ...this.state.monthlyFormValues,
                            monthly_water_bill:
                              e.target.value,
                          },
                        });
                        setFieldValue(
                          "monthly_water_bill",
                          e.target.value
                        );
                        
                      }}
                     
                    ></Field>

                  </div>
                  </div>
                 
                  </td>
                  </tr>

                  <tr>
                  <td>Electricity Bill (AC) </td>
              
                  <td>
                  <div className="row">
                  <div className="col-sm-6 col-md-4">
                  <span>Opening Unit</span>
                  <Field
                  name="opening_unit"
                  autoComplete="off"
                  min={0}
                  placeholder="Opening unit"
                  className="form-control"
                  type="number"
                  onChange={(e) => {
                    this.setState({
                      ...this.state,
                      monthlyFormValues: {
                        ...this.state.monthlyFormValues,
                        opening_unit:
                        e.target.value,
                      },
                    });
                    setFieldValue(
                      "opening_unit",
                      e.target.value
                      );

                      this.setState({
                        ...this.state,
                        monthlyFormValues: {
                          ...this.state.monthlyFormValues,
                          monthly_electricity_bill:
                           (((Number(values.closing_unit) - Number(e.target.value)) * Number(this.state.per_unit_cost)) / Number(values.no_of_occupied)) ,
                        },
                      });
                    
                  }}
                 
                  ></Field>


                    {errors.opening_unit && touched.opening_unit ? (
                    <div className="text-danger">
                    {errors.opening_unit}
                    </div>
                    ) : null}
                </div>
                <div className="col-sm-6 col-md-4">
                <span>Closing Unit</span>
                  <Field
                  name="closing_unit"
                  autoComplete="off"
                  placeholder="Closing unit"
                  min={0}
                  className="form-control"
                  type="number"
                  // onChange={(e) => {
                  //   this.setState({
                  //     ...this.state,
                  //     monthlyFormValues: {
                  //       ...this.state.monthlyFormValues,
                  //       closing_unit:
                  //       e.target.value,
                  //     },
                  //   });
                  //   setFieldValue(
                  //     "closing_unit",
                  //     e.target.value
                  //     );


                  //     this.setState({
                  //       ...this.state,
                  //       monthlyFormValues: {
                  //         ...this.state.monthlyFormValues,
                  //         monthly_electricity_bill:
                  //         (((Number( e.target.value) - Number(values.opening_unit)) * Number(this.state.per_unit_cost)) / Number(values.no_of_occupied)) ,
                  //       },
                  //     });
                  // }}

                    onChange={(e) => {
                      const newValues = {
                        ...values,
                        closing_unit: e.target.value,
                      };
                      this.setState({
                        ...this.state,
                        monthlyFormValues: {
                          ...this.state.monthlyFormValues,
                          closing_unit: e.target.value,
                          monthly_electricity_bill:
                            (((Number(e.target.value) - Number(values.opening_unit)) * Number(this.state.per_unit_cost)) / Number(values.no_of_occupied)),
                        },
                        total_price: this.calculatePostPaidTotalPrice(newValues),
                      });
                      setFieldValue("closing_unit", e.target.value);
                    }}
                 
                  ></Field>

                    {errors.closing_unit && touched.closing_unit ? (
                    <div className="text-danger">
                    {errors.closing_unit}
                    </div>
                    ) : null}

                  </div>
                  <div className="col-sm-6 col-md-4">
                  <span>Unit Cost Rs </span>
                    <Field
                      name="per_unit_cost"
                      autoComplete="off"
                      readOnly
                      placeholder="Unit "
                      className="form-control"
                      type="number"
                      value = {(this.state.per_unit_cost)}
                      onChange={(e) => {
                        this.setState({
                          ...this.state,
                          monthlyFormValues: {
                            ...this.state.monthlyFormValues,
                            per_unit_cost:
                            e.target.value,
                          },
                        });
                        setFieldValue(
                          "per_unit_cost",
                          e.target.value
                          );
                      }}
                      >

                    </Field>
                  </div>

                 
                  <div className="col-sm-6 col-md-4">
                   <span>No of Students </span>
          

                  <Field
                  name="no_of_occupied"
                  autoComplete="off"
                  min="1"
                  className="form-control"
                  type="number"
                  // onChange={(e) => {
                  //   this.setState({
                  //     ...this.state,
                  //     monthlyFormValues: {
                  //       ...this.state.monthlyFormValues,
                  //       no_of_occupied:
                  //       e.target.value,
                  //     },
                  //   });
                  //   setFieldValue(
                  //     "no_of_occupied",
                  //     e.target.value
                  //     );

                  //     this.setState({
                  //       ...this.state,
                  //       monthlyFormValues: {
                  //         ...this.state.monthlyFormValues,
                  //         monthly_electricity_bill:
                  //         (((Number(values.closing_unit) - Number(values.opening_unit)) * Number(this.state.per_unit_cost)) / Number(e.target.value)) ,
                  //       },
                  //     });
                  // }}

                  onChange={(e) => {
                    const newValues = {
                      ...values,
                      no_of_occupied: e.target.value,
                    };
                    this.setState({
                      ...this.state,
                      monthlyFormValues: {
                        ...this.state.monthlyFormValues,
                        no_of_occupied: e.target.value,
                        monthly_electricity_bill:
                          (((Number(values.closing_unit) - Number(values.opening_unit)) * Number(this.state.per_unit_cost)) / Number(e.target.value)),
                      },
                      total_price: this.calculatePostPaidTotalPrice(newValues),
                    });
                    setFieldValue("no_of_occupied", e.target.value);
                  }}
                 
                  ></Field>


                    {errors.no_of_occupied && touched.no_of_occupied ? (
                    <div className="text-danger">
                    {errors.no_of_occupied}
                    </div>
                    ) : null}


                  </div>

                  <div className="col-sm-6 col-md-4">
                    <span>Value Rs</span>
                    <Field
                      name="monthly_electricity_bill"
                      autoComplete="off"
                      min={0}
                      type="number"
                      readOnly
                      className="form-control"
                      value = {( 
                        (((Number(values.closing_unit) - Number(values.opening_unit)) * Number(this.state.per_unit_cost)) / Number(values.no_of_occupied ? values.no_of_occupied : 1 ))
                        )}
                        onChange={(e) => {
                          this.setState({
                            ...this.state,
                            monthlyFormValues: {
                              ...this.state.monthlyFormValues,
                              monthly_electricity_bill:
                              (((Number(values.closing_unit) - Number(values.opening_unit)) * Number(this.state.per_unit_cost)) / Number(values.no_of_occupied)) ,
                            },
                          });
                          setFieldValue(
                            "monthly_electricity_bill",
                            e.target.value
                          );
                        }}

                    ></Field>
                      
                  </div>
                  </div>
                 
                  </td>
                  </tr>
                  
                  <tr>
                  <td>Other Fees</td>
                  <td>
                  <Field
                  name="monthly_other_fees"
                  autoComplete="off"
                  min={0}
                  className="form-control"
                  type="number"
                  // onChange={(e) => {
                  //   this.setState({
                  //     ...this.state,
                  //     monthlyFormValues: {
                  //       ...this.state.monthlyFormValues,
                  //       monthly_other_fees:
                  //       e.target.value,
                  //     },
                  //   });
                  //   setFieldValue(
                  //     "monthly_other_fees",
                  //     e.target.value
                  //     );
                  // }}

                  onChange={(e) => {
                      const newValues = {
                        ...values,
                        monthly_other_fees: e.target.value,
                      };
                      this.setState({
                        ...this.state,
                        monthlyFormValues: {
                          ...this.state.monthlyFormValues,
                          monthly_other_fees: e.target.value,
                        },
                        total_price: this.calculatePostPaidTotalPrice(newValues),
                      });
                      setFieldValue("monthly_other_fees", e.target.value);
                    }}
                  ></Field>
                  {errors.monthly_other_fees &&
                  touched.monthly_other_fees ? (
                    <div className="text-danger">
                    {errors.monthly_other_fees}
                    </div>
                    ) : null}
                  </td>
                  </tr>
                  
                  <tr>
                  <td>Other Remark</td>
                  <td>
                  <Field
                  name="monthly_other_fees_remark"
                  autoComplete="off"
                  className="form-control"
                  type="textarea"
                  onChange={(e) => {
                    this.setState({
                      ...this.state,
                      monthlyFormValues: {
                        ...this.state.monthlyFormValues,
                        monthly_other_fees_remark:
                        e.target.value,
                      },
                    });
                    setFieldValue(
                      "monthly_other_fees_remark",
                      e.target.value
                      );
                  }}
                  ></Field>
                  {errors.monthly_other_fees_remark &&
                  touched.monthly_other_fees_remark ? (
                    <div className="text-danger">
                    {errors.monthly_other_fees_remark}
                    </div>
                    ) : null}
                  </td>
                  </tr>

                  <tr>
                      <td>
                        <b>Total (including gst)</b>
                      </td>
                      <td>
                        <b>
                          {this.state.total_price.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            }
                            )}
                        </b>
                      </td>
                  </tr>

                  </tbody>
                  </table>
                  <div style={{ textAlign: "center" }}>
                  <button
                  type="submit"
                  style={{
                    padding: "8px 18px 8px 18px",
                    borderRadius: "0.375rem",

                    fontSize: "16px",
                    color: "#fff",
                    backgroundColor: "#883495",
                    borderColor: "#883495",
                    boxShadow:
                    "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                    marginBottom: "60px",
                  }}
                  >
                  Submit
                  </button>

                  </div>
                  </Form>
                  )}
                </Formik>

              <br />
              </>
              )}
              </div>

              <div className="row1 tbl-form-style">
              {this.state.formValues.term == 5  && this.state.monthly_type === "lateral" && (
                <>
                <Formik
                initialValues={initialMonthlyValues}
                validationSchema={validateLateral}
                onSubmit={this.handleSubmitEvent}
                >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                  <table className="table">
                  <tbody>
                
                  <tr>
                  <td>Student Name</td>
                  <td>{this.state.studentDetails.SFname}</td>
                  </tr>
                  <tr>
                  <td>Student Phone No</td>
                  <td>{this.state.studentDetails.SmobNo}</td>
                  </tr>
                  <tr>
                  <td>Student Email</td>
                  <td>{this.state.studentDetails.StudEmail}</td>
                  </tr>

                  <tr>
                  <td>Student type</td>
                  <td>{this.state.studentDetails.studentType}</td>
                  </tr>

                  <tr>
                  <td>Room No</td>
                  <td>{this.state.studentDetails.roomNumber}</td>
                  </tr>

                  <tr>
                  <td>Type of Room</td>
                  <td>{this.state.studentDetails.room_type}</td>
                  </tr>
                  <tr>
                  <td>Type of Sharing</td>
                  <td>{this.state.studentDetails.occupancy}</td>
                  </tr>

                  <tr>
                  <td>Toilet type</td>
                  <td>{this.state.studentDetails.toilet_type}</td>
                  </tr>
                  
          
                  <tr>
                  <td>Admission Fee</td>
                  <td>
                  <Field
                  name="monthly_admission_fee"
                  autoComplete="off"
                  readOnly
                  className="form-control"
                  type="number"
                  value={this.state.monthlyFormValues.monthly_admission_fee}
                  ></Field>
                  {errors.monthly_admission_fee &&
                  touched.monthly_admission_fee ? (
                    <div className="text-danger">
                    {errors.monthly_admission_fee}
                    </div>
                    ) : null}
                  </td>
                  </tr>

                  <tr>
                  <td>Admission Kit</td>
                  <td>
                  <Field
                  name="monthly_admission_kit"
                  autoComplete="off"
                  className="form-control"
                  type="number"
                  readOnly
                  value={this.state.monthlyFormValues.monthly_admission_kit}
                  ></Field>
                  {errors.monthly_admission_kit &&
                  touched.monthly_admission_kit ? (
                    <div className="text-danger">
                    {errors.monthly_admission_kit}
                    </div>
                    ) : null}
                  </td>
                  </tr>

                 

                  <tr>
                  <td>Cultural Fee</td>
                  <td>
                  <Field
                  name="monthly_cultural_fee"
                  autoComplete="off"
                  readOnly
                  className="form-control"
                  type="number"
                  value={this.state.monthlyFormValues.monthly_cultural_fee}
                  ></Field>
                  {errors.monthly_cultural_fee &&
                  touched.monthly_cultural_fee ? (
                    <div className="text-danger">
                    {errors.monthly_cultural_fee}
                    </div>
                    ) : null}
                  </td>
                  </tr>

                  <tr>
                  <td>Caution Deposit</td>
                  <td>
                  <Field
                  name="monthly_caution_deposit"
                  autoComplete="off"
                  readOnly
                  className="form-control"
                  type="number"
                  value={this.state.monthlyFormValues.monthly_caution_deposit}
                  ></Field>
                  {errors.monthly_caution_deposit &&
                  touched.monthly_caution_deposit ? (
                    <div className="text-danger">
                    {errors.monthly_caution_deposit}
                    </div>
                    ) : null}
                  </td>
                  </tr>

                  <tr>
                    <td>No of Months</td>
                    <td>
                    
                    <DatePicker 
                    selected={values.lateral_start_date}
                    dateFormat="dd/MM/yyyy"
                    placeholder="Start Date"
                    className="form-control"
                    name="lateral_start_date"
                    onChange={(lateral_start_date) => {
                      this.onValueChangeLateral("lateral_start_date", lateral_start_date);
                      setFieldValue("lateral_start_date", lateral_start_date);
                    }}
                    filterDate={(date) => {
                      // const startDate = new Date(2025, 5, 1); // 1st June 2024
                      // const endDate = new Date(2026, 4, 31); // 31st May 2025
                      return date >= startDate && date <= endDate;
                    }}
                    />

                    <DatePicker 
                    selected={values.lateral_end_date}
                    dateFormat="dd/MM/yyyy"
                    placeholder="End Date"
                    className="form-control"
                    name="lateral_end_date"
                    onChange={(lateral_end_date) => {
                      this.onValueChangeLateral("lateral_end_date", lateral_end_date);
                      setFieldValue("lateral_end_date", lateral_end_date);
                    }}
                    filterDate={(date) => {
                      // const startDate = new Date(2025, 5, 1); // 1st June 2024
                      // const endDate = new Date(2026, 4, 31); // 31st May 2025
                      return date >= startDate && date <= endDate;
                    }}
                    
                    /> 

                    {errors.lateral_start_date && touched.lateral_start_date ? (
                      <div className="text-danger">
                      {errors.lateral_start_date}
                      </div>
                      ) : null}

                      {errors.lateral_end_date && touched.lateral_end_date ? (
                      <div className="text-danger">
                      {errors.lateral_end_date}
                      </div>
                      ) : null}

                    </td>
                  </tr>

                  <tr>
                  <td>Room Rent</td>
                  <td>
                  <Field
                  name="monthly_room_rent"
                  autoComplete="off"
                  readOnly
                  className="form-control"
                  type="number"
                  value={this.state.monthly_room_rent}
                  ></Field>
                  {errors.monthly_room_rent &&
                  touched.monthly_room_rent ? (
                    <div className="text-danger">
                    {errors.monthly_room_rent}
                    </div>
                    ) : null}
                  </td>
                  </tr>

                  <tr>
                    <td>Mess Fee</td>
                    <td>
                    <Field
                    name="monthly_mess_fee"
                    autoComplete="off"
                    readOnly
                    className="form-control"
                    type="number"
                    value={this.state.monthly_mess_fee}
                    ></Field>
                    {errors.monthly_mess_fee &&
                    touched.monthly_mess_fee ? (
                      <div className="text-danger">
                      {errors.monthly_mess_fee}
                      </div>
                      ) : null}
                    </td>
                  </tr>
                  
                  <tr>
                  <td>Laundry Fee</td>
                  <td>
                  <Field
                  name="monthly_laundry_fee"
                  autoComplete="off"
                  readOnly
                  className="form-control"
                  type="number"
                  value={this.state.monthly_laundry_fee}
                  ></Field>
                  {errors.monthly_laundry_fee &&
                  touched.monthly_laundry_fee ? (
                    <div className="text-danger">
                    {errors.monthly_laundry_fee}
                    </div>
                    ) : null}
                  </td>
                  </tr>

                  
                  
                  <tr>
                  <td>Other Remark</td>
                  <td>
                  <Field
                  name="monthly_other_fees_remark"
                  autoComplete="off"
                  className="form-control"
                  type="textarea"
                  onChange={(e) => {
                    this.setState({
                      ...this.state,
                      monthlyFormValues: {
                        ...this.state.monthlyFormValues,
                        monthly_other_fees_remark:
                        e.target.value,
                      },
                    });
                    setFieldValue(
                      "monthly_other_fees_remark",
                      e.target.value
                      );
                  }}
                  ></Field>
                  {errors.monthly_other_fees_remark &&
                  touched.monthly_other_fees_remark ? (
                    <div className="text-danger">
                    {errors.monthly_other_fees_remark}
                    </div>
                    ) : null}
                  </td>
                  </tr>
                  
                  <tr>
                  <td>
                  <b>Total (including gst)</b>
                  </td>
                  <td>
                  <b>
                  {( this.state.total_price).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 0,
                      style: "currency",
                      currency: "INR",
                    }
                    )} 
                  </b>
                  </td>
                  </tr>
                  </tbody>
                  </table>
                  <div style={{ textAlign: "center" }}>
                  <button
                  type="submit"
                  style={{
                    padding: "8px 18px 8px 18px",
                    borderRadius: "0.375rem",

                    fontSize: "16px",
                    color: "#fff",
                    backgroundColor: "#883495",
                    borderColor: "#883495",
                    boxShadow:
                    "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                    marginBottom: "60px",
                  }}
                  >
                  Submit
                  </button>

                  </div>
                  </Form>
                  )}
                </Formik>

                <br />
                </>
                )}
              </div>


              <div className="row1 tbl-form-style">
              {this.state.formValues.term == 5  && this.state.monthly_type === "temporary" && (
                <>
                <Formik
                initialValues={initialMonthlyValues}
                validationSchema={validateTemporary}
                onSubmit={this.handleSubmitEvent}
                >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                 
                  <table className="table">
                      <tbody>
                          <tr>
                            <td>Student Name</td>
                            <td>{this.state.studentDetails.SFname}</td>
                          </tr>

                          <tr>
                            <td>Student Phone No</td>
                            <td>{this.state.studentDetails.SmobNo}</td>
                          </tr>

                          <tr>
                            <td>Student Email</td>
                            <td>{this.state.studentDetails.StudEmail}</td>
                          </tr>

                          <tr>
                            <td>Student type</td>
                            <td>{this.state.studentDetails.studentType}</td>
                          </tr>

                          <tr>
                            <td>Room No</td>
                            <td>{this.state.studentDetails.roomNumber}</td>
                          </tr>

                          <tr>
                            <td>Type of Room</td>
                            <td>{this.state.studentDetails.room_type}</td>
                          </tr>

                          <tr>
                            <td>Type of Sharing</td>
                            <td>{this.state.studentDetails.occupancy}</td>
                          </tr>

                          <tr>
                            <td>Toilet type</td>
                            <td>{this.state.studentDetails.toilet_type}</td>
                          </tr>

                          <tr>
                                <td>No of Months</td>
                                <td>
                                
                                <DatePicker 
                                selected={values.temporary_start_date}
                                dateFormat="dd/MM/yyyy"
                                placeholder="Start Date"
                                className="form-control"
                                name="temporary_start_date"
                                onChange={(temporary_start_date) => {
                                  
                                  this.setState({
                                    ...this.state,
                                    temporaryFormValues: {
                                      ...this.state.temporaryFormValues,
                                      temporary_start_date:
                                      temporary_start_date,
                                    },
                                  });
                                
                                  setFieldValue(
                                    "temporary_start_date",
                                    temporary_start_date
                                    );
                                }}
                                filterDate={(date) => {
                                
                                  return date >= startDate && date <= endDate;
                                }}
                                />

                                <DatePicker 
                                selected={values.temporary_end_date}
                                dateFormat="dd/MM/yyyy"
                                placeholder="End Date"
                                className="form-control"
                                name="temporary_end_date"
                                onChange={(temporary_end_date) => {
                                  
                                  this.setState({
                                    ...this.state,
                                    temporaryFormValues: {
                                      ...this.state.temporaryFormValues,
                                      temporary_end_date:
                                      temporary_end_date,
                                    },
                                  });
                                
                                  setFieldValue(
                                    "temporary_end_date",
                                    temporary_end_date
                                    );
                                }}

                                filterDate={(date) => {
                                
                                  return date >= startDate && date <= endDate;
                                }}
                                
                                /> 

                                {errors.temporary_start_date && touched.temporary_start_date ? (
                                  <div className="text-danger">
                                  {errors.temporary_start_date}
                                  </div>
                                  ) : null}

                                  {errors.temporary_end_date && touched.temporary_end_date ? (
                                  <div className="text-danger">
                                  {errors.temporary_end_date}
                                  </div>
                                  ) : null}

                                </td>
                          </tr>


                    </tbody>
                  </table>

                    <div style={{ display: "flex", gap: "20px" }}>
  
                        {/* Without GST Section */}
                      <div style={{ flex: 1 }}>
                        <h5>Without GST</h5>
                        <table className="table">
                          <tbody>


                              <tr>
                                <td>Caution Deposit</td>
                                <td>
                                  <Field
                                    name="without_gst_monthly_caution_deposit"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValuesWithoutGST: {
                                          ...this.state.temporaryFormValuesWithoutGST,
                                          without_gst_monthly_caution_deposit:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "without_gst_monthly_caution_deposit",
                                        e.target.value
                                      );
                                      this.calculateGST("caustion_deposit", e.target.value);
                                    }}
                                  ></Field>
                                  {errors.without_gst_monthly_caution_deposit &&
                                  touched.without_gst_monthly_caution_deposit ? (
                                    <div className="text-danger">
                                      {errors.without_gst_monthly_caution_deposit}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>
                            

                              <tr>
                                  <td>Admission Fee</td>
                                  <td>
                                    <Field
                                      name="without_gst_monthly_admission_fee"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      min={0}
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          temporaryFormValuesWithoutGST: {
                                            ...this.state.temporaryFormValuesWithoutGST,
                                            without_gst_monthly_admission_fee:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "without_gst_monthly_admission_fee",
                                          e.target.value
                                        );
                                        this.calculateGST("admission_fees", e.target.value);
                                      }}
                                    ></Field>
                                    {errors.without_gst_monthly_admission_fee &&
                                    touched.without_gst_monthly_admission_fee ? (
                                      <div className="text-danger">
                                        {errors.without_gst_monthly_admission_fee}
                                      </div>
                                    ) : null}
                                  </td>
                              </tr>

                              <tr>
                                <td>Admission Kit</td>
                                <td>
                                  <Field
                                    name="without_gst_monthly_admission_kit"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValuesWithoutGST: {
                                          ...this.state.temporaryFormValuesWithoutGST,
                                          without_gst_monthly_admission_kit:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "without_gst_monthly_admission_kit",
                                        e.target.value
                                      );
                                      this.calculateGST("admission_kit", e.target.value);
                                    }}
                                  ></Field>
                                  {errors.without_gst_monthly_admission_kit &&
                                  touched.without_gst_monthly_admission_kit ? (
                                    <div className="text-danger">
                                      {
                                        errors.without_gst_monthly_admission_kit
                                      }
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Room Rent</td>
                                <td>
                                  <Field
                                      name="without_gst_monthly_room_rent"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      min={0}
                                      onChange={async (e) => {
                                        const value = e.target.value;
                                        this.setState({
                                          ...this.state,
                                          temporaryFormValuesWithoutGST: {
                                            ...this.state.temporaryFormValuesWithoutGST,
                                            without_gst_monthly_room_rent: value,
                                          },
                                        });
                                        setFieldValue("without_gst_monthly_room_rent", value);

                                        // Logic for GST or not
                                        if (Number(this.state.temporarySubTotal) <= 20000) {
                                          this.setState((prevState) => ({
                                            temporaryFormValues: {
                                              ...prevState.temporaryFormValues,
                                              monthly_room_rent: value,
                                            },
                                          }));
                                        } else {
                                          
                                          await this.calculateGST("room_rent", value);
                                        }
                                      }}
                                    ></Field>
                                  {errors.without_gst_monthly_room_rent &&
                                  touched.without_gst_monthly_room_rent ? (
                                    <div className="text-danger">
                                      {errors.without_gst_monthly_room_rent}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Cultural Fee</td>
                                <td>
                                  <Field
                                    name="without_gst_monthly_cultural_fee"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValuesWithoutGST: {
                                          ...this.state.temporaryFormValuesWithoutGST,
                                          without_gst_monthly_cultural_fee:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "without_gst_monthly_cultural_fee",
                                        e.target.value
                                      );
                                      this.calculateGST("cultural_fees", e.target.value);
                                    }}
                                  ></Field>
                                  {errors.without_gst_monthly_cultural_fee &&
                                  touched.without_gst_monthly_cultural_fee ? (
                                    <div className="text-danger">
                                      {errors.without_gst_monthly_cultural_fee}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                            

                              <tr>
                                <td>Mess Fee</td>
                                <td>
                                  <Field
                                    name="without_gst_monthly_mess_fee"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValuesWithoutGST: {
                                          ...this.state.temporaryFormValuesWithoutGST,
                                          without_gst_monthly_mess_fee:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "without_gst_monthly_mess_fee",
                                        e.target.value
                                      );
                                      this.calculateGST("meal_fees", e.target.value);
                                    }}
                                  ></Field>
                                  {errors.without_gst_monthly_mess_fee &&
                                  touched.without_gst_monthly_mess_fee ? (
                                    <div className="text-danger">
                                      {errors.without_gst_monthly_mess_fee}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Laundry Fee</td>
                                <td>
                                  <Field
                                    name="without_gst_monthly_laundry_fee"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValuesWithoutGST: {
                                          ...this.state.temporaryFormValuesWithoutGST,
                                          without_gst_monthly_laundry_fee:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "without_gst_monthly_laundry_fee",
                                        e.target.value
                                      );
                                      this.calculateGST("laundry", e.target.value);
                                    }}
                                  ></Field>
                                  {errors.without_gst_monthly_laundry_fee &&
                                  touched.without_gst_monthly_laundry_fee ? (
                                    <div className="text-danger">
                                      {errors.without_gst_monthly_laundry_fee}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Electricity Bill</td>
                                <td>
                                  <Field
                                    name="without_gst_monthly_electricity_bill"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValuesWithoutGST: {
                                          ...this.state.temporaryFormValuesWithoutGST,
                                          without_gst_monthly_electricity_bill:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "without_gst_monthly_electricity_bill",
                                        e.target.value
                                      );
                                      this.calculateGST("electricity_fees", e.target.value);
                                    }}
                                  ></Field>
                                  {errors.without_gst_monthly_electricity_bill &&
                                  touched.without_gst_monthly_electricity_bill ? (
                                    <div className="text-danger">
                                      {errors.without_gst_monthly_electricity_bill}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Water Bill</td>
                                <td>
                                  <Field
                                    name="without_gst_monthly_water_bill"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValuesWithoutGST: {
                                          ...this.state.temporaryFormValuesWithoutGST,
                                          without_gst_monthly_water_bill:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "without_gst_monthly_water_bill",
                                        e.target.value
                                      );
                                      this.calculateGST("water_fees", e.target.value);
                                    }}
                                  ></Field>
                                  {errors.without_gst_monthly_water_bill &&
                                  touched.without_gst_monthly_water_bill ? (
                                    <div className="text-danger">
                                      {errors.without_gst_monthly_water_bill}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Transportation</td>
                                <td>
                                  <Field
                                    name="without_gst_monthly_transportation_fee"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValuesWithoutGST: {
                                          ...this.state.temporaryFormValuesWithoutGST,
                                          without_gst_monthly_transportation_fee:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "without_gst_monthly_transportation_fee",
                                        e.target.value
                                      );
                                      this.calculateGST("transpotation", e.target.value);
                                    }}
                                  ></Field>
                                  {errors.without_gst_monthly_transportation_fee &&
                                  touched.without_gst_monthly_transportation_fee ? (
                                    <div className="text-danger">
                                      {errors.without_gst_monthly_transportation_fee}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Parking fee ({this.state.studentDetails.parking_type} Wheeler)</td>
                                <td>
                                  <Field
                                    name="without_gst_monthly_parking_fee"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValuesWithoutGST: {
                                          ...this.state.temporaryFormValuesWithoutGST,
                                          without_gst_monthly_parking_fee:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "without_gst_monthly_parking_fee",
                                        e.target.value
                                      );
                                      this.calculateGST("parking", e.target.value);
                                    }}
                                  ></Field>
                                  {errors.without_gst_monthly_parking_fee &&
                                  touched.without_gst_monthly_parking_fee ? (
                                    <div className="text-danger">
                                      {errors.without_gst_monthly_parking_fee}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>
                                

                              <tr>
                                <td>Other fee</td>
                                <td>
                                  <Field
                                    name="without_gst_monthly_other_fees"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValuesWithoutGST: {
                                          ...this.state.temporaryFormValuesWithoutGST,
                                          without_gst_monthly_other_fees:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "without_gst_monthly_other_fees",
                                        e.target.value
                                      );
                                      this.calculateGST("others_fees", e.target.value);
                                    }}
                                  ></Field>
                                  {errors.without_gst_monthly_other_fees &&
                                  touched.without_gst_monthly_other_fees ? (
                                    <div className="text-danger">
                                      {errors.without_gst_monthly_other_fees}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Other Remark</td>
                                <td>
                                  <Field
                                    name="monthly_other_fees_remark"
                                    autoComplete="off"
                                    className="form-control"
                                    type="textarea"
                                    onChange={(e) => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValues: {
                                          ...this.state.temporaryFormValues,
                                          monthly_other_fees_remark:
                                            e.target.value,
                                        },
                                      });
                                      setFieldValue(
                                        "monthly_other_fees_remark",
                                        e.target.value
                                      );
                                    }}
                                  ></Field>
                                  {errors.monthly_other_fees_remark &&
                                  touched.monthly_other_fees_remark ? (
                                    <div className="text-danger">
                                      {errors.monthly_other_fees_remark}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>


                            
                            </tbody>
                        </table>
                      </div>





                      {/* With GST Section */}
                      <div style={{ flex: 1 }}>
                        <h5>With GST</h5>
                        <table className="table">
                          <tbody>


                             <tr>
                                <td>Caution Deposit</td>
                                <td>
                                  <Field
                                    name="monthly_caution_deposit"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                     value={this.state.temporaryFormValues.monthly_caution_deposit || 0}
                                    readOnly
                                    // onChange={(e) => {
                                    //   this.setState({
                                    //     ...this.state,
                                    //     temporaryFormValues: {
                                    //       ...this.state.temporaryFormValues,
                                    //       monthly_caution_deposit:
                                    //         e.target.value,
                                    //     },
                                    //   });
                                    //   setFieldValue(
                                    //     "monthly_caution_deposit",
                                    //     e.target.value
                                    //   );
                                    // }}
                                  ></Field>
                                  {errors.monthly_caution_deposit &&
                                  touched.monthly_caution_deposit ? (
                                    <div className="text-danger">
                                      {errors.monthly_caution_deposit}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>


                              <tr>
                                  <td>Admission Fee</td>
                                  <td>

                                    <Field
                                      name="monthly_admission_fee"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      min={0}
                                       value={this.state.temporaryFormValues.monthly_admission_fee || 0}
                                       readOnly
                                      // onChange={(e) => {
                                      //   this.setState({
                                      //     ...this.state,
                                      //     temporaryFormValues: {
                                      //       ...this.state.temporaryFormValues,
                                      //       monthly_admission_fee:
                                      //         e.target.value,
                                      //     },
                                      //   });
                                      //   setFieldValue(
                                      //     "monthly_admission_fee",
                                      //     e.target.value
                                      //   );
                                      // }}
                                    ></Field>
                                    {errors.monthly_admission_fee &&
                                    touched.monthly_admission_fee ? (
                                      <div className="text-danger">
                                        {errors.monthly_admission_fee}
                                      </div>
                                    ) : null}
                                  </td>
                              </tr>

                              <tr>
                                <td>Admission Kit</td>
                                <td>
                                  <Field
                                    name="monthly_admission_kit"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    value={this.state.temporaryFormValues.monthly_admission_kit || 0}
                                    readOnly
                                    // onChange={(e) => {
                                    //   this.setState({
                                    //     ...this.state,
                                    //     temporaryFormValues: {
                                    //       ...this.state.temporaryFormValues,
                                    //       monthly_admission_kit:
                                    //         e.target.value,
                                    //     },
                                    //   });
                                    //   setFieldValue(
                                    //     "monthly_admission_kit",
                                    //     e.target.value
                                    //   );
                                    // }}
                                  ></Field>
                                  {errors.monthly_admission_kit &&
                                  touched.monthly_admission_kit ? (
                                    <div className="text-danger">
                                      {
                                        errors.monthly_admission_kit
                                      }
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Room Rent</td>
                                <td>
                                  <Field
                                    name="monthly_room_rent"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    value={
                                    (Number(this.state.temporaryFormValues.monthly_room_rent) || 0) 
                                    
                                    }
                                    readOnly
                                  ></Field>
                                  {errors.monthly_room_rent &&
                                  touched.monthly_room_rent ? (
                                    <div className="text-danger">
                                      {errors.monthly_room_rent}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Cultural Fee</td>
                                <td>
                                  <Field
                                    name="monthly_cultural_fee"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    value={this.state.temporaryFormValues.monthly_cultural_fee || 0}
                                    readOnly
                                    // onChange={(e) => {
                                    //   this.setState({
                                    //     ...this.state,
                                    //     temporaryFormValues: {
                                    //       ...this.state.temporaryFormValues,
                                    //       monthly_cultural_fee:
                                    //         e.target.value,
                                    //     },
                                    //   });
                                    //   setFieldValue(
                                    //     "monthly_cultural_fee",
                                    //     e.target.value
                                    //   );
                                    // }}
                                  ></Field>
                                  {errors.monthly_cultural_fee &&
                                  touched.monthly_cultural_fee ? (
                                    <div className="text-danger">
                                      {errors.monthly_cultural_fee}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                             

                              <tr>
                                <td>Mess Fee</td>
                                <td>
                                  <Field
                                    name="monthly_mess_fee"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                     value={this.state.temporaryFormValues.monthly_mess_fee || 0}
                                    readOnly
                                    // onChange={(e) => {
                                    //   this.setState({
                                    //     ...this.state,
                                    //     temporaryFormValues: {
                                    //       ...this.state.temporaryFormValues,
                                    //       monthly_mess_fee:
                                    //         e.target.value,
                                    //     },
                                    //   });
                                    //   setFieldValue(
                                    //     "monthly_mess_fee",
                                    //     e.target.value
                                    //   );
                                    // }}
                                  ></Field>
                                  {errors.monthly_mess_fee &&
                                  touched.monthly_mess_fee ? (
                                    <div className="text-danger">
                                      {errors.monthly_mess_fee}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Laundry Fee</td>
                                <td>
                                  <Field
                                    name="monthly_laundry_fee"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    value={this.state.temporaryFormValues.monthly_laundry_fee || 0}
                                    readOnly
                                    // onChange={(e) => {
                                    //   this.setState({
                                    //     ...this.state,
                                    //     temporaryFormValues: {
                                    //       ...this.state.temporaryFormValues,
                                    //       monthly_laundry_fee:
                                    //         e.target.value,
                                    //     },
                                    //   });
                                    //   setFieldValue(
                                    //     "monthly_laundry_fee",
                                    //     e.target.value
                                    //   );
                                    // }}
                                  ></Field>
                                  {errors.monthly_laundry_fee &&
                                  touched.monthly_laundry_fee ? (
                                    <div className="text-danger">
                                      {errors.monthly_laundry_fee}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Electricity Bill</td>
                                <td>
                                  <Field
                                    name="monthly_electricity_bill"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    value={this.state.temporaryFormValues.monthly_electricity_bill || 0}
                                    readOnly
                                    // onChange={(e) => {
                                    //   this.setState({
                                    //     ...this.state,
                                    //     temporaryFormValues: {
                                    //       ...this.state.temporaryFormValues,
                                    //       monthly_electricity_bill:
                                    //         e.target.value,
                                    //     },
                                    //   });
                                    //   setFieldValue(
                                    //     "monthly_electricity_bill",
                                    //     e.target.value
                                    //   );
                                    // }}
                                  ></Field>
                                  {errors.monthly_electricity_bill &&
                                  touched.monthly_electricity_bill ? (
                                    <div className="text-danger">
                                      {errors.monthly_electricity_bill}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Water Bill</td>
                                <td>
                                  <Field
                                    name="monthly_water_bill"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                     value={this.state.temporaryFormValues.monthly_water_bill || 0}
                                    readOnly
                                    // onChange={(e) => {
                                    //   this.setState({
                                    //     ...this.state,
                                    //     temporaryFormValues: {
                                    //       ...this.state.temporaryFormValues,
                                    //       monthly_water_bill:
                                    //         e.target.value,
                                    //     },
                                    //   });
                                    //   setFieldValue(
                                    //     "monthly_water_bill",
                                    //     e.target.value
                                    //   );
                                    // }}
                                  ></Field>
                                  {errors.monthly_water_bill &&
                                  touched.monthly_water_bill ? (
                                    <div className="text-danger">
                                      {errors.monthly_water_bill}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Transportation</td>
                                <td>
                                  <Field
                                    name="monthly_transportation_fee"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                    value={this.state.temporaryFormValues.monthly_transportation_fee || 0}
                                    readOnly
                                    // onChange={(e) => {
                                    //   this.setState({
                                    //     ...this.state,
                                    //     temporaryFormValues: {
                                    //       ...this.state.temporaryFormValues,
                                    //       monthly_transportation_fee:
                                    //         e.target.value,
                                    //     },
                                    //   });
                                    //   setFieldValue(
                                    //     "monthly_transportation_fee",
                                    //     e.target.value
                                    //   );
                                    // }}
                                  ></Field>
                                  {errors.monthly_transportation_fee &&
                                  touched.monthly_transportation_fee ? (
                                    <div className="text-danger">
                                      {errors.monthly_transportation_fee}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                              <tr>
                                <td>Parking fee ({this.state.studentDetails.parking_type} Wheeler)</td>
                                <td>
                                  <Field
                                    name="monthly_parking_fee"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                     value={this.state.temporaryFormValues.monthly_parking_fee || 0}
                                    readOnly
                                    // onChange={(e) => {
                                    //   this.setState({
                                    //     ...this.state,
                                    //     temporaryFormValues: {
                                    //       ...this.state.temporaryFormValues,
                                    //       monthly_parking_fee:
                                    //         e.target.value,
                                    //     },
                                    //   });
                                    //   setFieldValue(
                                    //     "monthly_parking_fee",
                                    //     e.target.value
                                    //   );
                                    // }}
                                  ></Field>
                                  {errors.monthly_parking_fee &&
                                  touched.monthly_parking_fee ? (
                                    <div className="text-danger">
                                      {errors.monthly_parking_fee}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>
                                

                              <tr>
                                <td>Other fee</td>
                                <td>
                                  <Field
                                    name="monthly_other_fees"
                                    autoComplete="off"
                                    className="form-control"
                                    type="number"
                                    min={0}
                                     value={this.state.temporaryFormValues.monthly_other_fees || 0}
                                    readOnly
                                    // onChange={(e) => {
                                    //   this.setState({
                                    //     ...this.state,
                                    //     temporaryFormValues: {
                                    //       ...this.state.temporaryFormValues,
                                    //       monthly_other_fees:
                                    //         e.target.value,
                                    //     },
                                    //   });
                                    //   setFieldValue(
                                    //     "monthly_other_fees",
                                    //     e.target.value
                                    //   );
                                    // }}
                                  ></Field>
                                  {errors.monthly_other_fees &&
                                  touched.monthly_other_fees ? (
                                    <div className="text-danger">
                                      {errors.monthly_other_fees}
                                    </div>
                                  ) : null}
                                </td>
                              </tr>

                          </tbody>
                        </table>
                      </div>


                    </div>

                    <div style={{ textAlign: "center" }}>
                          <table className="table">
                             <tbody>


                    
                              <tr>
                                <td>
                                  <b>Adjust </b>
                                </td>
                                <td>
                                  <div className="d-flex">
                                     <Field
                                    name="is_adjust"
                                    type="radio"
                                    checked={this.state.temporaryFormValues.is_adjust === "yes"}
                                    onChange={() => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValues: {
                                          ...this.state.temporaryFormValues,
                                          is_adjust: "yes",
                                        },
                                      });
                                    }}
                                  /> Yes

                                  <Field
                                    name="is_adjust"
                                    type="radio"
                                    checked={this.state.temporaryFormValues.is_adjust === "no"}
                                    onChange={() => {
                                      this.setState({
                                        ...this.state,
                                        temporaryFormValues: {
                                          ...this.state.temporaryFormValues,
                                          is_adjust: "no",
                                          adjust_value: 0,
                                        },
                                      });
                                    }}
                                    className="mr-1"
                                  /> No

                                </div>
                                  
                                </td>

                                <td></td>
                              </tr>

                            {this.state.temporaryFormValues.is_adjust === "yes" && (
                              <tr>
                                <td>
                                  <b>Adjust Amount </b>
                                </td>
                                <td>
                                      <Field
                                        name="adjust_value"
                                        type="number"
                                        className="form-control"
                                        value={this.state.temporaryFormValues.adjust_value || ""}
                                        onChange={async e => {
                                          const adjustValue = e.target.value;
                                         
                                          // Update adjust_value in state (the GST value will be updated by calculateGST)
                                          this.setState({
                                            ...this.state,
                                            temporaryFormValues: {
                                              ...this.state.temporaryFormValues,
                                              adjust_value: adjustValue,
                                            },
                                          });
                                        }}
                                        min={0}
                                      />

                                </td>
                                <td></td>
                              </tr>
                            )}


                              <tr>
                                <td>
                                  <b>SubTotal (Without GST)</b>
                                </td>
                                <td>
                                  <b>
                                    {Number(this.state.temporarySubTotal).toLocaleString("en-IN", {
                                      maximumFractionDigits: 0,
                                      style: "currency",
                                      currency: "INR",
                                    })}
                                  </b>
                                </td>

                           
                                {/* {(() => {
                                  const shouldBeNo = Number(this.state.temporarySubTotal) <= 20000;
                                  const shouldBeYes = Number(this.state.temporarySubTotal) > 20000;
                                  if (
                                    (shouldBeNo && this.state.gstIncluded !== "no") ||
                                    (shouldBeYes && this.state.gstIncluded !== "yes")
                                  ) {
                                    setTimeout(() => {
                                      this.setState({ gstIncluded: shouldBeNo ? "no" : "yes" });
                                    }, 0);
                                  }
                                })()} */}

                          
                                <td> <Field name="gstIncluded" type="radio" checked={this.state.gstIncluded === "no"} onChange={async e => { this.setState({ gstIncluded: "no", temporaryFormValues: { ...this.state.temporaryFormValues, monthly_room_rent: this.state.temporaryFormValuesWithoutGST.without_gst_monthly_room_rent, }, }); }} /> {"(Room Rent without GST)"} 
                                  <Field name="gstIncluded" type="radio" checked={this.state.gstIncluded === "yes"} onChange={async e => { this.setState({ gstIncluded: "yes", }); await this.calculateGST( "room_rent", this.state.temporaryFormValuesWithoutGST.without_gst_monthly_room_rent || 0 ); }} />{"(Room Rent with GST)"} </td>
                              </tr>


                               <tr>
                                <td>
                                  <b>Total (With GST) for student Demand</b>
                                </td>
                                <td>
                                  <b>

                                     {(() => {
                                      const totaltopayAmount =
                                        Number(this.state.temporaryFormValues.monthly_admission_fee)
                                        + Number(this.state.temporaryFormValues.monthly_admission_kit) 
                                        + Number(this.state.temporaryFormValues.monthly_room_rent) 
                                        + Number(this.state.temporaryFormValues.monthly_cultural_fee) 
                                        + Number(this.state.temporaryFormValues.monthly_caution_deposit) 
                                        + Number(this.state.temporaryFormValues.monthly_mess_fee) 
                                        + Number(this.state.temporaryFormValues.monthly_laundry_fee) 
                                        + Number(this.state.temporaryFormValues.monthly_electricity_bill) 
                                        + Number(this.state.temporaryFormValues.monthly_water_bill) 
                                        + Number(this.state.temporaryFormValues.monthly_transportation_fee) 
                                        + Number(this.state.temporaryFormValues.monthly_parking_fee) 
                                        + Number(this.state.temporaryFormValues.monthly_other_fees)
                                        - Number(this.state.temporaryFormValues.adjust_value) ;

                                      // Set total_price in state if it has changed
                                      if (this.state.to_pay !== totaltopayAmount) {
                                        setTimeout(() => {
                                          this.setState({ to_pay: totaltopayAmount });
                                        }, 0);
                                      }

                                      return totaltopayAmount.toLocaleString("en-IN", {
                                        maximumFractionDigits: 0,
                                        style: "currency",
                                        currency: "INR",
                                      });
                                    })()}

                                  </b>
                                </td>

                                <td></td>
                              </tr>

                              <tr>
                                <td>
                                  <b>Total Amount for invoice</b>
                                </td>
                                <td>
                                  <b>
                                     {(() => {
                                      const totalAmount =
                                        Number(this.state.temporaryFormValues.monthly_admission_fee) +
                                        Number(this.state.temporaryFormValues.monthly_admission_kit) +
                                        Number(this.state.temporaryFormValues.monthly_room_rent) +
                                        Number(this.state.temporaryFormValues.monthly_cultural_fee) +
                                        Number(this.state.temporaryFormValues.monthly_caution_deposit) +
                                        Number(this.state.temporaryFormValues.monthly_mess_fee) +
                                        Number(this.state.temporaryFormValues.monthly_laundry_fee) +
                                        Number(this.state.temporaryFormValues.monthly_electricity_bill) +
                                        Number(this.state.temporaryFormValues.monthly_water_bill) +
                                        Number(this.state.temporaryFormValues.monthly_transportation_fee) +
                                        Number(this.state.temporaryFormValues.monthly_parking_fee) +
                                        Number(this.state.temporaryFormValues.monthly_other_fees);

                                      // Set total_price in state if it has changed
                                      if (this.state.total_price !== totalAmount) {
                                        setTimeout(() => {
                                          this.setState({ total_price: totalAmount });
                                        }, 0);
                                      }

                                      return totalAmount.toLocaleString("en-IN", {
                                        maximumFractionDigits: 0,
                                        style: "currency",
                                        currency: "INR",
                                      });
                                    })()}
                                  </b>
                                </td>

                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                    <button
                    type="submit"
                    style={{
                      padding: "8px 18px 8px 18px",
                      borderRadius: "0.375rem",

                      fontSize: "16px",
                      color: "#fff",
                      backgroundColor: "#883495",
                      borderColor: "#883495",
                      boxShadow:
                      "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                      marginBottom: "60px",
                    }}
                    >
                    Submit
                    </button>

                    </div>
                  </Form>
                    )}
              </Formik>

              <br />
              </>
              )}
              </div>

            </div>
          </section>
        </div>
      </Layout>
    );
  }
}

export default SetPlan;
