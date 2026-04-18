import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BookingStatusBadge from '../components/BookingStatusBadge'
import { getBookingById } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'

function Field({ label, children }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className="mt-1 text-sm text-gray-800">{children}</div>
    </div>
  )
}

export default function BookingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    getBookingById(id)
      .then((data) => {
        if (!mounted) return
        setBooking(data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.response?.data?.error ?? 'Failed to load booking details.')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [id])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Booking Details</h1>
          <p className="text-sm text-gray-500 mt-1">View booking information.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          {booking?.status === 'PENDING' && (
            <Link
              to={`/bookings/${id}/edit`}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700"
            >
              Edit
            </Link>
          )}
        </div>
      </div>

      {loading && <p className="text-gray-400 text-sm mt-6">Loading booking…</p>}
      {!loading && error && <p className="text-red-600 text-sm mt-6">{error}</p>}

      {!loading && !error && booking && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Resource</p>
                <p className="text-lg font-semibold text-gray-800">{booking.resourceName}</p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user?.role === 'ADMIN' && (
                <Field label="Booked By">
                  <p className="font-medium">{booking.userName}</p>
                  <p className="text-xs text-gray-500">User ID: {booking.userId}</p>
                </Field>
              )}
              <Field label="Date">{booking.date}</Field>
              <Field label="Time">{booking.startTime} – {booking.endTime}</Field>
              <Field label="Expected Attendees">{booking.expectedAttendees ?? '—'}</Field>
            </div>

            <div className="mt-5">
              <p className="text-xs text-gray-500">Purpose</p>
              <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{booking.purpose || '—'}</p>
            </div>

            <div className="mt-5">
              <p className="text-xs text-gray-500">Admin Reason</p>
              <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{booking.adminReason || '—'}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-800">Meta</h2>
            <div className="mt-4 space-y-4">
              <Field label="Booking ID">{booking.id}</Field>
              <Field label="Created At">{booking.createdAt ?? '—'}</Field>
              <Field label="Updated At">{booking.updatedAt ?? '—'}</Field>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
