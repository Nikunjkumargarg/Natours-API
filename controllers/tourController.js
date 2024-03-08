const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getTours = (req,res,next)=>{
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

exports.addTour = (req,res,next)=>{
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

exports.updateTour = (req,res,next)=>{
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

exports.deleteTour = (req,res,next)=>{
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
