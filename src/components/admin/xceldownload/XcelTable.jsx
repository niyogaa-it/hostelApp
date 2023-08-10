import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
const actionFormatter = (refObj) => (cell, row) => {
  return (
    <i>
      <input
        name="status"
        id="1"
        value="status"
        type="checkbox"
        onChange={(e) => {
          if (e.target.checked) {
            row.status = 1;
          } else {
            row.status = 0;
          }
        }}
        defaultChecked={cell}
      />
    </i>
  );
};
class XcelTable extends Component {
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
    };
  }

  componentWillReceiveProps() {
    this.setState(
      {
        settingsData: [],
      },
      () => {
        this.setState({
          settingsData: this.props.settingsData,
        });
      }
    );
  }

  render() {
    return (
      <BootstrapTable data={this.state.settingsData}>
        <TableHeaderColumn isKey dataField="label">
          Label
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField="status"
          dataFormat={actionFormatter(this)}
        >
          Checked Box
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default XcelTable;
