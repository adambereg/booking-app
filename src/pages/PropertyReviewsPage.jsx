import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

function PropertyReviewsPage() {
  const { id } = useParams()
  const { supabase, session } = useSupabase()
  const [property, setProperty] = useState(null)
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [userCanReview, setUserCanReview] = useState(false)

  useEffect(() => {
    const loadPropertyAndReviews = async () => {
      setIsLoading(true)
      
      try {
        // In a real app, you would fetch this data from Supabase
        // For now, we'll use mock data
        const mockProperty = {
          id: 1,
          title: 'Уютная квартира в центре Новосибирска',
          location: 'Центральный район, Новосибирск',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          host: {
            name: 'Анна Иванова',
            image: 'https://randomuser.me/api/portraits/women/44.jpg'
          }
        }
        
        const mockReviews = [
          {
            id: 1,
            user: {
              name: 'Михаил Петров',
              image: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            rating: 5,
            comment: 'Отличная квартира! Очень чисто, уютно и комфортно. Расположение идеальное - в самом центре, рядом много кафе и ресторанов. Хозяйка очень приветливая и отзывчивая. Обязательно вернусь сюда еще раз!',
            date: new Date(2025, 3, 15)
          },
          {
            id: 2,
            user: {
              name: 'Елена Смирнова',
              image: 'https://randomuser.me/api/portraits/women/26.jpg'
            },
            rating: 4,
            comment: 'Хорошая квартира с удобным расположением. Есть все необходимое для комфортного проживания. Единственный минус - немного шумно из-за близости к дороге, но в целом все отлично.',
            date: new Date(2025, 2, 20)
          },
          {
            id: 3,
            user: {
              name: 'Дмитрий Иванов',
              image: 'https://randomuser.me/api/portraits/men/67.jpg'
            },
            rating: 5,
            comment: 'Прекрасная квартира! Чисто, уютно, есть абсолютно все необходимое. Хозяйка очень внимательная и доброжелательная. Расположение супер - в самом центре, но при этом тихо. Рекомендую!',
            date: new Date(2025, 1, 10)
          }
        ]
        
        // Check if user has completed a stay at this property
        // In a real app, you would check this from the database
        const hasCompletedStay = true
        
        // Check if user has already left a review
        // In a real app, you would check this from the database
        const hasLeftReview = false
        
        setProperty(mockProperty)
        setReviews(mockReviews)
        setUserCanReview(hasCompletedStay && !hasLeftReview)
      } catch (error) {
        console.error('Error loading property and reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPropertyAndReviews()
  }, [id, supabase, session])

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating })
  }

  const handleCommentChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (newReview.rating === 0) {
      setErrorMessage('Пожалуйста, выберите рейтинг')
      return
    }
    
    if (newReview.comment.trim() === '') {
      setErrorMessage('Пожалуйста, напишите отзыв')
      return
    }
    
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')
    
    try {
      // In a real app, you would submit the review to Supabase
      // For now, we'll simulate a successful submission
      
      setTimeout(() => {
        // Create a new review object
        const newReviewObj = {
          id: reviews.length + 1,
          user: {
            name: 'Вы',
            image: session?.user?.user_metadata?.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg'
          },
          rating: newReview.rating,
          comment: newReview.comment,
          date: new Date()
        }
        
        // Add the new review to the list
        setReviews([newReviewObj, ...reviews])
        
        // Reset the form
        setNewReview({ rating: 0, comment: '' })
        
        // Show success message
        setSuccessMessage('Ваш отзыв успешно добавлен!')
        
        // User can no longer review
        setUserCanReview(false)
        
        setIsSubmitting(false)
      }, 1500)
    } catch (error) {
      console.error('Error submitting review:', error)
      setErrorMessage('Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте позже.')
      setIsSubmitting(false)
    }
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Объект не найден</h1>
          <Link to="/search" className="btn-primary">
            Вернуться к поиску
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to={`/properties/${id}`} className="text-primary hover:text-primary-dark">
          &larr; Вернуться к объекту
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900 mt-4 mb-2">{property.title}</h1>
        <p className="text-neutral-700">{property.location}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6 mb-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <StarIcon className="h-6 w-6 text-primary" />
                <span className="ml-2 text-2xl font-bold">{calculateAverageRating()}</span>
              </div>
              <span className="mx-3 text-neutral-300">|</span>
              <span className="text-neutral-700">{reviews.length} {reviews.length === 1 ? 'отзыв' : reviews.length >= 2 && reviews.length <= 4 ? 'отзыва' : 'отзывов'}</span>
            </div>
            
            {userCanReview && (
              <div className="mb-8 border-b border-neutral-200 pb-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Оставить отзыв</h2>
                
                {successMessage && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {successMessage}
                  </div>
                )}
                
                {errorMessage && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errorMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Ваша оценка
                    </label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="p-1"
                          onClick={() => handleRatingChange(rating)}
                        >
                          {rating <= newReview.rating ? (
                            <StarIcon className="h-8 w-8 text-primary" />
                          ) : (
                            <StarOutlineIcon className="h-8 w-8 text-neutral-300 hover:text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 mb-2">
                      Ваш отзыв
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="input-field"
                      value={newReview.comment}
                      onChange={handleCommentChange}
                      placeholder="Расскажите о вашем опыте проживания"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Отправка...
                        </span>
                      ) : (
                        'Отправить отзыв'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Отзывы гостей</h2>
              
              {reviews.length === 0 ? (
                <p className="text-neutral-700">У этого объекта пока нет отзывов.</p>
              ) : (
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-200 pb-8 last:border-b-0 last:pb-0">
                      <div className="flex items-start">
                        <img
                          src={review.user.image}
                          alt={review.user.name}
                          className="h-12 w-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-medium text-neutral-900">{review.user.name}</h3>
                          <p className="text-sm text-neutral-500">
                            {review.date.toLocaleDateString('ru-RU', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <div className="flex mt-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-primary' : 'text-neutral-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-neutral-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24 card p-6">
            <div className="flex items-center mb-4">
              <img
                src={property.host.image}
                alt={property.host.name}
                className="h-14 w-14 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-medium text-neutral-900">Хозяин: {property.host.name}</h3>
                <p className="text-sm text-neutral-500">Суперхост</p>
              </div>
            </div>
            
            <p className="text-neutral-700 mb-6">
              Если у вас есть вопросы об отзывах или вы хотите узнать больше об этом жилье, свяжитесь с хозяином.
            </p>
            
            <button className="w-full btn-primary mb-3">
              Связаться с хозяином
            </button>
            
            <Link to={`/properties/${id}`} className="w-full block text-center btn-secondary">
              Вернуться к объекту
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyReviewsPage