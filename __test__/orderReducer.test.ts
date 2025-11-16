import { ordersListSlice } from '@slices';
import { TOrder } from '@utils-types';
import {
  clearOrderModal,
  createOrder,
  fetchOrder,
  fetchOrders,
  initialState,
  initialStateOrdersList,
  orderDetailsSlice
} from 'src/services/slices/order';

const mockOrders: TOrder[] = [
  {
    _id: 'order1',
    name: 'Test Burger',
    ingredients: ['bun1', 'main1'],
    status: 'done',
    number: 12345,
    createdAt: '2025-09-27T00:00:00.000Z',
    updatedAt: '2025-09-27T00:00:00.000Z'
  }
];

const mockOrder: TOrder = {
  _id: 'order1',
  name: 'Test Burger',
  ingredients: ['bun1', 'main1'],
  status: 'done',
  number: 12345,
  createdAt: '2025-09-27T00:00:00.000Z',
  updatedAt: '2025-09-27T00:00:00.000Z'
};

const mockOrderModal = {
  order: mockOrder,
  name: 'Test Burger'
};

describe('Тестирование ordersListSlice', () => {
  test('Проверка initial state для unknown action', () => {
    const state = ordersListSlice.reducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialStateOrdersList);
  });

  test('Проверка fetchOrders.pending', () => {
    const state = ordersListSlice.reducer(
      initialStateOrdersList,
      fetchOrders.pending('')
    );
    expect(state).toEqual({
      ...initialStateOrdersList,
      loading: true,
      error: null
    });
  });

  test('Проверка fetchOrders.fulfilled', () => {
    const state = ordersListSlice.reducer(
      initialStateOrdersList,
      fetchOrders.fulfilled(mockOrders, '')
    );
    expect(state).toEqual({
      ...initialStateOrdersList,
      loading: false,
      data: mockOrders
    });
  });

  test('Проверка fetchOrders.rejected', () => {
    const errorMessage = 'Failed to fetch orders';
    const action = {
      type: fetchOrders.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };
    const state = ordersListSlice.reducer(initialStateOrdersList, action);
    expect(state).toEqual({
      ...initialStateOrdersList,
      loading: false,
      error: errorMessage
    });
  });
});

describe('Тестирование orderDetailsSlice', () => {
  test('Проверка initial state для unknown action', () => {
    const state = orderDetailsSlice.reducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });

  test('Проверка clearOrderModal', () => {
    const stateWithData = {
      ...initialState,
      data: mockOrderModal
    };
    const state = orderDetailsSlice.reducer(stateWithData, clearOrderModal());
    expect(state).toEqual(initialState);
  });

  test('Проверка fetchOrder.pending', () => {
    const state = orderDetailsSlice.reducer(
      initialState,
      fetchOrder.pending('', 12345)
    );
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('Проверка fetchOrder.fulfilled', () => {
    const state = orderDetailsSlice.reducer(
      initialState,
      fetchOrder.fulfilled(mockOrder, '', 12345)
    );
    expect(state).toEqual({
      ...initialState,
      loading: false,
      data: { order: mockOrder, name: mockOrder.name }
    });
  });

  test('Проверка fetchOrder.rejected', () => {
    const errorMessage = 'Order not found';
    const action = {
      type: fetchOrder.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };
    const state = orderDetailsSlice.reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  test('Проверка createOrder.pending', () => {
    const state = orderDetailsSlice.reducer(
      initialState,
      createOrder.pending('', ['bun1', 'main1'])
    );
    expect(state).toEqual({
      ...initialState,
      orderRequest: true,
      error: null
    });
  });

  test('Проверка createOrder.fulfilled', () => {
    const state = orderDetailsSlice.reducer(
      initialState,
      createOrder.fulfilled(mockOrderModal, '', ['bun1', 'main1'])
    );
    expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      data: mockOrderModal
    });
  });

  test('Проверка createOrder.rejected', () => {
    const errorMessage = 'Failed to create order';
    const action = {
      type: createOrder.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };
    const state = orderDetailsSlice.reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      error: errorMessage
    });
  });

  describe('fetchOrder thunk', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('dispatches fulfilled when fetch succeeds', async () => {
      const mockDispatch = jest.fn();
      const mockGetState = jest
        .fn()
        .mockReturnValue({ orderDetails: initialState });
      jest
        .spyOn(require('@api'), 'getOrderByNumberApi')
        .mockResolvedValue({ success: true, orders: [mockOrder] });

      await fetchOrder(12345)(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrder.pending.type
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrder.fulfilled.type,
          payload: mockOrder
        })
      );
    });

    test('dispatches rejected when fetch fails', async () => {
      const mockDispatch = jest.fn();
      const mockGetState = jest
        .fn()
        .mockReturnValue({ orderDetails: initialState });
      const errorMessage = 'Order not found';
      jest
        .spyOn(require('@api'), 'getOrderByNumberApi')
        .mockResolvedValue({ success: false, orders: [] });

      await fetchOrder(12345)(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrder.pending.type
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrder.rejected.type,
          payload: errorMessage
        })
      );
    });
  });
});
