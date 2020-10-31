import React, {  ReactNode, Ref } from "react";
import InfiniteLoader from 'react-window-infinite-loader';

import { ListOnItemsRenderedProps } from 'react-window';

type OnItemsRendered = (props: ListOnItemsRenderedProps) => any;
export interface Generic {
    [key: string]: any;
  }
interface InfiniteLoaderWrapperProps {
    hasNextPage?: boolean;
    isNextPageLoading?: boolean;
    minimumBatchSize?: number,
    data: Generic[];
    loadNextPage?: (startIndex: number, stopIndex: number) => Promise<any> | null;
    children: (props: {onItemsRendered: OnItemsRendered, ref: Ref<any>}) => ReactNode;
}



/**
 * Implementing react-window-infinite-loader ExampleWrapper.
 */


const InfiniteLoaderWrapper = ({ hasNextPage, isNextPageLoading, minimumBatchSize, data, loadNextPage, children }: InfiniteLoaderWrapperProps) => {

    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    const itemCount = hasNextPage ? minimumBatchSize ? data.length + minimumBatchSize : data.length + 10 : data.length;

    // Only load 1 page of items at a time.
    // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
    const loadMoreItems = isNextPageLoading  ? () => null : loadNextPage == undefined ? () => null : loadNextPage

    // Every row is loaded except for our loading indicator row.
    const isItemLoaded = (index : number) => {
     return !hasNextPage || index < data.length;
    }

    

    return (
        <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      minimumBatchSize={minimumBatchSize}
    >
      {({onItemsRendered, ref}) => (
          children({
            ref: ref,
            onItemsRendered
          })
        
      )}
    </InfiniteLoader>
    );

}

InfiniteLoaderWrapper.defaultProps = {
  hasNextPage: false,
  isNextPageLoading: false,
  loadNextPage: null,
  minimumBatchSize: 10,
};

export default InfiniteLoaderWrapper;