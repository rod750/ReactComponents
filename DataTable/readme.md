This is a component for rendering tables usign ApolloClient offers a
clean and fast way of define tables format using jsx.

Example usage:

```jsx

...

const onOrderChange = (header) => {
  /* Returns header object and you can access the orderEnum
   * in `header.orderEnum` to update your state and your
   * query
   */
};

const onCompleted = (response) => {
  /* Useful for comunicating with pagination components
   * returns the GraphQL response data
   */
}

/* You can pass functions to format the content in any way including jsx */
const parseDate = (column, data) => {
  const date = data[column.props.name];

  return moment(date).format("DD/MM/YYYY");
};

...

<DataTable
  onOrderChange={onOrderChange}
  onCompleted={onCompleted}
  template={sampleTemplate}
  query={state.query}
  variables={state.variables}
  itemsKey="projects">
  <DataTable.Column
    name="name"
    label="Project name"
    sortable />
  <DataTable.Column
    name="clientName"
    label="Client"
    sortable />
  <DataTable.Column
    name="startDate"
    label="Start date"
    content={(row, column, index) => parseDate(column, row)}
    sortable />
  <DataTable.Column
    name="finishDate"
    label="End date"
    content={(row, column, index) => parseDate(column, row)}
    sortable />
  <DataTable.Column
    name="actions"
    label="Actions"
    content={
      (row, column, index) => 
        <ActionButtons
          index={index}
          client={row.client} />
    } />
</DataTable>
```
