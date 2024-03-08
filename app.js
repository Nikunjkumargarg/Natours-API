const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

app.use(express.json());

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
                status:'fail',
                message:'Invalid Id'
            })
        }
        console.log(tour);
        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        })
    }
    else{
        res.status(200).json({
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
                status:'fail',
                message:'Invalid Id'
            })
        }
        res.status(201).json({
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
                status:'fail',
                message:'Invalid Id'
            })
        }
        //204 signifies no content
        res.status(204).json({
            status:'success',
            data: null
        })
};

app.route('/api/v1/tours/:id?').get(getTours).patch(updateTour).delete(deleteTour);

app.route('/api/v1/tours').post(addTour);

app.listen(3000,()=>{
    console.log('server is running');
})