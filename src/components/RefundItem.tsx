import React from 'react';
import { f7 } from 'framework7-react';
import { useRecoilState } from 'recoil';

import { existedProductOnShoppingList, getShoppingList, IShoppingItem, saveShoppingList } from '@store';
import { shoppingListAtom } from '@atoms';
import { Refund } from '@interfaces/refund.interface';

interface RefundItemProps {
  userId: string;
  refundItem: Refund;
  isProviderList: boolean;
}

const RefundItemComponent: React.FC<RefundItemProps> = ({ userId, refundItem, isProviderList }) => {
  const [, setShoppingList] = useRecoilState<Array<IShoppingItem>>(shoppingListAtom);

  const onAddProductToShoppingList = (e: any, data: IShoppingItem) => {
    const shoppingList = getShoppingList(userId);
    if (existedProductOnShoppingList(userId, data.id)) {
      f7.dialog.alert('이미 장바구니에 있습니다.');
    } else {
      f7.dialog.alert('장바구니에 담았습니다.');
      const shoppingItem: IShoppingItem = {
        id: data.id,
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl,
        orderCount: 1,
      };
      shoppingList.push({ ...shoppingItem });
      saveShoppingList(userId, shoppingList);
      setShoppingList([...shoppingList]);
    }
  };

  return (
    <div className="border border-gray-400 mx-3 my-4">
      <div className="mb-4 bg-gray-200 p-2">{refundItem.refundedAt}</div>
      <div className="p-2">
        {isProviderList ? (
          <div className="mb-4">
            <div className="font-bold truncate mr-3">상품명 : {refundItem.orderItem.product.name}</div>
            <div className="mt-2">고객 이름 : {refundItem.refundee.username}</div>
            <div>고객 주소 : {refundItem.refundee.address}</div>
            <div>고객 번호 : {refundItem.refundee.phoneNumber}</div>
          </div>
        ) : (
          <div className="font-bold truncate mb-4">{refundItem.orderItem.product.name}</div>
        )}

        <div className="flex justify-between">
          <div>
            <span className="text-red-500 font-semibold mr-1">{refundItem.status}완료</span>
            <span className="mr-1">{refundItem.refundedAt}</span>
            <span>{refundItem.status} 접수</span>
          </div>
          {!isProviderList && (
            <button
              className={`w-1/3 py-2 px-3 rounded-md ml-2 ${
                existedProductOnShoppingList(userId, refundItem.orderItem.product.id)
                  ? 'border border-gray-600 text-gray-600 pointer-events-none'
                  : 'border-2 border-blue-600 text-blue-600'
              }`}
              onClick={(e) =>
                onAddProductToShoppingList(e, {
                  id: refundItem.orderItem.product.id,
                  name: refundItem.orderItem.product.name,
                  price: refundItem.orderItem.product.price,
                  orderCount: 1,
                  imageUrl: refundItem.orderItem.product.images[0],
                })
              }
              disabled={existedProductOnShoppingList(userId, refundItem.orderItem.product.id)}
            >
              장바구니 담기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundItemComponent;
