# react-fluid-table

> A React table inspired by @tanstack/react-virtual

[![NPM](https://img.shields.io/npm/v/react-fluid-table?style=flat-square)](https://www.npmjs.com/package/react-fluid-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

## Install

```bash
# using yarn
yarn add react-fluid-table

# using npm
npm i react-fluid-table
```

## Usage

```jsx
import "react-fluid-table/dist/index.css"; // this only needs to be imported once
import { Table } from "react-fluid-table";

const data = _.range(100).map(i => ({
  id: i + 1,
  firstName: randFirstName(),
  lastName: randLastName(),
  email: randEmail()
}));

const columns = [
  {
    key: "firstName",
    header: "First Name",
    width: 100
  },
  {
    key: "lastName",
    header: "Last Name",
    width: 100
  },
  {
    key: "email",
    header: "Email"
  }
];

const Example = () => <Table data={data} columns={columns} />;
```

## Development

To get a development environment working, run the following:

**Installation**

```bash
$ yarn install
$ cd example
$ yarn install
```

**Usage**

```bash
# in one terminal window/tab
$ yarn start
# in a separate terminal window/tab
$ cd example
$ yarn dev
```

## License

MIT © [Mckervin Ceme &lt;mckervinc@live.com&gt;](https://github.com/mckervinc)

---

This application was created using [create-react-hook](https://github.com/hermanya/create-react-hook).

This application features some icons from [Font Awesome](https://fontawesome.com/license/free).
