import { useState, useEffect } from 'react'
import { MapIcon } from '@heroicons/react/24/outline'

function MapSearch({ properties, onPropertySelect }) {
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [selectedProperty, setSelectedProperty] = useState(null)

  useEffect(() => {
    // В реальном приложении здесь будет инициализация карты (например, Google Maps или Leaflet)
    console.log('Инициализация карты...')
  }, [])

  useEffect(() => {
    if (map && properties) {
      // В реальном приложении здесь будет добавление маркеров на карту
      console.log('Добавление маркеров для объектов:', properties)
    }
  }, [map, properties])

  const handleMarkerClick = (property) => {
    setSelectedProperty(property)
    onPropertySelect?.(property)
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      {/* Заглушка для демонстрации */}
      <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <MapIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">
            Здесь будет интерактивная карта с объектами размещения
          </p>
        </div>
      </div>

      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-medium text-lg mb-2">{selectedProperty.title}</h3>
          <p className="text-neutral-600">{selectedProperty.location}</p>
          <p className="text-primary font-medium mt-2">
            {selectedProperty.price} ₽ за ночь
          </p>
        </div>
      )}
    </div>
  )
}

export default MapSearch 