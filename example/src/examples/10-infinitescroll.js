import React, { useState} from "react";
import { Table } from "react-fluid-table";
import { testData } from "../data";
import _ from "lodash";
import { useStateWithCallbackLazy } from '../useStateWithCallback'
import { Loader } from 'semantic-ui-react'

const columns = [
    {
        key: "id",
        header: "ID",
        width: 50,
        sortable: true,
    },
    {
        key: "firstName",
        header: "First",
        sortable: true,
        width: 120
    },
    {
        key: "lastName",
        header: "Last",
        sortable: true,
        width: 120
    },
    {
        key: "email",
        header: "Email",
        sortable: true,
        width: 250
    }
];

const loaderStyle = { width: "100%",  padding: "10px" };

const Example10 = () => {
    const [data, setData] = useState([]);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isNexPageLoading, setIsNextPageLoading] = useStateWithCallbackLazy(false);


    const loadNextPage = (...args) => {
        setIsNextPageLoading(true, () => {
            setTimeout(() => {
                setHasNextPage(data.length < testData.length)
                setIsNextPageLoading(false)
                setData(() => {
                    let newData = testData.slice(args[0], args[1])
                    //console.log(newData, args[0], args[1], "Info")
                    return data.concat(newData)
                })

            }, 1000);
        })
    }

    return (
        <React.Fragment>
            <Table
                data={data}
                columns={columns}
                infiniteLoading={true}
                hasNextPage={hasNextPage}
                isNextPageLoading={isNexPageLoading}
                loadNextPage={(start, stop) => loadNextPage(start, stop)}
                minimumBatchSize={50}
                tableHeight={400}
                rowHeight={35}
                borders={false}
            />
            {isNexPageLoading && <div style={loaderStyle}><Loader active inline='centered'>Loading...</Loader></div>}
        </React.Fragment>

    );
};

// const Example10 = () => <Table data={testData} columns={columns} infiniteLoading={true} hasNextPage={true} />;

const Source = `

import React, { useState} from "react";
import { Table } from "react-fluid-table";
import _ from "lodash";
import { useStateWithCallbackLazy } from '../useStateWithCallback'
import { Loader } from 'semantic-ui-react'

const testData = _.range(3000).map(i => ({
  id: i + 1,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email()
}));

const columns = [
  { key: "id", header: "ID", width: 50 },
  { key: "firstName", header: "First", width: 120 },
  { key: "lastName", header: "Last", width: 120 },
  { key: "email", header: "Email", width: 250 }
];

const loaderStyle = { width: "100%",  padding: "10px" };

const Example = () => {
    const [data, setData] = useState([]);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isNexPageLoading, setIsNextPageLoading] = useStateWithCallbackLazy(false);
  

    const loadNextPage = (...args) => {
        setIsNextPageLoading(true, () => {
            setTimeout(() => {
                setHasNextPage(data.length < testData.length)
                setIsNextPageLoading(false)
                setData(() => {
                    let newData = testData.slice(args[0], args[1])
                    return data.concat(newData)
                })
              
              }, 1000);
        })
    }
  
    return (
      <Table
        data={data}
        columns={columns}
        infiniteLoading={true} 
        hasNextPage={hasNextPage}
        isNextPageLoading={isNexPageLoading}
        loadNextPage={(start, stop) => loadNextPage(start, stop)}
        minimumBatchSize={50}
        tableHeight={400}
        rowHeight={35}
        borders={false}
      />
    );
  };
;
`;

export { Example10, Source };
