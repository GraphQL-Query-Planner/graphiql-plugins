import ReactTable from 'react-table';

export const Plugin = <div />;

export const viewer = function(results) {
  if (results) {
    return (
      <div>
        <h3>An example plugin</h3>
        <div> {results} </div>
      </div>
    )
  }
};

export const formatted = function(results) {
  if (!results) {return;}
  const resultsObj = JSON.parse(results)
  if (resultsObj) {
    const analyzer = resultsObj.extensions && resultsObj.extensions.analyzer;
    const resolvers = analyzer.execution.resolvers;

    if(!analyzer) {
      return (
        <div>
          <span>Analyzer extenstion not found. </span>
        </div>
      )
    }
    else {
      const columns = [
        {
          Header: 'Query ID',
          accessor: 'id',
          Cell: props => <span>{props.index + 1}</span>
        },
        {
          Header: 'Path',
          accessor: 'path'
        },
        {
          Header: 'Adapter',
          accessor: 'adapter'
        },
        {
          Header: 'Parent Type',
          accessor: 'parentType'
        },
        {
          Header: 'Field Name',
          accessor: 'fieldName'
        },
        {
          Header: 'Return Type',
          accessor: 'returnType'
        }
      ];

      return (
        <ReactTable
          data={resolvers}
          columns={columns}
          minRows={3}
          showPagination={false}
        />
      )
    }
  }
};
