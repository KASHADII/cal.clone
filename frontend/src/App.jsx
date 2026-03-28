import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import BookingsList from './pages/BookingsList';
import Availability from './pages/Availability';
import Layout from './components/Layout';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cal-clone-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/bookings" element={<Layout><BookingsList /></Layout>} />
          <Route path="/availability" element={<Layout><Availability /></Layout>} />
          <Route path="/book/:slug" element={<BookingPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
