import { RouterProvider, createHashRouter } from "react-router-dom";
import "react-fluid-table/dist/index.css";
import Props from "./Props";
import { Example1 } from "./examples/01-base";
import { Example2 } from "./examples/02-sort";
import { Example3 } from "./examples/03-sub";
import { Example4 } from "./examples/04-custom";
import { Example5 } from "./examples/05-variable";
import { Example6 } from "./examples/06-expanded";
import { Example7 } from "./examples/07-controlled";
import { Example8 } from "./examples/08-header";
import { Example9 } from "./examples/09-scroll";
import { Example10 } from "./examples/10-footer";
import { Example11 } from "./examples/11-heights";
import { Example12 } from "./examples/12-frozen";
import { Example13 } from "./examples/13-infinite";
import Layout from "./components/Layout";

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Example1 />
      },
      {
        path: "/sort",
        element: <Example2 />
      },
      {
        path: "/sub",
        element: <Example3 />
      },
      {
        path: "/custom",
        element: <Example4 />
      },
      {
        path: "/variable",
        element: <Example5 />
      },
      {
        path: "/expanded",
        element: <Example6 />
      },
      {
        path: "/controlled",
        element: <Example7 />
      },
      {
        path: "/header",
        element: <Example8 />
      },
      {
        path: "/scroll",
        element: <Example9 />
      },
      {
        path: "/footer",
        element: <Example10 />
      },
      {
        path: "/heights",
        element: <Example11 />
      },
      {
        path: "/frozen",
        element: <Example12 />
      },
      {
        path: "/infinite",
        element: <Example13 />
      },
      {
        path: "/props",
        element: <Props />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
