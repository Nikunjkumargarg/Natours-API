const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID = (req,res,next,val)=>{
    let id = req.params.id *1;
    if(id > tours.length)
    {
        return res.status(404).json({
            requestedAt:req.requestTime,
            status:'fail',
            message:'Invalid Id'
        })
    }
    next();
}

exports.checkBody = (req,res,next)=>{
    if(!req.body.name || !req.body.price)
    {
        return res.status(401).json({
            status:'fail',
            message:'Missing name or duration'
        });
    }
    next();
}

exports.getTours = (req,res,next)=>{
    if(req.params.id)
    {
        let tour = tours.find(item=>item.id == id);
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
    console.log(req.body);
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
        res.status(201).json({
            requestedAt:req.requestTime,
            status:'success',
            data:{
                tour: '<Updated tour here...>'
            }
        })
};

exports.deleteTour = (req,res,next)=>{
        //204 signifies no content
        res.status(204).json({
            requestedAt:req.requestTime,
            status:'success',
            data: null
        })
};
