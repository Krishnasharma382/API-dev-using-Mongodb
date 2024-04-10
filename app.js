const express = require('express')
const { ObjectId } = require('mongodb')
const myObjectId = new ObjectId();
const {connectToDb, getDb} = require ('./database')



// init app & middleware
const app = express()
app.use(express.json())




// db connection
let db 
connectToDb((err) => {
    if(!err)
    {
        app.listen(2000,() =>{
            console.log("App listening to port 2000")
        })
        db = getDb()
    }
})


// routes 

app.get('/book_review',(req,res) =>{
    //current page 
    const page = req.query.p || 0 // if there is no page constant given then defalut value is 0;
    const bookperpage = 2;



    let books = []
    db.collection('book_review')
        .find() // cursor toArray foreach
        .sort({author: 1})
        .skip(page * bookperpage)
        .limit(bookperpage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books) // status 200 is just used to check if every thing is fine
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
})


app.get('/book_review/:id', (req,res) => {

    if(ObjectId.isValid(req.params.id)){
        db.collection('book_review')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        .catch((err) => {
            // console.error(err);
            res.status(500).json({error: 'Could not fetch the document'})
        })
        })
    }
    else{
        res.status(500).json({error: "Not valid Id Number !!"})
    }
})

app.post('/book_review',(req,res) => {
    const book = req.body
    db.collection('book_review')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: "Could not create a new documnet"})
        })
})

app.delete('/book_review/:id', (req,res) => {

    if(ObjectId.isValid(req.params.id)){
        db.collection('book_review')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        .catch((err) => {
            // console.error(err);
            res.status(500).json({error: 'Could not delete the document'})
        })
        })
    }
    else{
        res.status(400).json({error: "Not valid Id Number !!"})
    }
})

app.patch('/book_review/:id', (req,res) => {
    const updates = req.body
    if(ObjectId.isValid(req.params.id)){
        db.collection('book_review')
        .updateOne({_id: new ObjectId(req.params.id)},{$set: updates})
        .then(doc => {
            res.status(200).json(doc)
        .catch((err) => {
            // console.error(err);
            res.status(500).json({error: 'Could not delete the document'})
        })
        })
    }
    else{
        res.status(400).json({error: "Not valid Id Number !!"})
    }

})