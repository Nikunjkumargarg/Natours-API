const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

app.use(express.json());

const tour = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
console.log(tour);
//route handler
app.get('/api/v1/tours',(req,res,next)=>{
    res.status(200).json({
        status: 'success',
        result:tour.length,
        data:{
            tour
        }
    })
})

app.post('/api/v1/tours',(req,res,next)=>{
    const newId = tour[tour.length-1].id + 1;
    const newTour = Object.assign({id:newId}, req.body);
    tour.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tour),err=>{
        res.status(201).json({
            status:'success',
            data:{
                tour: newTour
            }
        })
    })
})

app.listen(3000,()=>{
    console.log('server is running');
})