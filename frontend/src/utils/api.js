const API_BASE = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')}/api`;

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.warn('API health check error:', err);
    return {
      connected: false,
      mode: 'Offline / Client Fallback',
      total_cars: 8,
      total_bookings: 0
    };
  }
}

export async function fetchCars(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.series && filters.series !== 'All') params.append('series', filters.series);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/cars?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch cars');
    const data = await res.json();
    return data.cars || [];
  } catch (err) {
    console.error('API fetchCars failed:', err);
    return [];
  }
}

export async function fetchCarById(carId) {
  try {
    const res = await fetch(`${API_BASE}/cars/${carId}`);
    if (!res.ok) throw new Error('Car not found');
    return await res.json();
  } catch (err) {
    console.error('API fetchCarById error:', err);
    return null;
  }
}

export async function createCar(carData) {
  const res = await fetch(`${API_BASE}/cars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to create BMW car');
  }
  const data = await res.json();
  return data.car || data;
}

export async function updateCar(carId, carData) {
  const res = await fetch(`${API_BASE}/cars/${carId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to update BMW car');
  }
  const data = await res.json();
  return data.car || data;
}

export async function deleteCar(carId) {
  const res = await fetch(`${API_BASE}/cars/${carId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to delete BMW car');
  }
  return await res.json();
}

export async function bookShowroomVisit(visitData) {
  const res = await fetch(`${API_BASE}/dealership-visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visitData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit showroom visit booking');
  }
  return await res.json();
}

export async function fetchAllBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    const data = await res.json();
    return data.bookings || [];
  } catch (err) {
    console.error('API fetchAllBookings error:', err);
    return [];
  }
}

export async function deleteUnifiedBooking(bookingId) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete booking');
  }
  return await res.json();
}

export async function updateUnifiedBookingStatus(bookingId, status) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update booking status');
  }
  return await res.json();
}

export async function bookTestDrive(bookingData) {
  const res = await fetch(`${API_BASE}/test-drives`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit test drive booking');
  }
  return await res.json();
}

export async function fetchTestDrives() {
  try {
    const res = await fetch(`${API_BASE}/test-drives`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    const data = await res.json();
    return data.bookings || [];
  } catch (err) {
    console.error('API fetchTestDrives error:', err);
    return [];
  }
}

export async function deleteTestDrive(bookingId) {
  const res = await fetch(`${API_BASE}/test-drives/${bookingId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete booking');
  }
  return await res.json();
}

export async function updateTestDriveStatus(bookingId, status) {
  const res = await fetch(`${API_BASE}/test-drives/${bookingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update booking status');
  }
  return await res.json();
}

export async function submitLoanApplication(loanData) {
  const res = await fetch(`${API_BASE}/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loanData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit loan application');
  }
  return await res.json();
}

export async function fetchLoanApplications() {
  try {
    const res = await fetch(`${API_BASE}/loans`);
    if (!res.ok) throw new Error('Failed to fetch loan applications');
    const data = await res.json();
    return data.applications || [];
  } catch (err) {
    console.error('API fetchLoanApplications error:', err);
    return [];
  }
}

export async function deleteLoanApplication(loanId) {
  const res = await fetch(`${API_BASE}/loans/${loanId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete loan application');
  }
  return await res.json();
}

export async function updateLoanStatus(loanId, status) {
  const res = await fetch(`${API_BASE}/loans/${loanId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update loan status');
  }
  return await res.json();
}

export async function submitInquiry(inquiryData) {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit inquiry');
  }
  return await res.json();
}

export async function fetchDealerships() {
  try {
    const res = await fetch(`${API_BASE}/dealerships`);
    if (!res.ok) throw new Error('Failed to fetch dealerships');
    const data = await res.json();
    return data.dealerships || [];
  } catch (err) {
    console.error('API fetchDealerships error:', err);
    return [];
  }
}

export async function reseedDatabase() {
  const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
  return await res.json();
}
