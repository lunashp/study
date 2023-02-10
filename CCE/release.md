### ubuntu@ubuntu:~/workspace/cce-check/release/jobs/cce-common/templates/scripts$ vim cce-common.sh.erb
```
#!/bin/bash
  
set -e -x

echo "<%= spec.ip %>" | ./linux_v4.1.bin

echo "#######[CCE :: linux_v4.1.bin ::  END]####################"

sleep 2

./python_be.sh

sleep 60

./linux_xlsx.py
```


### ubuntu@ubuntu:~/workspace/cce-check/release/jobs/cce-common/templates/scripts$ vi ../../spec
```
---
name: cce-common

templates:
  post-deploy.sh.erb: bin/post-deploy
  scripts/cce-common.sh.erb: scripts/cce-common.sh
  scripts/linux_v4.1.bin: scripts/linux_v4.1.bin
  scripts/python_be.sh: scripts/python_be.sh
  scripts/linux_xlsx.py: scripts/linux_xlsx.py

packages: []

properties: {}

```

### bosh 배포 시 스크립트 적용 안됨
```
  Updating instance 'bosh/0'... Finished (00:02:38)
  Waiting for instance 'bosh/0' to be running... Finished (00:01:35)
  Running the post-start scripts 'bosh/0'... Failed (00:01:11)
Failed deploying (00:40:04)

Cleaning up rendered CPI jobs... Finished (00:00:00)

Deploying:
  Running the post-start script:
    Sending 'get_task' to the agent:
      Agent responded with error: Action Failed get_task: Task 6d93df7d-b6fd-47f2-4f24-1f1627c9a902 result: 1 of 7 post-start scripts failed. Failed Jobs: cce-bosh. Successful Jobs: director, uaa, postgres_conf, tomcat_conf, common_script, credhub.

Exit code 1

```
#### # bosh/0:/var/vcap/jobs/cce-bosh/scripts# vim cce.sh
```
#!/bin/bash

set -e -x

echo "10.0.21.10" | ./linux_v4.1.bin

echo "#######[CCE :: linux_v4.1.bin ::  END]####################"


sleep 2
./python_be.sh; ./bosh_txt_xlsx.py



./postgresql_v4.1.bin << EOF
10.0.21.10
/var/vcap/packages/postgres-10/bin/
/var/vcap/store/postgres-10
127.0.0.1
bosh
5432
postgres

EOF

#######[CCE :: postgresql_v4.1.bin ::  END]####################
export JRE_HOME=/var/vcap/packages/uaa/jdk

./tomcat_v4.1.bin << EOF
10.0.21.10
/var/vcap/data/uaa/tomcat
/var/vcap/data/uaa/tomcat/conf
/var/vcap/data/uaa/tomcat/webapps

EOF

#######[CCE :: tomcat_v4.1.bin ::  END]####################


./nginx.sh << EOF
10.0.21.10

EOF

#######[CCE :: nginx.sh ::  END]####################


./uaa.sh << EOF
10.0.21.10

EOF

#######[CCE :: uaa.sh ::  END]####################

```
#### # bosh/0:/var/vcap/cce# ll
```
total 260
drwxr-xr-x  2 root root   4096 Feb 10 13:40 ./
drwxr-xr-x 11 root root   4096 Feb 10 13:40 ../
-rwxr-x--x  1 root root  12869 Feb 10 13:40 bosh_txt_xlsx.py*
-rwxr-x--x  1 root root    794 Feb 10 13:40 cce.sh*
-rw-r--r--  1 root root   4193 Feb 10 13:40 Linux_31fdcfbb-4800-4d8a-7039-7009654bb4d9_10.0.21.10_0210_Ref.txt
-rw-r--r--  1 root root  29590 Feb 10 13:40 Linux_31fdcfbb-4800-4d8a-7039-7009654bb4d9_10.0.21.10_0210.txt
-rwxr-x--x  1 root root 114311 Feb 10 13:40 linux_v4.1.bin*
-rwxr-x--x  1 root root   4812 Feb 10 13:40 nginx.sh*
-rwxr-x--x  1 root root  28698 Feb 10 13:40 postgresql_v4.1.bin*
-rwxr-x--x  1 root root    171 Feb 10 13:40 python_be.sh*
-rwxr-x--x  1 root root  27520 Feb 10 13:40 tomcat_v4.1.bin*
-rwxr-x--x  1 root root   4411 Feb 10 13:40 uaa.sh*
```