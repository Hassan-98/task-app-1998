const express = require("express")
const router = express.Router()

// Middlewares
const auth = require("../middleware/auth_middleware")

// Models
const Task = require("../models/task_model")

// Creating A New Task
router.post("/tasks", auth, async (req, res) => {
   try {
      const task = {
         ...req.body,
         author: req.session.user._id
      }
      let newTask = await new Task(task).save()
      res.status(201).send(newTask)
   } catch (e) {
      console.log(e.message)
      res.status(400).send(e.message)
   }
})

// Getting All Tasks
router.get("/tasks", auth, async (req, res) => {
   try {
      const sort = {}
      if (req.query.sort) {
         let sortBy = req.query.sort.split(":")[0]
         let sortType = req.query.sort.split(":")[1]
         sort[sortBy] = sortType === "desc" ? -1 : 1
      }
      let state;
      if (req.query.state) {
         state = req.query.state === "true" ? true : false
         var tasks = await Task.find({ author: req.session.user._id, state }, null, {
            limit: Number(req.query.limit),
            skip: Number(req.query.skip),
            sort
         })
      } else {
         var tasks = await Task.find({ author: req.session.user._id }, null, {
            limit: Number(req.query.limit),
            skip: Number(req.query.skip),
            sort
         })
      }

      res.render("tasks", {
         tasks,
         user: req.session.user
      })
      
   } catch (e) {
      req.flash("getTasksError", e.message)
      res.render("tasks", {
         error: req.flash("getTasksError")
      })
   }
})

// Getting A Speicifed Task
router.get("/tasks/:id", auth, async (req, res) => {
   let id = req.params.id
   try {
      let task = await Task.findOne({
         _id: id,
         author: req.session.user._id
      })
      
      if (!task) return res.status(404).send("Task Not Found")

      res.status(200).send(task)
   } catch (e) {
      res.status(404).send(e.message)
   }
})

// Updating A Task
router.patch("/tasks/:id", auth, async (req, res) => {
   const updates = Object.keys(req.body)
   try {
      const task = await Task.findOne({
         _id: req.params.id,
         author: req.session.user._id
      })

      updates.forEach(update => task[update] = req.body[update])
      const updatedTask = await task.save()

      res.status(200).send(updatedTask)
   } catch (e) {
      res.status(404).send(e.message)
   }
})

// Deleting A Task
router.delete("/tasks/:id", auth, async (req, res) => {
   try {
      await Task.findOneAndDelete({
         _id: req.params.id,
         author: req.session.user._id
      })
      res.sendStatus(200)
   } catch (e) {
      console.log(e.message)
      res.status(404).send(e.message)
   }

})

module.exports = router