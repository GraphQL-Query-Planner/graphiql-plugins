# graphiql-plugins
A collections of plugins for GraphiQL.

* At this time this repo is not published as an npm package. It is used as a git submodule in our fork of [graphiql-rails](https://github.com/GraphQL-Query-Planner/graphiql-rails), which in turn is consumed in [`webscale`](https://github.com/GraphQL-Query-Planner/webscale).


### Setup

* Clone [`webscale`](https://github.com/GraphQL-Query-Planner/webscale) & [`graphiql-rails`](https://github.com/GraphQL-Query-Planner/graphiql-rails)

* Update `webscale`'s gemfile to point to your local clone of `graphiql-rails`

* In `graphiql-rails`, initialize and update the git stubmodules (`graphiql` & `graphiql-plugins`)
```
$ git submodule init && git submodule update --init
```


### Development

* After setup, nagivate to `graphiql-rails/packages/graphiql-plugins`

* `yarn install` to install dependencies

* `yarn run build:watch` to start the build server

* Write some code for `graphiql-plugins`.

* Navigate to `graphiql-rails` to run the build rake script to copy all the built `graphiql-plugins` assets to `graphiql-rails`
```
$ bundle exec rake update_graphiql_plugins
```

* Start the webscale server, hit `http://localhost:3000/graphiql-analyze` write some queries. The `graphiql-plugins` changes should be reflected in the browser.

