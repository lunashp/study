# PaaS-TA for K8s 환경 구성 후 test

## 1. org 생성
```
Creating org luna-org as 0ad43080-d269-11ec-9996-005056a7e1b2...
OK

TIP: Use 'cf target -o "luna-org"' to target new org
ncloud@pub-vm:~/workspace/luna$ cf target -o luna-org
API endpoint:   https://api.sys.openlab-02.kr
API version:    3.108.0
user:           0ad43080-d269-11ec-9996-005056a7e1b2
org:            luna-org
No space targeted, use 'cf target -s SPACE'
ncloud@pub-vm:~/workspace/luna$ cf create-space luna-space
Creating space luna-space in org luna-org as 0ad43080-d269-11ec-9996-005056a7e1b2...
OK

Assigning role SpaceManager to user 0ad43080-d269-11ec-9996-005056a7e1b2 in org luna-org / space luna-space as 0ad43080-d269-11ec-9996-005056a7e1b2...
OK
```

## 2. space 생성
```
ncloud@pub-vm:~/workspace/luna$ cf target -o luna-org -s luna-space
API endpoint:   https://api.sys.openlab-02.kr
API version:    3.108.0
user:           0ad43080-d269-11ec-9996-005056a7e1b2
org:            luna-org
space:          luna-space
```

## 3. sample app 배포
```
-rw-rw-r-- 1 ncloud ncloud 25679220 Apr  6 16:49 spring-music.war
ncloud@pub-vm:~/workspace/luna$ cf push luna-spring-music -p spring-music.war 
Pushing app luna-spring-music to org luna-org / space luna-space as 0ad43080-d269-11ec-9996-005056a7e1b2...
Packaging files to upload...
Uploading files...
 24.51 MiB / 24.51 MiB [==================================================================================================================================================================================================] 100.00% 1s

Waiting for API to complete processing files...

...

type:            web
sidecars:        
instances:       1/1
memory usage:    1024M
start command:   bash catalina.sh run
     state     since                  cpu    memory   disk     logging      details
#0   running   2023-04-06T07:51:15Z   0.0%   0 of 0   0 of 0   0/s of 0/s   

type:            task
sidecars:        
instances:       0/0
memory usage:    1024M
start command:   bash catalina.sh run
There are no running instances of this process.

type:            tomcat
sidecars:        
instances:       0/0
memory usage:    1024M
start command:   bash catalina.sh run
There are no running instances of this process.
``` 
```
ncloud@pub-vm:~/workspace/luna$ cf apps
Getting apps in org luna-org / space luna-space as 0ad43080-d269-11ec-9996-005056a7e1b2...

name                requested state   processes                       routes
luna-spring-music   started           web:1/1, task:0/0, tomcat:0/0   luna-spring-music.apps.sys.openlab-02.kr
```

## 4. log 확인
```
ncloud@pub-vm:~/workspace/luna$ cf logs luna-spring-music
Retrieving logs for app luna-spring-music in org luna-org / space luna-space as 0ad43080-d269-11ec-9996-005056a7e1b2...

   2023-04-06T16:51:59.68+0900 [APP/PROC/WEB/2cad356a-5d0f-4201-ab84-3fbe64ddfd31] OUT Hibernate: select album0_.id as id1_0_, album0_.albumId as albumId2_0_, album0_.artist as artist3_0_, album0_.genre as genre4_0_, album0_.releaseYear as releaseY5_0_, album0_.title as title6_0_, album0_.trackCount as trackCou7_0_ from Album album0_
   2023-04-06T16:53:01.30+0900 [APP/PROC/WEB/2cad356a-5d0f-4201-ab84-3fbe64ddfd31] OUT 07:53:01,302  INFO AlbumController:54 - Deleting album b914ccae-3331-486e-b581-663f642f8e9d
   2023-04-06T16:53:01.30+0900 [APP/PROC/WEB/2cad356a-5d0f-4201-ab84-3fbe64ddfd31] OUT Hibernate: select album0_.id as id1_0_0_, album0_.albumId as albumId2_0_0_, album0_.artist as artist3_0_0_, album0_.genre as genre4_0_0_, album0_.releaseYear as releaseY5_0_0_, album0_.title as title6_0_0_, album0_.trackCount as trackCou7_0_0_ from Album album0_ where album0_.id=?
   2023-04-06T16:53:01.31+0900 [APP/PROC/WEB/2cad356a-5d0f-4201-ab84-3fbe64ddfd31] OUT Hibernate: delete from Album where id=?
   2023-04-06T16:53:01.33+0900 [APP/PROC/WEB/2cad356a-5d0f-4201-ab84-3fbe64ddfd31] OUT Hibernate: select album0_.id as id1_0_, album0_.albumId as albumId2_0_, album0_.artist as artist3_0_, album0_.genre as genre4_0_, album0_.releaseYear as releaseY5_0_, album0_.title as title6_0_, album0_.trackCount as trackCou7_0_ from Album album0_
```

## 5. sample app scale 변경 
```
ncloud@pub-vm:~/workspace/luna$ cf scale luna-spring-music -i 2
Scaling app luna-spring-music in org luna-org / space luna-space as 0ad43080-d269-11ec-9996-005056a7e1b2...

Instances starting...
Instances starting...
Instances starting...

Showing current scale of app luna-spring-music in org luna-org / space luna-space as 0ad43080-d269-11ec-9996-005056a7e1b2...

name:                luna-spring-music
requested state:     started
isolation segment:   placeholder
routes:              luna-spring-music.apps.sys.openlab-02.kr, user.luna.openlab-02.kr
last uploaded:       Thu 06 Apr 16:50:02 KST 2023
stack:               
buildpacks:          
isolation segment:   placeholder

type:           web
sidecars:       
instances:      1/2
memory usage:   1024M
     state      since                  cpu    memory        disk        logging      details
#0   running    2023-04-06T07:51:15Z   0.2%   226.4M of 0   496K of 0   0/s of 0/s   
#1   starting   2023-04-06T08:10:31Z   0.0%   0 of 0        0 of 0      0/s of 0/s   

type:           task
sidecars:       
instances:      0/0
memory usage:   1024M
There are no running instances of this process.

type:           tomcat
sidecars:       
instances:      0/0
memory usage:   1024M
There are no running instances of this process.
```
```
ncloud@pub-vm:~/workspace/luna$ cf apps
Getting apps in org luna-org / space luna-space as 0ad43080-d269-11ec-9996-005056a7e1b2...

name                requested state   processes                       routes
luna-spring-music   started           web:2/2, task:0/0, tomcat:0/0   luna-spring-music.apps.sys.openlab-02.kr, user.luna.openlab-02.kr
```

## 6. domain 생성
```
ncloud@pub-vm:~/workspace/luna$ cf create-domain luna-org luna.openlab-02.kr
Creating private domain luna.openlab-02.kr for org luna-org as 0ad43080-d269-11ec-9996-005056a7e1b2...
OK

TIP: Domain 'luna.openlab-02.kr' is a private domain. Run 'cf share-private-domain' to share this domain with a different org.
``` 
```
ncloud@pub-vm:~/workspace/luna$ cf domains
Getting domains in org luna-org as 0ad43080-d269-11ec-9996-005056a7e1b2...

name                     availability   internal   protocols
apps.sys.openlab-02.kr   shared                    http
luna.openlab-02.kr       private                   http
sys.openlab-02.kr        shared                    http
```
## 7. domain : map-route 연결 (sample App)
```
ncloud@pub-vm:~/workspace/luna$ cf map-route luna-spring-music luna.openlab-02.kr --hostname user
Creating route user.luna.openlab-02.kr for org luna-org / space luna-space as 0ad43080-d269-11ec-9996-005056a7e1b2...
OK

Mapping route user.luna.openlab-02.kr to app luna-spring-music in org luna-org / space luna-space as 0ad43080-d269-11ec-9996-005056a7e1b2...
OK
```
```
ncloud@pub-vm:~/workspace/luna$ cf apps
Getting apps in org luna-org / space luna-space as 0ad43080-d269-11ec-9996-005056a7e1b2...

name                requested state   processes                       routes
luna-spring-music   started           web:1/1, task:0/0, tomcat:0/0   luna-spring-music.apps.sys.openlab-02.kr, user.luna.openlab-02.kr
```