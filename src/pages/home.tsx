import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navbar, NavLeft, NavRight, NavTitle, Page } from 'framework7-react';
import { useRecoilState } from 'recoil';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { useFormik } from 'formik';

import { shoppingListAtom } from '@atoms';
import Categories from '@components/Categories';
import useAuth from '@hooks/useAuth';
import { getShoppingList, IShoppingItem } from '@store';
import SearchBar from '@components/SearchBar';
import ProductsList from '@components/ProductsList';
import { GetProductsBySearchTermOutput, SortState } from '@interfaces/product.interface';
import { productKeys } from '@reactQuery/query-keys';
import { getProductsBySearchTermAPI } from '@api';

interface ProductFilterProps {
  sort: SortState;
}

const HomePage = ({ f7router }) => {
  const { currentUser } = useAuth();
  const [shoppingList, setShoppingList] = useRecoilState<Array<IShoppingItem>>(shoppingListAtom);
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const queryClient = useQueryClient();

  const filterForm = useFormik<ProductFilterProps>({
    initialValues: {
      sort: 'createdAt desc',
    },

    onSubmit: async () => {
      await queryClient.removeQueries(PRODUCT_KEY);
      await refetch();
    },
  });

  const PRODUCT_KEY = productKeys.search({ sort: filterForm.values.sort, page, query });

  const {
    hasNextPage, //
    isFetchingNextPage,
    isFetching,
    data,
    error,
    status,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery<GetProductsBySearchTermOutput, Error>(
    PRODUCT_KEY,
    ({ pageParam }) => getProductsBySearchTermAPI({ sort: filterForm.values.sort, page: pageParam, query }),
    {
      getNextPageParam: (lastPage) => {
        const hasNextPage = lastPage.hasNextPage;
        return hasNextPage ? lastPage.nextPage : false;
      },
      onSuccess: (data) => {
        if (hasNextPage) {
          setPage(data.pages[0].nextPage);
        }
      },
      enabled: !!query,
    },
  );

  const productsRefetch = useCallback(() => {
    refetch();
  }, []);

  const useSetQuery = useCallback((query) => {
    setQuery(query);
  }, []);

  useEffect(() => {
    setShoppingList(getShoppingList(currentUser?.id));
    if (inView && hasNextPage && !isFetching && entry.isIntersecting) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, currentUser?.id]);

  const onRefresh = async (done) => {
    await queryClient.removeQueries(PRODUCT_KEY);
    await productsRefetch();
    done();
  };

  return (
    <Page name="home" onPtrRefresh={onRefresh} ptr>
      <Navbar>
        <NavLeft>
          <Link icon="las la-bars" panelOpen="left" />
        </NavLeft>
        <NavTitle>Houpang</NavTitle>
        <NavRight>
          <Link href="/shopping-list" iconF7="cart" iconBadge={shoppingList.length} badgeColor="red" />
        </NavRight>
      </Navbar>
      <SearchBar query={query} setQuery={useSetQuery} refetch={productsRefetch} />
      <Categories />
      <ProductsList //
        f7router={f7router}
        status={status}
        error={error}
        data={data}
        PRODUCT_KEY={PRODUCT_KEY}
        filterForm={filterForm}
      />
      <div className="flex justify-center font-bold mt-4">
        <div ref={hasNextPage && !isFetching ? ref : null}>
          {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : ''}
        </div>
      </div>
    </Page>
  );
};
export default React.memo(HomePage);
