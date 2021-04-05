
GET: /auth/user
> Authentication: Bearer *token*
      
RESPONSE 200:
>     
     {
      "status": 200,  
      "data": { 
            "email": "test@gmail.com",  
            "name": "test",  
            "avatar": "https://s.gravatar.com/avatar/1aedb8d9dc4751e229a335e371db8058?s=250",  
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNmFjOGI4OTEyZWU0YTc4M2YzZWNmOSIsImlhdCI6MTYxNzYxMTE2MywiZXhwIjoxNjE3NjE4MzYzfQ.QUge2wSHuzmPSDMobEdn7jmRv4HzxNaXMynZAdpyqnE" 
              }
      }


POST: /auth/register 
>
      body: { 
            "email": "test@gmail.com",
            "password": "hello!"
            }
 
RESPONSE 201: 
>
      {
            "status": "success",
            "code": 201,
            "data": {
                  "email": "test@gmail.com",
                  "name": "test",
                  "avatar": "https://s.gravatar.com/avatar/1aedb8d9dc4751e229a335e371db8058?s=250"
                   }
      }

POST: /auth/login
> 
      body: {
            "email": "test@gmail.com",
            "password": "hello!"
      }
      
RESPONSE 200: 
>
      {
            "status": "success",
            "code": 200,
            "data": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNmFjOGI4OTEyZWU0YTc4M2YzZWNmOSIsImlhdCI6MTYxNzYxMTAyOSwiZXhwIjoxNjE3NjE4MjI5fQ.B4ZQgV6hrZp8RhR-KnBkV1Rw9jSR7QIXA-OSna-H24I",
            "email": "test@gmail.com",
            "name": "test"
            }
      }
    
    
POST: /auth/logout
>
      Authentication: Bearer *token*
      
RESPONSE 204: 
>
      {
      }
