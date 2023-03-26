const Todo = require('../models/Todo')//imports Model for toDoSchema

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.user)
        try{
            const todoItems = await Todo.find({userId:req.user.id}).sort({"index":1})
            //const todoDate = await Todo.find({})
            const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{
            const date = new Date()
            const days = {
                            0 : 'Sunday',
                            1 : 'Monday',
                            2 : 'Tuesday',
                            3 : 'Wednesday',
                            4 : 'Thursday',
                            5 : 'Friday',
                            6 : 'Saturday'
                        }
            let index = 0;
            try{
                const sortedCollection = await Todo.find({userId:req.user.id}).sort({"index":1})
                const maxIndex = await sortedCollection.length;
                if(maxIndex){
                    index = maxIndex;
                }
            }catch(err){
                console.log(err)
            }           
            let dateStr = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()} ${days[date.getDay()]} ${date.getHours()}:${date.getMinutes()}`
            await Todo.create({todo: req.body.todoItem,date: dateStr, index: index,completed: false, userId: req.user.id})
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    },

    moveUpList: async (req, res)=>{
        try{
            const taskMoveUp = await Todo.find({_id:req.body.todoIdFromJSFile});
            let currentIndex = await taskMoveUp[0].index
            console.log(taskMoveUp,currentIndex)
            //const taskMoveDown = await Todo.find({index:currentIndex-1});
            if(currentIndex && currentIndex != 0){
                await Todo.findOneAndUpdate({index: currentIndex-1},{
                    index: currentIndex
                })
                await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                    index: currentIndex-1
                })
            }
            console.log('Moved Up List')
            res.json('Moved Up List')
        }catch(err){
            console.log(err)
        }
    }
}    