import { Link } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/24/solid'

function PropertyCard({ property }) {
  return (
    <Link to={`/properties/${property.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow duration-300">
        <div className="relative pb-[56.25%]">
          <img
            src={property.images[0]}
            alt={property.title}
            className="absolute h-full w-full object-cover rounded-t-xl"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-neutral-900 truncate">{property.title}</h3>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-primary" />
              <span className="ml-1 text-sm text-neutral-700">{property.rating}</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-neutral-500">{property.location}</p>
          <p className="mt-1 text-sm text-neutral-500">{property.type}</p>
          <p className="mt-2 text-neutral-900 font-semibold">{property.price} ₽ <span className="font-normal text-neutral-500">сутки</span></p>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard