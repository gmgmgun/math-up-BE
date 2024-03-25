1. .env.sample 에 따라 작성 / server.js 에 client 본인 db로 바꿔야함
2. uploadRouter에 나와있는 progress, drogndrop은 단순히 라우터만 나눠놓은거임 하나지워도됨
3. router에 upload 미들웨어 걸려있는건, multer 모듈 통해서 파일 타입 및 용량을 걸러내기위한 미들웨어임
4. controller단에서 map걸려있는이유는 여러개 파일을 받기위함 , promise.all은 비동기로인해 끝나기전에 마무리되는경우가 있어서 순회 다돌고 마무리하기위함
5. service 단에 credentials 경로 바꾸시길 바람, 본인 서비스계정 key 가져와서 경로지정해야함
6. data는 moment가 간편해서 moment썼음, 본인이 따로 바꾸고싶으면 바꾸면됨
7. size 역시 byte로 표시되기때문에 MegaByte로 변환하기위해 나누기만 했음, 로직바꾸고싶으면 바꿔도됨
8. util단에 있는 postGoogleSheet에 range는 시트파일명이 아닌 시트이름임, 그거에 따라바꾸면됨
9. valueInputOption은 그냥 그대로 냅두는게 좋음, raw 는 스트링형식으로 바로 들어가지만, user_entered는 sheet 서식을 적용받아서 내용이 달라질수있음
10. 몽구스가아닌 몽고DB임 / 양샘이 몽구스말고 몽고DB쓴다고 하셔서 기술맞추기위해 썼음 참고바람
11. 나중에 서비스 배포 시 합쳐지면 user.name이나 user.id 등등 추가해서 넣어서 DB 및 SHEET 관리하는게 좋음
