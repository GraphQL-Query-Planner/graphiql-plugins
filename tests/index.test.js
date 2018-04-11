const React = require('react');
const {viewer, resolverDetails, queryDetails, apolloTracing} = require('../src/index');

describe('viewer plugin', () => {
  it('should return an example plugin pane with the data provided', () => {
    const exampleResult = "{data: {foo: bar}}";
    const viewerMarkup = (
      <div>
        <h3>An example plugin</h3>
        <div> {exampleResult} </div>
      </div>
    )
    expect(viewer(exampleResult)).toEqual(viewerMarkup);
  });
});

describe('resolverDetails plugin', () => {
  it('should bail if results is empty', () => {
    expect(resolverDetails(undefined)).toBeUndefined();
  });

  it('should return error text if the results conains errors', () => {
    const exampleResult = "{\"errors\": {\"foo\": \"bar\"}}";
    expect(resolverDetails(exampleResult)).toEqual('Error found in query');
  });
});

describe('queryDetails plugin', () => {
  it('should bail if results is empty', () => {
    expect(queryDetails(undefined)).toBeUndefined();
  });

  it('should return error text if the results conains errors', () => {
    const exampleResult = "{\"errors\": {\"foo\": \"bar\"}}";
    expect(queryDetails(exampleResult)).toEqual('Error found in query');
  });
});

describe('apolloTracing plugin', () => {
  it('should bail if results is empty', () => {
    expect(apolloTracing(undefined)).toBeUndefined();
  });

  it('should return error text if the results conains errors', () => {
    const exampleResult = "{\"errors\": {\"foo\": \"bar\"}}";
    expect(apolloTracing(exampleResult)).toEqual('Error found in query');
  });
});
