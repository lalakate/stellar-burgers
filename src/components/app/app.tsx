import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '../app-header';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import {
  clearOrderModal,
  fetchIngredients,
  fetchUser,
  getIngredientsLoading
} from '@slices';
import { ProtectedRoute } from '../';
import { OrderModal } from '../order-modal';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(getIngredientsLoading);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchIngredients());
  }, []);

  const handleOnCloseModal = () => {
    navigate(-1);
    dispatch(clearOrderModal());
  };

  return (
    <div className={styles.app}>
      {isIngredientsLoading ? (
        <>
          <AppHeader />
          <Preloader />
        </>
      ) : (
        <>
          <AppHeader />
          <Routes location={backgroundLocation || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/ingredients/:ingredientId'
              element={<IngredientDetails />}
            />
            <Route path='/feed/:number' element={<OrderInfo />} />

            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route
                path='/ingredients/:ingredientId'
                element={
                  <Modal
                    title='Детали ингредиента'
                    onClose={handleOnCloseModal}
                  >
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/feed/:number'
                element={<OrderModal onClose={handleOnCloseModal} />}
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <OrderModal onClose={handleOnCloseModal} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
