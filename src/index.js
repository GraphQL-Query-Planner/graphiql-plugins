import ReactTable from 'react-table';
import treeTableHOC from 'react-table/lib/hoc/treeTable';

const TreeTable = treeTableHOC(ReactTable);

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

export const resolverDetails = function(results) {
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


export const queryDetails = function(results) {
  if (!results) {return;}
  const resultsObj = JSON.parse(results)
  if (resultsObj) {
    const analyzer = resultsObj.extensions && resultsObj.extensions.analyzer;
    const {resolvers} = analyzer.execution;

    const details = resolvers.map((resolver) => resolver.details);

    if (!analyzer) {
      return (
        <div>
          <span>Analyzer extenstion not found. </span>
        </div>
      )
    }
    else {
      const columns = [
        {
          Header: 'Queries',
          accessor: 'id',
          Cell: props => <span>{props.original.root}</span>
        },
      ];

      return (
        <TreeTable
          data={details}
          columns={columns}
          minRows={3}
          showPagination={false}

          SubComponent={(row)=>{
            const columns = [
              {
                Header: 'Detail',
                accessor: 'details',
                width: 150,
                Cell: (ci) => { return `${ci.value}:`},
              },
              { Header: 'Value', accessor: 'value' },
            ]
            debugger;
            // const {explained_queries} = row.original.details;
            const rowData = Object.keys(row.original).map((key)=>{
              return {
                details: key,
                value: row.original[key].toString(),
              }
            });
            return (
              <div style={{padding:'10px'}}>
                <ReactTable
                  data={rowData}
                  columns={columns}
                  pageSize={rowData.length}
                  showPagination={false}
                />
              </div>
            );
          }}
        />
      )
    }
  }
};
