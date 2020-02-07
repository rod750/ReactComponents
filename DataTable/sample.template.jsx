import React from "react";
import { Container, Table, Dimmer, Loader } from "semantic-ui-react";

/**
 * Sample table template
 * Only renderTable, renderError and renderLoading are required by DataTable
 * @param {object} DataTable props 
 * @param {object} DataTable controller instance 
 */
export const sampleTemplate = function(props, dataTable) {
  this.renderHeaders = () => {
    return dataTable.headers.map(header => {
      return (
        <Table.HeaderCell
          sorted={header.sorted}
          onClick={() => dataTable.onHeaderClick(header)}>
          {header.label}
        </Table.HeaderCell>
      );
    });
  };

  this.renderRow = rowData => {
    return (
      <Table.Row onClick={() => dataTable.onRowClick(rowData)}>
        { rowData.map(columnData => {
          return this.renderColumn(columnData);
        }) }
      </Table.Row>
    );
  };

  this.renderColumn = columnData => {
    return <Table.Cell>{columnData.content}</Table.Cell>;
  };

  /**
   * @param {Object} data
   * @param {Array} data.rows Row collection passed by DataTable
   */
  this.renderTable = data => {
    return (
      <Container fluid>
        <Table
          basic="very"
          compact
          textAlign="center"
          sortable
          className="Wrapper__Body-Table">
            <Table.Header className="Wrapper__Body-Table-Header">
              <Table.Row>
                { this.renderHeaders() }
              </Table.Row>
            </Table.Header>
            <Table.Body className="Wrapper__Body-Table-Body">
              { data.rows.map(rowData => {
                return this.renderRow(rowData);
              }) }
            </Table.Body>
        </Table>
      </Container>
    );
  };

  this.renderError = error => {
    return (
      <Container fluid className="Wrapper__Body-Loader">
        <Dimmer active inverted>
          <Loader testid="loading-wrapper" inverted content="Error" />
        </Dimmer>
      </Container>
    );
  };

  this.renderLoading = () => {
    return (
      <Container fluid className="Wrapper__Body-Loader">
        <Dimmer active inverted>
          <Loader testid="loading-wrapper" inverted content="Cargando..." />
        </Dimmer>
      </Container>
    );
  };

  return this;
};
