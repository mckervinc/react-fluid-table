import { RouterProvider, createHashRouter } from "react-router-dom";
import Page from "./Page";
import Props from "./Props";
import { Example1, Source as Example1Code } from "./examples/01-base";
import { Example2, Source as Example2Code } from "./examples/02-sort";
import { Example3, Source as Example3Code } from "./examples/03-sub";
import { Example4, Source as Example4Code } from "./examples/04-custom";
import { Example5, Source as Example5Code } from "./examples/05-variable";
import { Example6, Source as Example6Code } from "./examples/06-expanded";
import { Example7, Source as Example7Code } from "./examples/07-controlled";
import { Example8, Source as Example8Code } from "./examples/08-header";
import { Example9, Source as Example9Code } from "./examples/09-scroll";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <Page title="Basic Table" code={Example1Code}>
        <Example1 />
      </Page>
    )
  },
  {
    path: "/sort",
    element: (
      <Page title="Sortable Table" code={Example2Code}>
        <Example2 />
      </Page>
    )
  },
  {
    path: "/sub",
    element: (
      <Page title="Table with Subcomponent" code={Example3Code}>
        <Example3 />
      </Page>
    )
  },
  {
    path: "/custom",
    element: (
      <Page title="Cell Content" code={Example4Code}>
        <Example4 />
      </Page>
    )
  },
  {
    path: "/variable",
    element: (
      <Page title="Variable Row Size" code={Example5Code}>
        <Example5 />
      </Page>
    )
  },
  {
    path: "/expanded",
    element: (
      <Page title="Expanded Row Height" code={Example6Code}>
        <Example6 />
      </Page>
    )
  },
  {
    path: "/controlled",
    element: (
      <Page title="Controlled Props" code={Example7Code}>
        <Example7 />
      </Page>
    )
  },
  {
    path: "/header",
    element: (
      <Page title="Custom Styling" code={Example8Code}>
        <Example8 />
      </Page>
    )
  },
  {
    path: "/scroll",
    element: (
      <Page title="Methods" code={Example9Code}>
        <Example9 />
      </Page>
    )
  },
  {
    path: "/props",
    element: (
      <Page>
        <Props />
      </Page>
    )
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
