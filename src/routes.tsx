import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import RequireAuth from './components/RequireAuth';
import Skills from './pages/Skills';
import Resume from './pages/Resume';
import Messages from './pages/dashboard/Messages';

// Import hiring feature components
import ServiceSelection from './features/hiring/pages/ServiceSelection';
import RequestList from './features/hiring/pages/RequestList';
import RequestForm from './features/hiring/pages/RequestForm';
import RequestDetails from './features/hiring/pages/RequestDetails';
import PaymentSuccess from './features/hiring/pages/PaymentSuccess';
import PaymentFailed from './features/hiring/pages/PaymentFailed';

// Lazy load admin components
const AdminDashboard = lazy(() => import('./features/admin/pages/Dashboard'));
const AdminRequestList = lazy(() => import('./features/admin/pages/RequestList'));
const AdminRequestDetail = lazy(() => import('./features/admin/pages/RequestDetail'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));
const AdminUsers = lazy(() => import('./features/admin/pages/Users'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary>
      <div>Something went wrong</div>
    </ErrorBoundary>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'projects',
        children: [
          {
            index: true,
            element: <Projects />,
          },
          {
            path: ':slug',
            element: <ProjectDetail />,
          },
        ],
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'skills',
        element: <Skills />, 
      },
      {
        path: 'resume',
        element: <Resume />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: 'dashboard/messages',
        element: <ProtectedRoute><Messages /></ProtectedRoute>,
      },
      {
        path: 'dashboard/messages/:conversationId',
        element: <ProtectedRoute><Messages /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      // Hiring System Routes
      {
        path: 'hiring',
        children: [
          {
            index: true,
            element: <Navigate to="services" replace />,
          },
          {
            path: 'services',
            element: <ServiceSelection />,
          },
          {
            path: 'requests',
            element: <RequestList />,
          },
          {
            path: 'request',
            children: [
              {
                path: 'new',
                element: <RequestForm />,
              },
              {
                path: ':id',
                element: <RequestDetails />,
              },
            ],
          },
          {
            path: 'payment-success',
            element: <PaymentSuccess />,
          },
          {
            path: 'payment-failed',
            element: <PaymentFailed />,
          },
        ],
      },
      // Admin Routes
      {
        path: 'admin',
        element: <RequireAuth isAdmin />,
        children: [
          {
            path: 'messages',
            element: <AdminMessages />,
          },
          {
            path: 'messages/:conversationId',
            element: <AdminMessages />,
          },
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminDashboard />
              </Suspense>
            ),
          },
          {
            path: 'users',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminUsers />
              </Suspense>
            ),
          },
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'requests',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminRequestList />
              </Suspense>
            ),
          },
          {
            path: 'requests/:id',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminRequestDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
