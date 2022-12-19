import axios from 'axios'

axios.get('https://jsonplaceholder.typicode.com/posts/1')
.then(function(res){
    console.log(res)
    console.log(res.data)
    console.log(res.data.userId)
    console.log(res.data.id)
    console.log(res.data.title)
    console.log(res.data.body)
})