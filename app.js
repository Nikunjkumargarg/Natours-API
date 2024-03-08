const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use((req,res,next)=>{
    req.requestTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getTours = (req,res,next)=>{
    if(req.params.id)
    {
        let id = req.params.id *1;
        let tour = tours.find(item=>item.id == id);
        // if(id > tours.length)
        if(!tour)
        {
            return res.status(404).json({
                requestedAt:req.requestTime,
                status:'fail',
                message:'Invalid Id'
            })
        }
        console.log(tour);
        res.status(200).json({
            requestedAt:req.requestTime,
            status:'success',
            data:{
                tour
            }
        })
    }
    else{
        res.status(200).json({
            requestedAt:req.requestTime,
            status: 'success',
            result:tours.length,
            data:{
                tours
            }
        })
}
};

const addTour = (req,res,next)=>{
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id:newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
        res.status(201).json({
            requestedAt:req.requestTime,
            status:'success',
            data:{
                tour: newTour
            }
        })
    })
};

const updateTour = (req,res,next)=>{
    let id = req.params.id *1;
        if(id > tours.length)
        {
            return res.status(404).json({
                requestedAt:req.requestTime,
                status:'fail',
                message:'Invalid Id'
            })
        }
        res.status(201).json({
            requestedAt:req.requestTime,
            status:'success',
            data:{
                tour: '<Updated tour here...>'
            }
        })
};

const deleteTour = (req,res,next)=>{
    let id = req.params.id *1;
        if(id > tours.length)
        {
            return res.status(404).json({
                requestedAt:req.requestTime,
                status:'fail',
                message:'Invalid Id'
            })
        }
        //204 signifies no content
        res.status(204).json({
            requestedAt:req.requestTime,
            status:'success',
            data: null
        })
};


const getAllUsers = (req,res,next)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}

const getUser = (req,res,next)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}

const updateUser = (req,res,next)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}

const deleteUser = (req,res,next)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}

const createUser = (req,res,next)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
}

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/:id?').get(getTours).patch(updateTour).delete(deleteTour);

tourRouter.route('/').post(addTour);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);


app.listen(3000,()=>{
    console.log('server is running');
})