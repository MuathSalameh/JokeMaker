import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { escapeXML } from "ejs";

const port=3000;
const app=express();
const API_URL="https://v2.jokeapi.dev/joke/";   //the base url for the API 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req,res)=>{
res.render("index.ejs",{joke:"fill the options . . ."});
});

app.post("/",async (req,res)=>{
// all the categories in array categories
const categories=["Programming","Miscellaneous","Dark","Pun","Spooky","Christmas"];
var cat=[];
// all the flags in array
const flags=["nsfw","religious","political","racist","sexist","explicit"];
var fl=[];
for(var i =0 ; i<=categories.length ; i++){
    // check if the user has choosen any categorie and add it to cat array
    if(req.body[categories[i]]!=undefined){
         cat.push(req.body[categories[i]]);
    }
}
for(var i =0 ; i<=flags.length ; i++){
    // check if the user has choosen any flag and add it to fl array
    if(req.body[flags[i]]!=undefined){
         fl.push(req.body[flags[i]]);
    }
}
const lang =req.body.language;      // store what language did the user choose
const type=req.body.type;          // store what type of joke did the user choose 
console.log(cat+" "+ fl+" "+ lang +" "+ type );

/* if the user choose categorie but did not choose any flag*/
if(cat!=""&&fl==""){
     try{
        const result = await axios.get(API_URL+cat+"?lang="+lang+"&type="+type+"&format=txt");
        res.render("index.ejs",{joke:result.data});
        console.log(result.data);
    }
    catch(error){
        console.log(error+" error");
    }
}
/*if the user did not choose a categorie but choose a flag*/
else if(fl!=""&&cat==""){
    try{
        const result = await axios.get(API_URL+cat+"blacklistFlags="+fl+"&lang="+lang+"&type="+type+"&format=txt");
        res.render("index.ejs",{joke:result.data});
        console.log(result.data);
    }
    catch(error){
        console.log(error+" error");
    }
}
/* if the user choose both categorie and flag */
else if(cat!=""&&fl!=""){
    try{
        const result = await axios.get(API_URL+cat+"?blacklistFlags="+fl+"&lang="+lang+"&type="+type+"&format=txt");
        res.render("index.ejs",{joke:result.data});
        console.log(result.data);
    }
    catch(error){
        console.log(error+" error");
    }
}
/*if the user did not choose any thing */
else{
    try{
        const result = await axios.get(API_URL+"/any?lang="+lang+"&type="+type+"&format=txt");
        res.render("index.ejs",{joke:result.data});
        console.log(result.data);
    }
    catch(error){
        console.log(error+" error");
    }
}
});

app.listen(port,()=>{
console.log(`server running on port ${port}`);
});