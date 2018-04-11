import React from 'react';
import ReactTable from "react-table";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import { HorizontalBar } from "react-chartjs-2";

const TreeTable = treeTableHOC(ReactTable);

export const Plugin = <div />;

export const viewer = function(results) {
  if (results) {
    return (
      <div>
        <h3>An example plugin</h3>
        <div> {results} </div>
      </div>
    );
  }
};

export const resolverDetails = function(results) {
  if (!results) {
    return;
  }

  let resultsObj;
  try {
    resultsObj = JSON.parse(results);
  } catch(e) {
    throw new Error('Error found in query');
  }

  if (resultsObj.errors) {
    return 'Error found in query';
  }

  if (resultsObj) {
    const analyzer = resultsObj.extensions && resultsObj.extensions.analyzer;
    const resolvers = analyzer.execution.resolvers;

    if (!analyzer) {
      return (
        <div>
          <span>Analyzer extenstion not found.</span>
        </div>
      );
    } else {
      const columns = [
        {
          Header: "Query ID",
          accessor: "id",
          Cell: props => <span>{props.index + 1}</span>
        },
        {
          Header: "Path",
          accessor: "path",
          Cell: props => <span>{props.original.path.join(", ")}</span>
        },
        {
          Header: "Adapter",
          accessor: "adapter"
        },
        {
          Header: "Parent Type",
          accessor: "parentType"
        },
        {
          Header: "Field Name",
          accessor: "fieldName"
        },
        {
          Header: "Return Type",
          accessor: "returnType"
        }
      ];

      return (
        <ReactTable
          data={resolvers}
          columns={columns}
          minRows={3}
          showPagination={false}
        />
      );
    }
  }
};

export const queryDetails = function(results) {
  if (!results) {
    return;
  }

  let resultsObj;
  try {
    resultsObj = JSON.parse(results);
  } catch(e) {
    throw new Error('Error found in query');
  }

  if (resultsObj.errors) {
    return 'Error found in query';
  }

  if (resultsObj) {

    const analyzer = resultsObj.extensions && resultsObj.extensions.analyzer;
    const { resolvers } = analyzer.execution;

    let details;

    const elasticSearch = resolvers[0].adapter === 'elasticsearch'
    if (elasticSearch){
      const originalDetails = [].concat.apply([], resolvers.map((resolver) => resolver.details));
      details = originalDetails.map((detail) => {
        const {payload} = detail
        const {name, klass, search} = payload;
        const {index, type, q} = search;
        return {
          id: `${detail.name} - ${detail.id}`,
          name,
          klass,
          'search.index': index.join(", "),
          'search.type': type.join(", "),
          'search.query': q,
        }
      })
    } else {
      details = [].concat.apply([], resolvers.map(resolver => resolver.details));
    }

    const getHeaderTitle = function(props) {
      if (props.original.root) {
        return props.original.root
      }
      if (props.original.id && props.original.id.includes('elasticsearch')) {
        return `${props.original.id}`
      }
      return '';
    }

    if (!analyzer) {
      return (
        <div>
          <span>Analyzer extenstion not found. </span>
        </div>
      );
    } else {


      const columns = [
        {
          Header: "Queries",
          accessor: "id",
          Cell: props => <span>{getHeaderTitle(props)}</span>
        }
      ];

      return (
        <TreeTable
          data={details}
          columns={columns}
          minRows={3}
          showPagination={false}
          SubComponent={row => {
            const columns = [
              {
                Header: "Detail",
                accessor: "details",
                width: 150,
                Cell: ci => {
                  return `${ci.value}:`;
                }
              },
              { Header: "Value", accessor: "value" }
            ];

            const { explained_queries } = row.original;
            const collapsedData = explained_queries ? explained_queries[0] : row.original;

            const rowData = Object.keys(collapsedData).map(key => {
                return {
                  details: key,
                  value: collapsedData[key]
                };
              });
            return (
              <div>
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
      );
    }
  }
};

function formatToMS(time) {
  const NS_TO_MS = 1000000;
  return (time / NS_TO_MS).toFixed(2);
}

export const apolloTracing = function(results) {
  if (!results) {
    return;
  }

  let resultsObj;
  try {
    resultsObj = JSON.parse(results);
  } catch(e) {
    throw new Error('Error found in query');
  }

  if (resultsObj.errors) {
    return 'Error found in query';
  }

  if (resultsObj) {

    const tracing = resultsObj.extensions && resultsObj.extensions.tracing;
    const msec = formatToMS(tracing.duration);

    const resolvers = tracing.execution && tracing.execution.resolvers;
    if (!resolvers) { return; }

    const labels = resolvers.map(resolver => resolver.path.join(", "))
    const startData = resolvers.map(resolver => formatToMS(resolver.startOffset))
    const durationData = resolvers.map(resolver => formatToMS(resolver.duration))
    const displayTicks = labels.length > 30 ? false : true;

    const data = {
      labels,

      datasets: [
        {
          data: startData,
          backgroundColor: "rgba(63,103,126,0)",
          hoverBackgroundColor: "rgba(50,90,100,0)",
          label: "Start (ms)"
        },
        {
          data: durationData,
          backgroundColor: "#D64292",
          label: "Time (ms)"
        }
      ]
    };

    const options = {
      hover: {
        animationDuration: 5
      },
      scales: {
        xAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: true,
              fontSize: 12
            },
            scaleLabel: {
              display: true,
              labelString: "Time (ms)",
            },
            stacked: true,
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: "#fff",
              zeroLineColor: "#fff",
              zeroLineWidth: 0
            },
            ticks: {
              display: displayTicks,
              fontSize: 11,
            },
            scaleLabel: {
              display: true,
              labelString: "Resolvers",
            },
            stacked: true,
          }
        ]
      },
      legend: {
        display: false
      }
    };

    const style = {
      margin: '25px'
    }
    return (
      <div>
        <div style={style}>
          <span> <b> {"Total Query Execution Time: "} </b> {msec} {"ms"} </span>
        </div>
        <HorizontalBar data={data} options={options} />
      </div>
    );
  }
};
