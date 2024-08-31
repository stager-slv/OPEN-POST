const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/open_post');
}

main()
  .then( (res)=>{
    console.log("Connection Established Successfully!!!")
  } )
  .catch( (err)=>{
    console.log("Connection Failure!! ")
  } )

let postSchema = new mongoose.Schema(
  {
      user_name : {
        type : String,
        maxLength : [ 25 , "Your user name length should not more than 25 characters" ],
        minLength : [ 1 , "Your user name length should contain atleat 1 character" ],
        required : true
      },
      pass_word : {
         type : String,
         minLength : [ 8 , "Your password in weak"],
         required : true
      },
      post_desc : {
        type : String
      },
      created_time : {
        type : Date
      },
      edited_time : {
         type : Date
      }
  }
)

let Post = mongoose.model( "Post" , postSchema )

module.exports = { Post }