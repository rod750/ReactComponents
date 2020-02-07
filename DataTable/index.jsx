import React, { useState } from "react";
import { Query } from "react-apollo";
import * as _ from "lodash";

/**
 * Customizable component for table rendering
 * @param {Object} props
 * @param {Function} props.onOrderChange OnOrderChange(eventData) callback
 * @param {Function} props.onRowClick OnRowClick(eventData) callback
 * @param {Object} props.query GraphQL query
 * @param {Object} props.variables Query variables
 * @param {Array} props.children React children
 * @param {Function} props.template Template function
 * @param {String} props.itemsKey Key name of the collection that needs to be retrieved from the response
 * @param {String|Function} props.defaultContent Default content for empty cells
 * @param {String} props.fetchPolicy Apollo Client fetch policy
 * @param {Function} props.onCompleted Query onCompleted callback
 */
const DataTable = ({
  onOrderChange,
  onRowClick,
  query,
  variables,
  children,
  template,
  itemsKey,
  defaultContent = "N/A",
  fetchPolicy="network-only",
  onCompleted,
  ...props
}) => {
  /*
   * Create an empty object to store instance methods and variables
   * to avoid dealing with complex `this` binding and context handling
   * with React
   */
  const self = {};

  /**
   * Children components that will be used to extract columns configuration
   */
  self.columns = React.Children.toArray(children);

  /**
   * Instantiate the template helper
   */
  template = new template(props, self);
  
  /**
   * Extract the table headers configuration from children components
   * and assign to the instance object
   */
  const [headers, setHeaders] = useState(
    Array.from(self.columns).map((column, index) => {
      return {
        name: column.props.name,
        label: column.props.label,
        sorted: null,
        index: index,
        sortable: column.props.sortable
      };
    })
  );


  self.headers = headers;
  self.setHeaders = setHeaders;

  /**
   * Updates the headers array so the clicked header has the
   * correct sort value, it returns the value as a Prisma
   * sort enum.
   */
  self.onHeaderClick = header => {
    if(!header.sortable)
      return false;

    let sorted = "ascending";

    if(header.sorted) {
      sorted = header.sorted === "ascending" ?
        "descending" :
        "ascending";
    }

    self.headers = self.headers.map(h => {
      return { ...h, sorted: null };
    });
    
    self.headers[header.index] = { ...header, sorted: sorted };

    onOrderChange && onOrderChange({
      ...self.headers[header.index],
      orderEnum: self.getOrderEnum(header.name, sorted)
    });

    self.setHeaders(Array.from(self.headers));
  };

  /**
   * Process a column name and order values to comply Prisma sort enum
   * format
   * 
   * @param {String} name
   * @param {String} order
   * 
   * @returns {String}
   */
  self.getOrderEnum = (name, order) => {
    order = order === "ascending" ?
      "ASC" :
      "DESC";

    return [name, order].join("_");
  };

  /**
   * Retrieve the rows formated by the content parameter or if not provided
   * by extracting the value of the property of each value that matches
   * the name prop of the column component
   * @param {Array} data collection array
   * @returns {Object}
   */
  const formatData = data => {
    const rows = data[itemsKey].map((row, index) => {
      return self.columns.map(column => {
        let content = defaultContent;

        if(column.props.content &&
          typeof column.props.content === "function"){
          content = column.props.content(row, column, index);
        }
        else {
          content = _.get(
            row,
            column.props.content || column.props.name,
            column.props.defaultContent || defaultContent
          );
        }

        return { object: row, content: content, index: index };
      });
    });

    return { rows: rows };
  };

  self.onRowClick = row => {
    onRowClick && onRowClick(row);
  };
  
  return (
    <Query
      query={query}
      variables={variables}
      fetchPolicy={fetchPolicy}
      onCompleted={onCompleted}>
      { ({ loading, error, data, refetch }) => {
        refetch();
        if(loading)
          return (
            <>
              { template.renderLoading() }
            </>
          );

        if(error)
          return (
            <>
              { template.renderError(error) }
            </>
          );

        data = formatData(data);

        return (
          <>
            { template.renderTable(data) }
          </>
        );
      } }
    </Query>
  );
};

/* Empty component to use as data container */
DataTable.Column = ({
  name,
  content,
  label,
  defaultContent,
  sortable
}) => {
  return null;
};

export default DataTable;
