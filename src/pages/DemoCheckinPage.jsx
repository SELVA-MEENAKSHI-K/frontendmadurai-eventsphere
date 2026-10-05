import { useState, useEffect, useRef, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { processCheckin, getDemoCheckins } from '../utils/demoCheckin'
import sampleEvents from '../data/sampleEvents'
import { formatDateTime } from '../utils/dateUtils'

// ── BarcodeDetector availability ───────────────────────────────────────────────
const BARCODE_SUPPORTED = typeof window !== 'undefined' && 'BarcodeDetector' in window

export default function DemoCheckinPage() {
  const [mode, setMode]             = useState(BARCODE_SUPPORTED ? 'camera' : 'manual')
  const [scanning, setScanning]     = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [manualToken, setManualToken] = useState('')
  const [result, setResult]         = useState(null)   // { status, eventId?, checkedInAt?, message }
  const [history, setHistory]       = useState(() => {
    const checkins = getDemoCheckins()
    return Object.entries(checkins).map(([token, v]) => ({ token, ...v }))
      .sort((a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt))
  })

  const videoRef      = useRef(null)
  const streamRef     = useRef(null)
  const detectorRef   = useRef(null)
  const rafRef        = useRef(null)
  const lastTokenRef  = useRef(null)

  // ── Camera / scanner lifecycle ────────────────────────────────────────────────

  const stopCamera = useCallback(() => {
    if (rafRef.current)   cancelAnimationFrame(rafRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    streamRef.current = null
    rafRef.current    = null
    setScanning(false)
  }, [])

  const handleDetected = useCallback((rawToken) => {
    const token = String(rawToken).trim().toUpperCase()
    // Debounce — ignore the same token for 3 seconds
    if (lastTokenRef.current === token) return
    lastTokenRef.current = token
    setTimeout(() => { lastTokenRef.current = null }, 3000)

    stopCamera()
    applyCheckin(token)
  }, [stopCamera]) // eslint-disable-line react-hooks/exhaustive-deps

  const startCamera = useCallback(async () => {
    setCameraError(null)
    setResult(null)
    lastTokenRef.current = null

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      if (!detectorRef.current) {
        detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] })
      }

      setScanning(true)

      const tick = async () => {
        if (!videoRef.current || !streamRef.current) return
        try {
          const barcodes = await detectorRef.current.detect(videoRef.current)
          if (barcodes.length > 0) {
            handleDetected(barcodes[0].rawValue)
            return
          }
        } catch { /* ignore frame errors */ }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } catch (err) {
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Use manual entry below.'
          : `Camera unavailable: ${err.message}`
      )
      setMode('manual')
    }
  }, [handleDetected])

  // Stop camera when component unmounts or user switches to manual
  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  useEffect(() => {
    if (mode === 'manual') stopCamera()
  }, [mode, stopCamera])

  // ── Check-in logic ────────────────────────────────────────────────────────────

  function applyCheckin(token) {
    const outcome = processCheckin(token)
    const event   = sampleEvents.find(e => e.id === outcome.eventId)

    const resultObj = {
      token,
      status:      outcome.status,
      eventId:     outcome.eventId,
      eventTitle:  event?.title ?? outcome.eventId,
      checkedInAt: outcome.checkedInAt,
    }
    setResult(resultObj)

    if (outcome.status === 'ok') {
      toast.success('Check-in successful!')
      // Refresh history
      setHistory(prev => [
        { token, eventId: outcome.eventId, checkedInAt: outcome.checkedInAt },
        ...prev,
      ])
    } else if (outcome.status === 'already_checked_in') {
      toast('Already checked in', { icon: '⚠️' })
    } else {
      toast.error('Invalid token — not found in demo registrations.')
    }
  }

  function handleManualSubmit(e) {
    e.preventDefault()
    const token = manualToken.trim().toUpperCase()
    if (!token) return
    setManualToken('')
    applyCheckin(token)
  }

  // ── Result display ────────────────────────────────────────────────────────────

  function ResultCard() {
    if (!result) return null
    const { status, token, eventTitle, checkedInAt } = result

    if (status === 'ok') return (
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 mt-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-green-800">Check-in successful</p>
          <p className="text-sm text-green-700">{eventTitle}</p>
          <p className="text-xs text-green-600 mt-0.5">{formatDateTime(checkedInAt)}</p>
          <p className="text-xs font-mono text-green-600 mt-1">{token}</p>
        </div>
      </div>
    )

    if (status === 'already_checked_in') return (
      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-yellow-800">Already checked in</p>
          <p className="text-sm text-yellow-700">{eventTitle}</p>
          <p className="text-xs font-mono text-yellow-700 mt-1">{token}</p>
        </div>
      </div>
    )

    return (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mt-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-red-800">Invalid token</p>
          <p className="text-sm text-red-600">This token was not found in demo registrations.</p>
          <p className="text-xs font-mono text-red-500 mt-1">{token}</p>
        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      <Helmet>
        <title>Demo Check-in — Madurai EventSphere</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/organizer/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Demo QR Check-in</h1>
          <p className="text-sm text-gray-500 mt-1">
            Scan an attendee's QR code or enter their token manually.
          </p>
          <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-3 inline-block">
            Demo mode — check-in data is stored only in this browser.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-5">
          {BARCODE_SUPPORTED && (
            <button
              onClick={() => { setMode('camera'); setResult(null) }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                mode === 'camera'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
              }`}
            >
              📷 Scan QR
            </button>
          )}
          <button
            onClick={() => { setMode('manual'); setResult(null) }}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              mode === 'manual'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
            }`}
          >
            ⌨️ Enter token
          </button>
        </div>

        {/* Camera scanner */}
        {mode === 'camera' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            {cameraError && (
              <p className="text-sm text-red-500 mb-3" role="alert">{cameraError}</p>
            )}
            <div className="relative bg-gray-900 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3', maxHeight: 320 }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                aria-label="Camera viewfinder for QR scanning"
              />
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-white/60 rounded-2xl" aria-hidden="true" />
                </div>
              )}
              {!scanning && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60">
                  <p className="text-white text-sm">Camera not started</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              {!scanning ? (
                <button
                  onClick={startCamera}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Start scanning
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Stop
                </button>
              )}
            </div>
            {!BARCODE_SUPPORTED && (
              <p className="text-xs text-gray-400 mt-2 text-center">
                QR scanning requires Chrome 83+ on Android/desktop. Use manual entry on other browsers.
              </p>
            )}
          </div>
        )}

        {/* Manual token entry */}
        {mode === 'manual' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="token-input" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration token
                </label>
                <input
                  id="token-input"
                  type="text"
                  value={manualToken}
                  onChange={e => setManualToken(e.target.value.toUpperCase())}
                  placeholder="ES-sample-1-AB12CD34"
                  className="w-full font-mono text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <button
                type="submit"
                disabled={!manualToken.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl transition-colors"
              >
                Check in
              </button>
            </form>
          </div>
        )}

        {/* Result */}
        <ResultCard />

        {/* Scan again button after a result */}
        {result && (
          <button
            onClick={() => {
              setResult(null)
              if (BARCODE_SUPPORTED) { setMode('camera') } else { setMode('manual') }
            }}
            className="mt-3 w-full border border-gray-200 hover:border-blue-400 text-gray-600 font-medium py-2.5 rounded-xl transition-colors text-sm"
          >
            Check in another attendee
          </button>
        )}

        {/* Check-in history */}
        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Check-ins this session ({history.length})
            </h2>
            <ul className="space-y-2">
              {history.map(entry => {
                const event = sampleEvents.find(e => e.id === entry.eventId)
                return (
                  <li key={entry.token} className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{event?.title ?? entry.eventId}</p>
                      <p className="text-xs font-mono text-gray-400 truncate">{entry.token}</p>
                    </div>
                    <p className="flex-shrink-0 text-xs text-gray-500">{formatDateTime(entry.checkedInAt)}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
