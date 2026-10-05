import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getDemoRegistrations, getDemoCheckins, qrImageUrl } from '../utils/demoCheckin'
import sampleEvents from '../data/sampleEvents'
import { formatDateTime } from '../utils/dateUtils'

export default function DemoRegistrationsPage() {
  // Read fresh on each render so the page reflects localStorage state
  const [registrations] = useState(() => getDemoRegistrations())
  const checkins         = getDemoCheckins()

  return (
    <>
      <Helmet>
        <title>My Demo Registrations — Madurai EventSphere</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Demo Registrations</h1>
          <p className="text-sm text-gray-500 mt-1">
            QR codes for your demo event registrations. Show these at the check-in desk.
          </p>
          <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-3 inline-block">
            Demo mode — registrations are stored only in this browser.
          </p>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-gray-700 font-medium mb-1">No demo registrations yet</p>
            <p className="text-sm text-gray-500 mb-5">
              Browse events and register for a demo event to get your QR code.
            </p>
            <Link to="/" className="text-sm font-semibold text-blue-600 hover:underline">
              Browse events →
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {registrations.map(reg => {
              const event      = sampleEvents.find(e => e.id === reg.eventId)
              const isCheckedIn = Boolean(checkins[reg.token.toUpperCase()] || checkins[reg.token])
              const checkinTime = (checkins[reg.token.toUpperCase()] || checkins[reg.token])?.checkedInAt

              return (
                <li key={reg.token} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex flex-col sm:flex-row gap-5 items-start">

                    {/* QR code */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <img
                        src={qrImageUrl(reg.token, 160)}
                        alt={`QR code for ${reg.token}`}
                        width={160}
                        height={160}
                        className="rounded-xl border border-gray-200"
                      />
                      <p className="text-[11px] font-mono text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 select-all tracking-widest">
                        {reg.token}
                      </p>
                    </div>

                    {/* Event details */}
                    <div className="flex-1 min-w-0">
                      {event ? (
                        <>
                          <Link
                            to={`/events/${event.id}`}
                            className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {event.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {event.venue_name} · {event.micro_location}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(event.event_date)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Event data not found (may have been removed)</p>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        Registered {formatDateTime(reg.registeredAt)}
                      </p>

                      {/* Check-in status */}
                      {isCheckedIn ? (
                        <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Checked in {checkinTime ? formatDateTime(checkinTime) : ''}
                        </div>
                      ) : (
                        <div className="mt-3 inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Not yet checked in
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
