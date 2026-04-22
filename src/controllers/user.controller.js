const userService = require('../services/user.service')

async function createUser(req, res, next) {
  try {
    const result = await userService.createUser(req.body)
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

async function updateUser(req, res, next) {
  try {
    const result = await userService.updateUser(req.params.id, req.body)
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

async function getUserInfo(req, res, next) {
  try {
    const result = await userService.getUserInfo(req.headers.authorization)
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createUser,
  updateUser,
  getUserInfo
}