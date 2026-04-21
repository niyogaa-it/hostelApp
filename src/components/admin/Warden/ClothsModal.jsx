import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
export default class ClothsModal extends Component {
  render() {
    return (
      <div>
        <h1>Modal</h1>
        <Modal
          show={this.props.edit}
          onHide={this.props.handleClose}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Cloth's Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BootstrapTable data={this.props.cloths}>
              <TableHeaderColumn
                isKey
                className={"text-uppercase"}
                dataField="fullName"
                width="120"
                dataAlign="center"
              >
                Cloth Name
              </TableHeaderColumn>
              <TableHeaderColumn
                className={"text-uppercase"}
                dataField="placeholder"
                width="120"
                dataAlign="center"
              >
                Cloth's Category
              </TableHeaderColumn>
              <TableHeaderColumn
                dataSort={true}
                className={"text-uppercase"}
                dataField="quantity"
                width="120"
                dataAlign="center"
              >
                Quantity
              </TableHeaderColumn>
            </BootstrapTable>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-primary"
              onClick={this.props.handleClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
