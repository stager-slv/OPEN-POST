const express = require("express")
const app = express()
const port = 18000
const path = require("path")
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const { Post } = require("./post.js")

app.listen( port , ()=>{
    console.log("Serve is Ready!! Server listening at the port : "+port )
}) 

app.set( "view engine" , "ejs" )

app.set( "views" , path.join(__dirname,"/views") ) 

app.use( express.static( path.join( __dirname , "/public/css" ) )  )
app.use( express.static( path.join( __dirname , "/public/js" ) ) )

app.use( express.urlencoded( { extended : true } ) )

app.use( express.json() )

app.use(methodOverride('_method'))

let data = []

/* Intro Page Rendering */
app.get( "/" , ( req_1,res_1 )=>{
    console.log("Request received from intro page !!")
    Post.find()
      .then( (res_2)=>{ 
         data = res_2
         res_1.render( "home.ejs" , { user_count : res_2.length  }  )
      } )
      .catch( (err_2)=>{
          console.log( err_2 )
      } )
} )


/* ALL POSTS DISPLAY */
app.get( "/posts" , (req_1,res_1)=>{
    console.log("Request received to display all posts")
    Post.find()
      .then( (res_2)=>{
          console.log("All users received from database...")
          data = res_2
          res_1.render( "users.ejs" , { usersArray : res_2 } ) 
      } )
      .catch( (err_2 )=>{
          console.log( err_2 )
      } )
} )

/* ADD NEW POST */
   // NEW USER DETAILS PAGE
   app.get( "/posts/new_post/:validity" , (req_1,res_1)=>{
       console.log("Request new_user.ejs file ")
       let req_obj = req_1.params

       res_1.render( "new_user.ejs" , { validity : req_obj["validity"] } ) 
   } )

   //  ADDING NEW USER INTO DATABASE
   app.post( "/new_post" , (req_1,res_1)=>{
       console.log("Request to new user into databse")
       let new_user = req_1.body

       Post.insertMany( 
           [
              {
                user_name : new_user.user_name.trim(),
                pass_word : new_user.pass_word.trim(),
                post_desc : new_user.post_desc.trim(),
                created_time : new Date(),
                edited_time : null
              }
           ]
        )
           .then( (res_2)=>{
               console.log("Data Inserted in Database Successful")
               res_1.redirect( "/posts" )
           } )
           .catch( (err)=>{
               console.log( err )
               res_1.redirect( "/posts/new_post/false" )
           } )
   } )

// VERIFY 
app.get( "/verify/:operation/:id/:validity" , (req_1,res_1)=>{
    console.log("Request received for verification")
    let parameters = req_1.params
    console.log( parameters ) 
    res_1.render( "verify.ejs" , { operation : parameters.operation , id : parameters.id , validity : parameters.validity } )
} )

/* EDIT A POST  */
   /* First the verification is done on verify.ejs file */

   // 'EDIT USER EJS' FILE RENDERING
   app.post( "/posts/editable_user/:id/:validity" , (req_1,res_1)=>{
        console.log("Request received for EDIT USER FILE !!")
        let parameters = req_1.params
        let body = req_1.body

        let post_obj = getPostById( parameters["id"] )[0]
        console.log( post_obj )
        console.log( body )

        if( ( post_obj!=null && post_obj.pass_word==body.pass_word ) ||  ( post_obj!=null && post_obj.user_name!=undefined ) ){
           res_1.render( "edit_user.ejs" , { editable_obj : post_obj , validity : parameters.validity } )
        }
        else{
            res_1.render( "error.ejs" )
        }
   } )

   // EDIT USER ON DATABASE
   app.patch( "/editable_post/:id" , (req_1,res_1)=>{
      console.log("Request received for UPDATING THE DATABSE")
      let parameters = req_1.params
      let body = req_1.body
      console.log( parameters )


      Post.findByIdAndUpdate( parameters.id , {
           user_name : body["user_name"],
           pass_word : body["pass_word"],
           post_desc : body["post_desc"],
           edited_time : new Date()
      } , { runValidators : true , new : true } )
        .then( (res_2)=>{
            console.log("Updated Value")
            console.log( res_2 )
            res_1.redirect( "/posts" )
        } )
        .catch( (err)=>{
            console.log( err )
            res_1.redirect( 307 , "/posts/editable_user/"+parameters.id+"/false" )
        } )

   } )


/* DELETE A POST */
    /* First the verification is done on verify.ejs file */
    // DELETING IN DATABASE
    app.post( "/posts/deletable_user/:id/:validity" , (req_1,res_1)=>{
        console.log("Request received for DELETE USER !!")
        let parameters = req_1.params
        let body = req_1.body

        let post_obj = getPostById( parameters["id"] )[0]
        console.log( post_obj )
        console.log( body )

        if( ( post_obj!=null && post_obj.pass_word==body.pass_word ) ){
           Post.findByIdAndDelete( parameters.id )
             .then( (res_2)=>{
                 console.log( res_2 )
                 res_1.redirect( "/posts" )
             } )
             .catch( (err)=>{
                 console.log( err )
                 res_1.redirect( "/verify/deletable_user/"+parameters.id+"/false" )
             } )
        }
        else{
            res_1.render( "error.ejs" )
        }
    } )



function getPostById( del_id ) {
    return data.filter( (post)=>( post["_id"]==del_id ) )
}
   

