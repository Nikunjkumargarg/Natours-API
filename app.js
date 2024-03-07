const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
console.log(tours);
//route handler
app.get('/api/v1/tours/:id?',(req,res,next)=>{
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
});

// app.get('/api/v1/tours/:id',(req,res,next)=>{
//     let id = req.params.id *1;
//     let tour = tours.find(item=>item.id == id);
//     // if(id > tours.length)
//     if(!tour)
//     {
//         return res.status(404).json({
//             status:'fail',
//             message:'Invalid Id'
//         })
//     }
//     console.log(tour);
//     res.status(200).json({
//         status:'success',
//         data:{
//             tour
//         }
//     })
// })

app.post('/api/v1/tours',(req,res,next)=>{
    const newId = tour[tours.length-1].id + 1;
    const newTour = Object.assign({id:newId}, req.body);
    tour.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
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