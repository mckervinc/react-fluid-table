# react-fluid-table

> A React table inspired by react-window

[![NPM](https://img.shields.io/npm/v/react-fluid-table.svg)](https://www.npmjs.com/package/react-fluid-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
# using yarn
yarn add react-fluid-table

# using npm
npm i react-fluid-table
```

## Usage

```jsx
import { Table } from "react-fluid-table";

const data = _.range(100).map(i => ({
  id: i + 1,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email()
}));

const columns = [
  {
    key: "firstName",
    name: "First Name",
    width: 100
  },
  {
    key: "lastName",
    name: "Last Name",
    width: 100
  },
  {
    key: "email",
    name: "Email"
  }
];

const Example = () => {
  return (
    <Table
      data={data}
      columns={columns}
      tableHeight={400}
    />
  );
};
```

## Development

To get a development environment working, run the following:

**Installation**

```bash
$ yarn install
$ yarn link
$ cd example
$ yarn install react-fluid-table
```

**Usage**

```bash
# in one terminal window/tab
$ yarn start
# in a separate terminal window/tab
$ cd example
$ yarn start
```

## License

MIT © [Mckervin Ceme &lt;mckervinc@live.com&gt;](https://github.com/mckervinc)

---

This application was created using [create-react-hook](https://github.com/hermanya/create-react-hook).

This application features some icons From [Font Awesome](https://fontawesome.com/license/free).
