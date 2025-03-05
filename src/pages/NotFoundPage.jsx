import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-neutral-900">Page not found</h2>
        <p className="mt-2 text-lg text-neutral-700">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-primary inline-flex items-center"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage