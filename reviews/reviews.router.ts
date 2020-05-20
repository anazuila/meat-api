import { ModelRouter } from '../common/model-router'
import * as mongoose from  'mongoose'
import * as restify from 'restify'
import { Review } from './reviews.model'
import { User } from '../users/users.model'
import { authorize } from '../security/authz.handler'

class ReviewsRouter extends ModelRouter<Review>{
  constructor(){
    super(Review)
  }

  envelope(document) {
    let resource = super.envelope(document)
    const restId = document.restaurant._id 
      ? document.restaurant._id : document.restaurant
    resource._links.restaurant = `/restaurant/${restId}`
    return resource
  }

  findById = (req, res, next) => {
    this.model.findById(req.params.id)
      .populate('user', 'name')
      .populate('restaurant', 'name')
      .then(this.render(res, next))
      .catch(next)
  }

  
  applyRoutes(application: restify.Server){
    
    application.get(`${this.basePath}`, this.findAll)
    application.get(`${this.basePath}/:id`, [this.validateId, this.findById ])
    application.post(`${this.basePath}`, [authorize('user'), this.save])
   
  }
}

export const reviewsRouter = new ReviewsRouter()